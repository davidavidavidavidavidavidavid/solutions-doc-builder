import { renderMath } from './katex-render.js';
import { buildAreaModelEl, initAreaModelEditor } from './area-model.js';
import { renderDiagramCode } from './batex-renderer.js';

const PDF_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// ── Constants ─────────────────────────────────────────────────────────────

const TYPE_LABELS = {
  'full-solution': 'Full Solution',
  'look-out':      'Look Out',
  'connections':   'Connections',
  'prompt':        'Prompt',
  'custom':        ''
};

function migrateEntryType(type) {
  switch (type) {
    case 'solution':            return 'full-solution';
    case 'strategy':
    case 'pss':
    case 'error':               return 'look-out';
    case 'pattern':             return 'connections';
    case 'hint':
    case 'prompting question':
    case 'prompt':              return 'prompt';
    case 'full-solution':
    case 'look-out':
    case 'connections':
    case 'custom':              return type;
    default:                    return 'custom';
  }
}

const LS_KEY = 'solutions-doc-v1';

const THUMB_SLOTS = {
  '4-up': [0, 1, 2, 3],
  '3-up': [0, 1, 2],
  '2-up': [0, 1],
  '1-up': [0]
};

function layoutClass(l) { return 'layout-' + l.replace(/-/g, ''); }

// ── State ─────────────────────────────────────────────────────────────────

const state = {
  unit: '',
  viewMode: 'print',
  currentLesson: { num: '1', name: '' },
  pdfPages: [], // flat ordered array of base64 JPEGs, one per uploaded PDF page
  items: []
  // item types:
  //   { type:'lesson-label', id, num, name }
  //   { type:'sheet', id, lesson:{num,name}, layout, sectionTitle,
  //     images:[null×4] (manual uploads), entries:[], printToggles:{} }
  //   Sheet also carries _pdfSlots:[null×4] at runtime (not persisted)
  // entry: { id, num, type, customLabel, body, diag, areaModel:{a,b}|null, batexCode:str|null, batexDataUrl:str|null, zoomLevel:number|null }
};

// ── Autosave ──────────────────────────────────────────────────────────────

let autosaveTimer = null;

function scheduleAutosave() {
  clearTimeout(autosaveTimer);
  setAutosaveStatus('saving…');
  autosaveTimer = setTimeout(commitAutosave, 1500);
}

function commitAutosave() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(stateForSave()));
    setAutosaveStatus('saved locally');
  } catch (e) {
    setAutosaveStatus('⚠ storage full — use Save file');
  }
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => setAutosaveStatus(''), 3000);
}

function setAutosaveStatus(msg) {
  const el = document.getElementById('autosave-status');
  if (el) el.textContent = msg;
}

// ── Persistence: serialise (strip runtime-only _pdfSlots) ─────────────────

function stateForSave() {
  return {
    ...state,
    items: state.items.map(item => {
      if (item.type !== 'sheet') return item;
      const { _pdfSlots, ...rest } = item;
      return rest;
    })
  };
}

// ── Persistence: save ─────────────────────────────────────────────────────

function saveToFile() {
  const json = JSON.stringify(stateForSave(), null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'solutions-doc.json';
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

// ── Persistence: load from file ───────────────────────────────────────────

function loadFromFile() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = '.json,application/json';
  input.addEventListener('change', e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try { applyState(JSON.parse(ev.target.result)); scheduleAutosave(); }
      catch (err) { alert('Could not load file: ' + err.message); }
    };
    reader.readAsText(file);
  });
  input.click();
}

// ── Persistence: restore state ────────────────────────────────────────────

function applyState(data) {
  state.unit          = data.unit          ?? '';
  state.viewMode      = data.viewMode      ?? 'print';
  state.currentLesson = data.currentLesson ?? { num: '1', name: '' };
  state.pdfPages      = data.pdfPages      ?? [];
  state.items         = data.items         ?? [];
  state.items.forEach(item => {
    if (item.type !== 'sheet') return;
    if (!item.printToggles) item.printToggles = {};
    // Migrate old single-image field to multi-slot array
    if (!item.images) item.images = [item.image ?? null, null, null, null];
    if (!item.layout) item.layout = '2-up';
    // Remove stale per-sheet pdf page numbers (no longer used)
    delete item.pdfPage;
    delete item.pdfPages;
    delete item.imageAR;
    item._pdfSlots = [null, null, null, null];
    if (!item.comments) item.comments = [];
    item.entries?.forEach(e => {
      if (e.type && e.type !== 'section-title') e.type = migrateEntryType(e.type);
    });
  });

  document.getElementById('unit-input').value = state.unit;
  applyViewMode(state.viewMode, false);
  renderCanvas();
  if (state.pdfPages.length) recomputePdfAssignments();
}

function loadFromLocalStorage() {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return false;
  try { applyState(JSON.parse(raw)); return true; }
  catch (e) { return false; }
}

// ── Loading overlay ───────────────────────────────────────────────────────

function showLoading(msg) {
  document.getElementById('pdf-loading')?.classList.add('show');
  const el = document.getElementById('pdf-loading-msg');
  if (el) el.textContent = msg;
}
function hideLoading() {
  document.getElementById('pdf-loading')?.classList.remove('show');
}

// ── PDF upload ────────────────────────────────────────────────────────────

function triggerPdfUpload() { document.getElementById('file-pdf').click(); }

async function handlePdfUpload(file) {
  if (!file) return;
  if (typeof pdfjsLib === 'undefined') {
    alert('PDF.js is not loaded — cannot upload PDF.');
    return;
  }
  showLoading('Reading PDF…');
  try {
    const base64 = await fileToBase64(file);

    showLoading('Opening PDF…');
    const raw    = base64.includes(',') ? base64.split(',')[1] : base64;
    const binary = atob(raw);
    const bytes  = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
    const pdfDoc   = await pdfjsLib.getDocument({ data: bytes }).promise;
    const numPages = pdfDoc.numPages;

    // Extract every page to a JPEG data URL upfront
    const newImages = [];
    for (let p = 1; p <= numPages; p++) {
      showLoading(`Extracting page ${p} of ${numPages}…`);
      await new Promise(r => setTimeout(r, 0)); // yield so browser can repaint
      const page     = await pdfDoc.getPage(p);
      const viewport = page.getViewport({ scale: 1.5 });
      const cvs      = document.createElement('canvas');
      cvs.width  = viewport.width;
      cvs.height = viewport.height;
      await page.render({ canvasContext: cvs.getContext('2d'), viewport }).promise;
      newImages.push(cvs.toDataURL('image/jpeg', 0.85));
    }
    await pdfDoc.destroy();

    // Append to flat document-level array and recompute
    state.pdfPages.push(...newImages);
    const pagesAdded = recomputePdfAssignments();

    hideLoading();
    showToast(
      `${numPages} PDF page${numPages !== 1 ? 's' : ''} loaded` +
      (pagesAdded ? ` · ${pagesAdded} new document page${pagesAdded !== 1 ? 's' : ''} created` : '')
    );

    // Scroll to the first sheet that received any of the newly added pages
    const sheets = state.items.filter(i => i.type === 'sheet');
    const newSet = new Set(newImages);
    const firstNew = sheets.find(s => s._pdfSlots?.some(d => newSet.has(d)));
    (firstNew ? document.getElementById(firstNew.id) : null)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    scheduleAutosave();
  } catch (err) {
    hideLoading();
    alert('Failed to load PDF: ' + err.message);
    console.error(err);
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── View mode ─────────────────────────────────────────────────────────────

function applyViewMode(mode, save = true) {
  state.viewMode = mode;
  document.body.classList.toggle('view-print',  mode === 'print');
  document.body.classList.toggle('view-online', mode === 'online');
  const btn = document.getElementById('view-toggle-btn');
  if (btn) btn.textContent = mode === 'print' ? 'Online view' : 'Print view';
  state.items.filter(i => i.type === 'sheet').forEach(i => { updateCapacity(i.id); });
  if (save) scheduleAutosave();
}

function toggleViewMode() {
  applyViewMode(state.viewMode === 'print' ? 'online' : 'print');
}

// ── Utilities ─────────────────────────────────────────────────────────────

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function nextId(prefix) {
  return prefix + '-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}


function sheetPageNumber(sheetId) {
  let n = 0;
  for (const item of state.items) {
    if (item.type === 'sheet') { n++; if (item.id === sheetId) return n; }
  }
  return n;
}

function getSheetItem(sheetId) {
  return state.items.find(i => i.id === sheetId);
}

function makeBlankSheetItem(id, lesson, layout = '2-up') {
  return {
    type: 'sheet', id,
    lesson: { ...lesson },
    layout,
    sectionTitle: '',
    images: [null, null, null, null],  // manual uploads only; not PDF-derived
    _pdfSlots: [null, null, null, null], // runtime only, not persisted
    entries: [],
    printToggles: {},
    comments: []
  };
}

// ── Lesson helpers ────────────────────────────────────────────────────────

// Return all sheets that fall under labelId (until the next label).
function getSheetsUnderLabel(labelId) {
  const idx = state.items.findIndex(i => i.id === labelId);
  if (idx === -1) return [];
  const sheets = [];
  for (let i = idx + 1; i < state.items.length; i++) {
    if (state.items[i].type === 'lesson-label') break;
    if (state.items[i].type === 'sheet') sheets.push(state.items[i]);
  }
  return sheets;
}

// Scan backwards from afterItemId to find the lesson that applies there.
function getLessonForPosition(afterItemId) {
  const idx = state.items.findIndex(i => i.id === afterItemId);
  for (let i = idx; i >= 0; i--) {
    const it = state.items[i];
    if (it.type === 'lesson-label') return { num: it.num, name: it.name };
    if (it.type === 'sheet' && it.lesson) return { ...it.lesson };
  }
  return { ...state.currentLesson };
}

// ── Header text ───────────────────────────────────────────────────────────

function buildHeaderText(sheetItem) {
  const unit = state.unit || '?';
  const { num, name } = sheetItem.lesson;
  const lPart  = name ? ` · Lesson ${num} · ${name}` : ` · Lesson ${num}`;
  const sPart  = sheetItem.sectionTitle ? ` · ${sheetItem.sectionTitle}` : '';
  return `Unit ${unit}${lPart}${sPart} · Teacher notes`;
}

function updateSheetHeader(sheetItem) {
  const h = document.getElementById('header-' + sheetItem.id);
  if (h) h.textContent = buildHeaderText(sheetItem);
  const f = document.getElementById('footer-' + sheetItem.id);
  if (f) f.textContent =
    `Unit ${state.unit || '?'} · Lesson ${sheetItem.lesson.num} · Page ${sheetPageNumber(sheetItem.id)}`;
}

function updateAllHeaders() {
  state.unit = document.getElementById('unit-input').value.trim();
  state.items.filter(i => i.type === 'sheet').forEach(updateSheetHeader);
  scheduleAutosave();
}

// ── Canvas rendering ──────────────────────────────────────────────────────

function renderCanvas() {
  const canvas = document.getElementById('canvas');
  canvas.innerHTML = '';
  state.items.forEach(item => {
    if (item.type === 'lesson-label') appendLessonLabelEl(item);
    else if (item.type === 'sheet')   appendSheetEl(item);
    appendGapZone(item.id);
  });
}

// ── Gap zones (between every pair of canvas items) ────────────────────────

function appendGapZone(afterItemId) {
  const canvas = document.getElementById('canvas');
  const zone   = document.createElement('div');
  zone.className    = 'insert-zone';
  zone.id           = 'gap-after-' + afterItemId;
  zone.dataset.after = afterItemId;

  zone.innerHTML = `
    <div class="iz-inner">
      <div class="iz-bar">
        <button class="iz-btn iz-break">÷ Insert lesson break</button>
        <button class="iz-btn iz-page">+ Insert blank page</button>
      </div>
      <div class="iz-form">
        <input type="text" class="iz-lnum" placeholder="Lesson number">
        <input type="text" class="iz-lname" placeholder="Name (optional)">
        <button class="iz-ok-btn">Insert lesson</button>
        <button class="iz-cancel-btn">Cancel</button>
      </div>
    </div>`;

  const lnumIn  = zone.querySelector('.iz-lnum');
  const lnameIn = zone.querySelector('.iz-lname');

  zone.querySelector('.iz-break').addEventListener('click', () => {
    zone.classList.add('form-open');
    lnumIn.focus();
  });

  zone.querySelector('.iz-page').addEventListener('click', () => {
    insertBlankPage(afterItemId);
  });

  const doInsert = () => {
    const num = lnumIn.value.trim();
    if (!num) { lnumIn.focus(); return; }
    insertLessonBreak(afterItemId, num, lnameIn.value.trim());
  };

  const doCancel = () => {
    zone.classList.remove('form-open');
    lnumIn.value = ''; lnameIn.value = '';
  };

  zone.querySelector('.iz-ok-btn').addEventListener('click', doInsert);
  zone.querySelector('.iz-cancel-btn').addEventListener('click', doCancel);
  [lnumIn, lnameIn].forEach(el => el.addEventListener('keydown', e => {
    if (e.key === 'Enter') doInsert();
    if (e.key === 'Escape') doCancel();
  }));

  canvas.appendChild(zone);
}

// ── Lesson label DOM ──────────────────────────────────────────────────────

function appendLessonLabelEl(item) {
  const canvas = document.getElementById('canvas');
  const div    = document.createElement('div');
  div.className = 'lesson-label';
  div.id        = item.id;
  div.dataset.itemId = item.id;

  div.innerHTML = `
    <span class="lesson-drag-handle" title="Drag to reorder">⠿</span>
    <span class="lesson-label-text">Lesson ${escHtml(item.num)}${item.name ? ' — ' + escHtml(item.name) : ''}</span>
    <button class="ll-edit" title="Rename lesson">✎</button>
    <button class="ll-delete" title="Remove divider">✕</button>
    <div class="ll-edit-form">
      <input type="text"  class="ll-num-in"  value="${escHtml(item.num)}"         placeholder="Lesson number">
      <input type="text"  class="ll-name-in" value="${escHtml(item.name || '')}"  placeholder="Name (optional)">
      <button class="ll-save-btn">Save</button>
      <button class="ll-cancel-btn">Cancel</button>
    </div>`;

  const numIn   = div.querySelector('.ll-num-in');
  const nameIn  = div.querySelector('.ll-name-in');

  div.querySelector('.ll-edit').addEventListener('click', () => {
    div.classList.add('editing');
    numIn.focus();
  });

  div.querySelector('.ll-delete').addEventListener('click', () => deleteLessonLabel(item.id));

  const doSave = () => {
    const num = numIn.value.trim();
    if (!num) { numIn.focus(); return; }
    div.classList.remove('editing');
    editLessonLabel(item.id, num, nameIn.value.trim());
  };

  const doCancel = () => {
    div.classList.remove('editing');
    numIn.value  = item.num;
    nameIn.value = item.name || '';
  };

  div.querySelector('.ll-save-btn').addEventListener('click', doSave);
  div.querySelector('.ll-cancel-btn').addEventListener('click', doCancel);
  [numIn, nameIn].forEach(el => el.addEventListener('keydown', e => {
    if (e.key === 'Enter')  doSave();
    if (e.key === 'Escape') doCancel();
  }));

  // Drop target for page drag-to-reorder
  div.addEventListener('dragover',  onItemDragOver);
  div.addEventListener('dragleave', onItemDragLeave);
  div.addEventListener('drop',      onItemDrop);

  canvas.appendChild(div);
}

// ── Sheet DOM ─────────────────────────────────────────────────────────────

function appendSheetEl(item) {
  const canvas  = document.getElementById('canvas');
  const pageNum = sheetPageNumber(item.id);
  const layout  = item.layout || '2-up';

  const wrapper = document.createElement('div');
  wrapper.className = `sheet-and-sidebar ${layoutClass(layout)}`;

  const sheet = document.createElement('div');
  sheet.className    = `sheet ${layoutClass(layout)}`;
  sheet.id           = item.id;
  sheet.dataset.itemId = item.id;

  function thumbCellHtml(slot) {
    return `<div class="thumb-cell thumb-cell-${slot}" id="frame-${slot}-${item.id}">
      <div class="upload-prompt">
        <div class="big-icon">📄</div>
        <p>No image uploaded</p>
        <button class="upload-btn">+ Add image</button>
      </div>
      <button class="remove-img" title="Remove image">✕</button>
      <input type="file" accept="image/*" class="file-input" id="file-${slot}-${item.id}">
    </div>`;
  }

  sheet.innerHTML = `
    <div class="sheet-drag-handle" title="Drag page to reorder">⠿</div>
    <div class="sheet-del-wrap">
      <div class="sheet-del-confirm"><span class="del-confirm-text">Delete this page?</span>
        <button class="sheet-del-yes">Yes</button>
        <button class="sheet-del-no">No</button>
      </div>
      <button class="sheet-del-btn" title="Delete page">✕</button>
    </div>
    <div class="page-header">
      <span class="page-header-title" id="header-${item.id}">${escHtml(buildHeaderText(item))}</span>
      <div class="layout-picker">
        <button class="layout-btn${layout === '4-up' ? ' active' : ''}" data-layout="4-up">4-up</button>
        <button class="layout-btn${layout === '3-up' ? ' active' : ''}" data-layout="3-up">3-up</button>
        <button class="layout-btn${layout === '2-up' ? ' active' : ''}" data-layout="2-up">2-up</button>
        <button class="layout-btn${layout === '1-up' ? ' active' : ''}" data-layout="1-up">1-up</button>
      </div>
    </div>
    <div class="page-grid">
      ${thumbCellHtml(0)}${thumbCellHtml(1)}${thumbCellHtml(2)}${thumbCellHtml(3)}
      <div class="sol-cell" id="right-${item.id}">
        <div class="sol-blocks" id="blocks-${item.id}"></div>
      </div>
    </div>
    <div class="page-footer" id="footer-${item.id}">Unit ${escHtml(state.unit || '?')} · Lesson ${escHtml(item.lesson.num)} · Page ${pageNum}</div>`;

  // ── Sidebar (sibling of .sheet inside wrapper) ──
  const sidebar = document.createElement('div');
  sidebar.className = 'sol-sidebar';
  sidebar.id = `sidebar-${item.id}`;
  sidebar.innerHTML = `
    <div class="cap-bars" id="capbars-${item.id}">
      <div class="cap-entry">
        <div class="cap-label-row"><span>In print</span><span class="cap-pct" id="cappct-inprint-${item.id}">–</span></div>
        <div class="cap-track"><div class="cap-fill cap-fill-inprint" id="capfill-inprint-${item.id}"></div></div>
      </div>
      <div class="cap-entry">
        <div class="cap-label-row"><span>Hidden</span><span class="cap-pct" id="cappct-hidden-${item.id}">–</span></div>
        <div class="cap-track"><div class="cap-fill cap-fill-hidden" id="capfill-hidden-${item.id}"></div></div>
      </div>
    </div>
    <button class="sol-sb-btn add-sol-btn">+ Solution</button>
    <button class="sol-sb-btn add-sectitle-btn">+ Section title</button>
    <button class="sol-sb-btn import-csv-btn">↑ Import CSV</button>
    <div class="comments-section" id="comments-${item.id}">
      <div class="comments-heading">Comments</div>
      <div class="comments-list" id="comment-list-${item.id}"></div>
      <button class="comments-add-btn">+ Add comment</button>
      <div class="comment-form" id="comment-form-${item.id}">
        <input type="text" class="comment-initials-input" placeholder="AB" maxlength="3">
        <textarea class="comment-text-input" rows="2" placeholder="Comment…"></textarea>
        <div class="comment-form-btns">
          <button class="comment-post-btn">Post</button>
          <button class="comment-cancel-btn">Cancel</button>
        </div>
      </div>
    </div>`;

  // ── Delete button ──
  const delBtn     = sheet.querySelector('.sheet-del-btn');
  const delConfirm = sheet.querySelector('.sheet-del-confirm');
  const delText    = sheet.querySelector('.del-confirm-text');
  delBtn.addEventListener('click', e => {
    e.stopPropagation();
    const hasSolutions = item.entries && item.entries.length > 0;
    delText.textContent = hasSolutions
      ? 'This page has solutions that will be deleted. Are you sure?'
      : 'Delete this page?';
    delConfirm.classList.add('show');
    delBtn.style.display = 'none';
  });
  sheet.querySelector('.sheet-del-yes').addEventListener('click', () => deletePage(item.id));
  sheet.querySelector('.sheet-del-no').addEventListener('click', () => {
    delConfirm.classList.remove('show');
    delBtn.style.display = '';
  });

  // ── Layout picker ──
  sheet.querySelectorAll('.layout-btn').forEach(btn => {
    btn.addEventListener('click', () => setLayout(item.id, btn.dataset.layout));
  });

  // ── Thumb cell events ──
  for (let slot = 0; slot < 4; slot++) {
    const cell = sheet.querySelector(`.thumb-cell-${slot}`);
    const fileInput = cell.querySelector('.file-input');
    cell.querySelector('.upload-btn').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', e => loadImage(item.id, slot, e.target));
    cell.querySelector('.remove-img').addEventListener('click', () => removeImage(item.id, slot));
    cell.addEventListener('contextmenu', e => {
      const hasPdf    = !!item._pdfSlots?.[slot];
      const hasManual = !!item.images?.[slot];
      if (hasPdf || hasManual) {
        e.preventDefault();
        showCellContextMenu(e, item.id, slot, hasPdf ? 'pdf' : 'manual');
      }
    });
  }

  // ── Add solution / Add section title ──
  sidebar.querySelector('.add-sol-btn').addEventListener('click', () => openSolModal(item.id));
  sidebar.querySelector('.add-sectitle-btn').addEventListener('click', () => addSectionTitle(item.id));
  sidebar.querySelector('.import-csv-btn').addEventListener('click', () => openImportModal(item.id));

  // ── Comments ──
  const addCommentBtn  = sidebar.querySelector('.comments-add-btn');
  const commentForm    = sidebar.querySelector('.comment-form');
  if (!addCommentBtn || !commentForm) {
    console.warn('Comments UI elements not found for sheet', item.id);
  } else {
  const initialsInput  = commentForm.querySelector('.comment-initials-input');
  const commentTextIn  = commentForm.querySelector('.comment-text-input');

  addCommentBtn.addEventListener('click', () => {
    addCommentBtn.style.display = 'none';
    commentForm.style.display   = 'flex';
    initialsInput.focus();
  });

  const cancelComment = () => {
    commentForm.style.display   = 'none';
    addCommentBtn.style.display = '';
    initialsInput.value  = '';
    commentTextIn.value  = '';
  };

  commentForm.querySelector('.comment-cancel-btn').addEventListener('click', cancelComment);

  commentForm.querySelector('.comment-post-btn').addEventListener('click', () => {
    const initials = initialsInput.value.trim().toUpperCase().slice(0, 3);
    const text     = commentTextIn.value.trim();
    if (!initials || !text) return;
    item.comments.push({
      id:        nextId('c'),
      initials,
      text,
      timestamp: new Date().toISOString().slice(0, 10)
    });
    cancelComment();
    renderComments(item.id);
    scheduleAutosave();
  });
  } // end comments null-check

  // ── Page drag-to-reorder ──
  const handle = sheet.querySelector('.sheet-drag-handle');
  handle.addEventListener('mousedown', () => { sheet.draggable = true; });
  sheet.addEventListener('dragstart', onItemDragStart);
  sheet.addEventListener('dragover',  onItemDragOver);
  sheet.addEventListener('dragleave', onItemDragLeave);
  sheet.addEventListener('drop',      onItemDrop);
  sheet.addEventListener('dragend',   e => { sheet.draggable = false; onItemDragEnd.call(sheet, e); });

  wrapper.appendChild(sheet);
  wrapper.appendChild(sidebar);
  canvas.appendChild(wrapper);

  // Populate thumb cells after appending to DOM (so document.getElementById works)
  for (let slot = 0; slot < 4; slot++) rebuildThumbCell(item.id, slot, item);

  renderBlocks(item.id);
  renderComments(item.id);
}

// ── Insertion and mutation operations ─────────────────────────────────────

function insertLessonBreak(afterItemId, num, name) {
  const idx = state.items.findIndex(i => i.id === afterItemId);
  if (idx === -1) return;
  const newLabel = { type: 'lesson-label', id: nextId('label'), num, name };
  state.items.splice(idx + 1, 0, newLabel);
  getSheetsUnderLabel(newLabel.id).forEach(s => { s.lesson = { num, name }; });
  renderCanvas();
  scheduleAutosave();
}

function insertBlankPage(afterItemId) {
  const idx = state.items.findIndex(i => i.id === afterItemId);
  if (idx === -1) return;
  const lesson = getLessonForPosition(afterItemId);
  const id   = nextId('sheet');
  const item = makeBlankSheetItem(id, lesson);
  state.items.splice(idx + 1, 0, item);
  renderCanvas();
  if (state.pdfPages.length) recomputePdfAssignments();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  scheduleAutosave();
}

function editLessonLabel(labelId, num, name) {
  const label = state.items.find(i => i.id === labelId);
  if (!label) return;
  label.num = num; label.name = name;
  getSheetsUnderLabel(labelId).forEach(s => { s.lesson = { num, name }; });
  // Update DOM label text without full re-render
  const textEl = document.querySelector(`#${labelId} .lesson-label-text`);
  if (textEl) textEl.textContent = `Lesson ${num}${name ? ' — ' + name : ''}`;
  state.items.filter(i => i.type === 'sheet').forEach(updateSheetHeader);
  scheduleAutosave();
}

function deleteLessonLabel(labelId) {
  const idx = state.items.findIndex(i => i.id === labelId);
  if (idx === -1) return;
  // Inherit the lesson from whatever precedes this label
  const prevItem   = state.items[idx - 1];
  const prevLesson = prevItem ? getLessonForPosition(prevItem.id) : { ...state.currentLesson };
  getSheetsUnderLabel(labelId).forEach(s => { s.lesson = { ...prevLesson }; });
  state.items.splice(idx, 1);
  document.getElementById(labelId)?.remove();
  document.getElementById('gap-after-' + labelId)?.remove();
  state.items.filter(i => i.type === 'sheet').forEach(updateSheetHeader);
  scheduleAutosave();
}

function deletePage(sheetId) {
  const idx = state.items.findIndex(i => i.id === sheetId);
  if (idx === -1) return;

  // Remove PDF pages belonging to this sheet from the flat array
  if (state.pdfPages.length) {
    const { start, count } = getPdfRangeForSheet(sheetId);
    if (count > 0) state.pdfPages.splice(start, count);
  }

  state.items.splice(idx, 1);
  const sheetDomEl = document.getElementById(sheetId);
  const sheetWrap = sheetDomEl?.parentElement?.classList.contains('sheet-and-sidebar')
    ? sheetDomEl.parentElement : sheetDomEl;
  sheetWrap?.remove();
  document.getElementById('gap-after-' + sheetId)?.remove();
  state.items.filter(i => i.type === 'sheet').forEach(updateSheetHeader);
  if (state.pdfPages.length) recomputePdfAssignments();
  scheduleAutosave();
}

// ── Page/lesson creation (appending to end) ───────────────────────────────

function addPage(lessonOverride) {
  const lesson = lessonOverride || state.currentLesson;
  const id     = nextId('sheet');
  const item   = makeBlankSheetItem(id, lesson);
  state.items.push(item);
  appendSheetEl(item);
  appendGapZone(id);
  if (state.pdfPages.length) recomputePdfAssignments();
  document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'center' });
  scheduleAutosave();
}

function addLesson(num, name) {
  state.currentLesson = { num, name };
  const labelId = nextId('label');
  state.items.push({ type: 'lesson-label', id: labelId, num, name });
  appendLessonLabelEl(state.items[state.items.length - 1]);
  appendGapZone(labelId);
  addPage(state.currentLesson);
}

// ── Page drag-to-reorder ──────────────────────────────────────────────────

let dragSrcItem = null;

function onItemDragStart(e) {
  dragSrcItem = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', this.dataset.itemId);
  document.getElementById('canvas').classList.add('is-dragging');
}

function onItemDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  if (this !== dragSrcItem) this.classList.add('drag-over-top');
}

function onItemDragLeave() { this.classList.remove('drag-over-top'); }

function onItemDrop(e) {
  e.preventDefault();
  this.classList.remove('drag-over-top');
  if (!dragSrcItem || dragSrcItem === this) return;

  const srcId = dragSrcItem.dataset.itemId;
  const tgtId = this.dataset.itemId;
  const srcIdx = state.items.findIndex(i => i.id === srcId);
  const tgtIdx = state.items.findIndex(i => i.id === tgtId);
  if (srcIdx === -1 || tgtIdx === -1) return;

  const [moved] = state.items.splice(srcIdx, 1);
  state.items.splice(state.items.findIndex(i => i.id === tgtId), 0, moved);

  renderCanvas();
  scheduleAutosave();
}

function onItemDragEnd() {
  this.classList.remove('dragging');
  this.draggable = false;
  document.querySelectorAll('.drag-over-top').forEach(el => el.classList.remove('drag-over-top'));
  document.getElementById('canvas').classList.remove('is-dragging');
  dragSrcItem = null;
}

// ── Solution blocks rendering ─────────────────────────────────────────────

function renderBlocks(sheetId) {
  const container = document.getElementById('blocks-' + sheetId);
  if (!container) return;
  const item = getSheetItem(sheetId);
  const entries = item ? item.entries : [];

  // Normalize section-title entries regardless of when they were created
  entries.forEach(e => {
    if (e.type === 'section_title' || e.type === 'sectionTitle') e.type = 'section-title';
    if (e.type === 'section-title' && e.text == null) e.text = e.label ?? e.title ?? '';
  });

  container.innerHTML = '';
  // Process entries in order, grouping consecutive solution entries with the same num
  let i = 0;
  while (i < entries.length) {
    const e = entries[i];
    if (e.type === 'section-title') {
      container.appendChild(buildSectionTitleEl(sheetId, e));
      i++;
    } else {
      const num = e.num || '';
      const grp = [];
      while (i < entries.length && entries[i].type !== 'section-title' && (entries[i].num || '') === num) {
        grp.push(entries[i]);
        i++;
      }
      container.appendChild(buildGroupEl(sheetId, num, grp));
    }
  }
  updateCapacity(sheetId);
}

function renderComments(sheetId) {
  const item = getSheetItem(sheetId);
  const list = document.getElementById('comment-list-' + sheetId);
  if (!item || !list) return;
  list.innerHTML = '';
  (item.comments || []).forEach(c => {
    const row = document.createElement('div');
    row.className = 'comment-item';
    row.innerHTML = `
      <div class="comment-avatar">${escHtml(c.initials)}</div>
      <div class="comment-body">
        <div class="comment-text">${escHtml(c.text)}</div>
        <div class="comment-date">${escHtml(c.timestamp)}</div>
      </div>
      <button class="comment-delete-btn" title="Delete">×</button>`;
    row.querySelector('.comment-delete-btn').addEventListener('click', () => {
      item.comments = item.comments.filter(x => x.id !== c.id);
      renderComments(sheetId);
      scheduleAutosave();
    });
    list.appendChild(row);
  });
}

function buildGroupEl(sheetId, numStr, grpEntries) {
  const isOn = getPrintToggle(sheetId, numStr);

  const div = document.createElement('div');
  div.className = 'q-group' + (isOn ? '' : ' print-off');
  div.dataset.numStr   = numStr;
  div.dataset.sheetId  = sheetId;
  div.dataset.entryIds = JSON.stringify(grpEntries.map(e => e.id));
  div.draggable = true;

  const handle = document.createElement('div');
  handle.className = 'drag-handle';
  handle.title = 'Drag to reorder';
  handle.textContent = '⠿';
  div.appendChild(handle);

  const numCol = document.createElement('div');
  numCol.className = 'q-num-col';
  if (numStr) {
    const badge = document.createElement('div');
    badge.className = 'num-badge';
    badge.textContent = numStr;
    numCol.appendChild(badge);
  }
  const offBadge = document.createElement('span');
  offBadge.className = 'print-off-badge';
  offBadge.textContent = 'print off';
  numCol.appendChild(offBadge);
  div.appendChild(numCol);

  const entriesDiv = document.createElement('div');
  entriesDiv.className = 'q-entries';
  grpEntries.forEach((e, i) => entriesDiv.appendChild(buildEntryEl(sheetId, e, i === 0)));
  div.appendChild(entriesDiv);

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'q-group-toggle';
  toggleBtn.title = isOn ? 'Hide from print' : 'Show in print';
  toggleBtn.textContent = isOn ? 'hide' : 'show';
  toggleBtn.addEventListener('click', e => {
    e.stopPropagation();
    setPrintToggle(sheetId, numStr, !getPrintToggle(sheetId, numStr));
  });
  div.appendChild(toggleBtn);

  div.addEventListener('dragstart', onGroupDragStart);
  div.addEventListener('dragover',  onGroupDragOver);
  div.addEventListener('dragleave', onGroupDragLeave);
  div.addEventListener('drop',      onGroupDrop);
  div.addEventListener('dragend',   onGroupDragEnd);
  return div;
}

function buildSectionTitleEl(sheetId, entry) {
  const div = document.createElement('div');
  div.className = 'st-block';
  div.dataset.sheetId  = sheetId;
  div.dataset.entryIds = JSON.stringify([entry.id]);
  div.draggable = true;

  const handle = document.createElement('div');
  handle.className = 'drag-handle';
  handle.title = 'Drag to reorder';
  handle.textContent = '⠿';
  div.appendChild(handle);

  const textEl = document.createElement('div');
  textEl.className = 'st-block-text';
  textEl.contentEditable = 'true';
  textEl.textContent = entry.text ?? entry.label ?? entry.title ?? '';
  textEl.addEventListener('input', () => {
    entry.text = textEl.textContent.trim();
    scheduleAutosave();
  });
  textEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); textEl.blur(); }
  });
  div.appendChild(textEl);

  const actions = document.createElement('div');
  actions.className = 'entry-actions';
  actions.innerHTML = `<button class="ea-btn del del-btn" title="Delete">✕</button>`;
  actions.querySelector('.del-btn').addEventListener('click', () => deleteEntry(sheetId, entry.id));
  div.appendChild(actions);

  div.addEventListener('dragstart', onGroupDragStart);
  div.addEventListener('dragover',  onGroupDragOver);
  div.addEventListener('dragleave', onGroupDragLeave);
  div.addEventListener('drop',      onGroupDrop);
  div.addEventListener('dragend',   onGroupDragEnd);
  return div;
}

function buildEntryEl(sheetId, e, isFirst = true) {
  const wrap  = document.createElement('div');
  wrap.className = 'sol-entry';
  wrap.dataset.entryId = e.id;

  if (isFirst) {
    const label = e.type === 'custom' ? (e.customLabel || 'Note') : (TYPE_LABELS[e.type] || e.type);
    const tag   = document.createElement('span');
    tag.className = `type-tag tag-${e.type}`;
    tag.textContent = label;
    wrap.appendChild(tag);
  }

  if (e.body) {
    const bodyEl = document.createElement('div');
    bodyEl.className = 'sol-text';
    bodyEl.textContent = e.body;
    renderMath(bodyEl);
    wrap.appendChild(bodyEl);
  }

  if (e.batexCode) {
    const dw  = document.createElement('div');
    dw.className = 'sol-diag';

    const cvs = document.createElement('canvas');
    cvs.style.display  = 'block';
    cvs.style.maxWidth = '100%';
    dw.appendChild(cvs);

    const zoomBar = document.createElement('div');
    zoomBar.className = 'batex-zoom-bar';
    const btnMinus = document.createElement('button');
    btnMinus.className   = 'bz-btn';
    btnMinus.textContent = '–';
    const pctSpan = document.createElement('span');
    pctSpan.className = 'bz-pct';
    const btnPlus = document.createElement('button');
    btnPlus.className   = 'bz-btn';
    btnPlus.textContent = '+';
    zoomBar.append(btnMinus, pctSpan, btnPlus);
    dw.appendChild(zoomBar);

    wrap.appendChild(dw);

    const offCvs = document.createElement('canvas');
    offCvs.width  = 2000;
    offCvs.height = 2000;
    const offCtx = Shortvas.get(offCvs);
    const props = {
      batex:         e.batexCode,
      x:             25,
      y:             30,
      fontInfo:      { size: 20, family: ['Roboto', 'sans-serif'] },
      wrapWidth:     460,
      insetBlurSize: 16,
      rulerFontSize: 25.5,
      debugBoxes:    false,
    };

    let currentZoom = e.zoomLevel ?? 1.0;
    let lastBounds  = null;

    function drawScaled() {
      if (!lastBounds) return;
      const fitScale  = (lastBounds.w > 0 && lastBounds.h > 0) ? Math.min(400 / lastBounds.w, 150 / lastBounds.h) : 1;
      const dispScale = fitScale * currentZoom;
      cvs.width  = 400;
      cvs.height = Math.max(1, Math.round(lastBounds.h * dispScale));
      const visCtx = cvs.getContext('2d');
      visCtx.clearRect(0, 0, cvs.width, cvs.height);
      visCtx.drawImage(offCvs, lastBounds.x, lastBounds.y, lastBounds.w, lastBounds.h,
                       0, 0, Math.round(lastBounds.w * dispScale), Math.round(lastBounds.h * dispScale));
      cvs.style.width  = cvs.width  + 'px';
      cvs.style.height = cvs.height + 'px';
      pctSpan.textContent = Math.round(currentZoom * 100) + '%';
    }

    function paint() {
      offCvs.width  = 2000;
      offCvs.height = 2000;
      const result = CanvasMath.render(offCtx, props);
      if (result.errors && result.errors.length) {
        console.error(result.errors);
      }
      lastBounds = batexContentBounds(offCvs, result);
      drawScaled();
    }

    btnMinus.addEventListener('click', () => {
      const z = Math.max(0.5, parseFloat((currentZoom - 0.1).toFixed(1)));
      if (z !== currentZoom) { currentZoom = z; e.zoomLevel = z; drawScaled(); scheduleAutosave(); }
    });
    btnPlus.addEventListener('click', () => {
      const z = Math.min(3.0, parseFloat((currentZoom + 0.1).toFixed(1)));
      if (z !== currentZoom) { currentZoom = z; e.zoomLevel = z; drawScaled(); scheduleAutosave(); }
    });

    function doRender() {
      if (typeof withImageLoading === 'function') {
        withImageLoading(offCtx, paint);
      } else {
        paint();
      }
    }
    if (typeof waitForWebFonts === 'function') {
      waitForWebFonts(doRender);
    } else {
      doRender();
    }
  } else if (e.areaModel?.a && e.areaModel?.b) {
    const dw = document.createElement('div');
    dw.className = 'sol-diag';
    dw.appendChild(buildAreaModelEl(e.areaModel.a, e.areaModel.b));
    wrap.appendChild(dw);
  } else if (e.diag) {
    const de = document.createElement('div');
    de.className = 'sol-diag';
    de.textContent = e.diag;
    renderMath(de);
    wrap.appendChild(de);
  } else if (e.imageData) {
    const dw = document.createElement('div');
    dw.className = 'sol-diag';
    const imgEl = document.createElement('img');
    imgEl.src = e.imageData;
    imgEl.className = 'sol-entry-img';
    const remBtn = document.createElement('button');
    remBtn.className = 'sol-img-remove-btn';
    remBtn.title = 'Remove image';
    remBtn.textContent = '✕';
    remBtn.addEventListener('click', () => {
      e.imageData = null;
      renderBlocks(sheetId);
      scheduleAutosave();
    });
    dw.appendChild(imgEl);
    dw.appendChild(remBtn);
    wrap.appendChild(dw);
  }

  const actions = document.createElement('div');
  actions.className = 'entry-actions';
  actions.innerHTML = `<button class="ea-btn edit-btn" title="Edit">✎</button>
    <button class="ea-btn del del-btn" title="Delete">✕</button>`;
  actions.querySelector('.edit-btn').addEventListener('click', () => editEntry(sheetId, e.id));
  actions.querySelector('.del-btn').addEventListener('click',  () => deleteEntry(sheetId, e.id));
  wrap.appendChild(actions);
  return wrap;
}

// ── Group drag-to-reorder ─────────────────────────────────────────────────

let dragSrcGroup = null;

function onGroupDragStart(e) {
  e.stopPropagation();
  dragSrcGroup = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}
function onGroupDragOver(e) {
  e.preventDefault(); e.stopPropagation();
  e.dataTransfer.dropEffect = 'move';
  if (this !== dragSrcGroup) this.classList.add('drag-over');
}
function onGroupDragLeave() { this.classList.remove('drag-over'); }
function onGroupDrop(e) {
  e.preventDefault(); e.stopPropagation();
  this.classList.remove('drag-over');
  if (!dragSrcGroup || dragSrcGroup === this) return;
  const sheetId = this.dataset.sheetId;
  if (dragSrcGroup.dataset.sheetId !== sheetId) return;

  const item = getSheetItem(sheetId); if (!item) return;
  const srcIds = new Set(JSON.parse(dragSrcGroup.dataset.entryIds || '[]'));
  const tgtFirstId = JSON.parse(this.dataset.entryIds || '[]')[0];
  if (!srcIds.size || !tgtFirstId) return;

  const srcEntries = item.entries.filter(x => srcIds.has(x.id));
  const rest       = item.entries.filter(x => !srcIds.has(x.id));
  const tgtIdx     = rest.findIndex(x => x.id === tgtFirstId);
  rest.splice(tgtIdx === -1 ? rest.length : tgtIdx, 0, ...srcEntries);
  item.entries = rest;
  renderBlocks(sheetId);
  scheduleAutosave();
}
function onGroupDragEnd() {
  this.classList.remove('dragging');
  document.querySelectorAll('.q-group.drag-over').forEach(el => el.classList.remove('drag-over'));
  dragSrcGroup = null;
}


// ── Thumb cell DOM rebuild ────────────────────────────────────────────────

function rebuildThumbCell(sheetId, slot, item) {
  const cell = document.getElementById(`frame-${slot}-${sheetId}`);
  if (!cell) return;
  cell.querySelector('.img-frame')?.remove();
  cell.classList.remove('has-image', 'has-pdf-rendered');
  const uploadPrompt = cell.querySelector('.upload-prompt');

  const manualSrc = item?.images?.[slot];
  const pdfSrc    = item?._pdfSlots?.[slot];
  const src = manualSrc || pdfSrc;

  if (src) {
    const frame = document.createElement('div');
    frame.className = 'img-frame';
    const img = document.createElement('img');
    img.className = 'page-img';
    img.src = src;
    frame.appendChild(img);
    cell.insertBefore(frame, cell.querySelector('.remove-img'));
    if (manualSrc) {
      cell.classList.add('has-image');
    } else {
      cell.classList.add('has-pdf-rendered');
    }
    if (uploadPrompt) uploadPrompt.style.display = 'none';
  } else {
    if (uploadPrompt) uploadPrompt.style.display = '';
  }
}

// ── Layout switching ──────────────────────────────────────────────────────

function setLayout(sheetId, newLayout) {
  const item = getSheetItem(sheetId);
  if (!item || item.layout === newLayout) return;

  item.layout = newLayout;

  // Update layout class + active button on this sheet
  const sheetEl = document.getElementById(sheetId);
  if (sheetEl) {
    ['4up','3up','2up','1up'].forEach(m => sheetEl.classList.remove('layout-' + m));
    sheetEl.classList.add(layoutClass(newLayout));
    const wrapperEl = sheetEl.parentElement;
    if (wrapperEl && wrapperEl.classList.contains('sheet-and-sidebar')) {
      ['4up','3up','2up','1up'].forEach(m => wrapperEl.classList.remove('layout-' + m));
      wrapperEl.classList.add(layoutClass(newLayout));
    }
    sheetEl.querySelectorAll('.layout-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.layout === newLayout);
    });
  }

  // Recompute PDF assignments across ALL document pages (handles overflow + pull-forward)
  const pagesAdded = recomputePdfAssignments();
  if (pagesAdded > 0) {
    showToast(`${pagesAdded} page${pagesAdded !== 1 ? 's' : ''} added to fit PDF content`);
  }

  scheduleAutosave();
}

// ── PDF assignment recompute ──────────────────────────────────────────────
// Walks state.pdfPages[] consecutively through all thumbnail slots across
// all document pages in order. Creates new pages if there are more PDF pages
// than available slots. Updates _pdfSlots on every sheet and refreshes DOM.

function recomputePdfAssignments() {
  const sheets = state.items.filter(i => i.type === 'sheet');
  let pdfIdx = 0;

  // Clear all computed PDF slots
  sheets.forEach(s => { s._pdfSlots = [null, null, null, null]; });

  // First pass: fill existing sheets
  for (const sheet of sheets) {
    const slots = THUMB_SLOTS[sheet.layout || '2-up'];
    for (const slot of slots) {
      if (pdfIdx < state.pdfPages.length) {
        sheet._pdfSlots[slot] = state.pdfPages[pdfIdx++];
      }
    }
  }

  // Second pass: create new sheets for overflow PDF pages
  let pagesAdded = 0;
  while (pdfIdx < state.pdfPages.length) {
    const lastSheet = sheets[sheets.length - 1];
    const lesson = lastSheet ? { ...lastSheet.lesson } : { ...state.currentLesson };
    const id = nextId('sheet');
    const newSheet = makeBlankSheetItem(id, lesson);
    state.items.push(newSheet);
    sheets.push(newSheet);
    appendSheetEl(newSheet);
    appendGapZone(id);
    pagesAdded++;

    const slots = THUMB_SLOTS[newSheet.layout || '2-up'];
    for (const slot of slots) {
      if (pdfIdx < state.pdfPages.length) {
        newSheet._pdfSlots[slot] = state.pdfPages[pdfIdx++];
      }
    }
  }

  // Update DOM for every sheet
  for (const sheet of sheets) {
    for (let s = 0; s < 4; s++) rebuildThumbCell(sheet.id, s, sheet);
  }

  return pagesAdded;
}

// ── PDF range helpers ─────────────────────────────────────────────────────

// Returns { start, count } — the slice of state.pdfPages[] assigned to sheetId.
function getPdfRangeForSheet(sheetId) {
  let pdfIdx = 0;
  for (const sheet of state.items.filter(i => i.type === 'sheet')) {
    const slots = THUMB_SLOTS[sheet.layout || '2-up'];
    const start = pdfIdx;
    for (const s of slots) {
      if (pdfIdx < state.pdfPages.length) pdfIdx++;
    }
    if (sheet.id === sheetId) return { start, count: pdfIdx - start };
  }
  return { start: 0, count: 0 };
}

// Returns the index into state.pdfPages[] for a specific sheet+slot, or -1.
function getPdfIndexForSlot(sheetId, slot) {
  let pdfIdx = 0;
  for (const sheet of state.items.filter(i => i.type === 'sheet')) {
    const slots = THUMB_SLOTS[sheet.layout || '2-up'];
    for (const s of slots) {
      if (pdfIdx >= state.pdfPages.length) return -1;
      if (sheet.id === sheetId && s === slot) return pdfIdx;
      pdfIdx++;
    }
  }
  return -1;
}

// ── Cell context menu ─────────────────────────────────────────────────────

let _ctxSheetId = null;
let _ctxSlot    = null;
let _ctxType    = null;

function showCellContextMenu(e, sheetId, slot, ctxType = 'pdf') {
  _ctxSheetId = sheetId;
  _ctxSlot    = slot;
  _ctxType    = ctxType;
  const menu = document.getElementById('cell-ctx-menu');
  if (!menu) return;
  const replaceItem = document.getElementById('ctx-replace');
  const ctxSep = menu.querySelector('.ctx-sep');
  if (replaceItem) replaceItem.style.display = ctxType === 'pdf' ? '' : 'none';
  if (ctxSep)      ctxSep.style.display      = ctxType === 'pdf' ? '' : 'none';
  menu.style.left = e.clientX + 'px';
  menu.style.top  = e.clientY + 'px';
  menu.classList.add('show');
}

function hideCellContextMenu() {
  document.getElementById('cell-ctx-menu')?.classList.remove('show');
  _ctxSheetId = null;
  _ctxSlot    = null;
  _ctxType    = null;
}

function removeImageFromCell() {
  if (_ctxType === 'pdf') {
    const pdfIdx = getPdfIndexForSlot(_ctxSheetId, _ctxSlot);
    hideCellContextMenu();
    if (pdfIdx < 0) return;
    state.pdfPages.splice(pdfIdx, 1);
    recomputePdfAssignments();
    scheduleAutosave();
  } else {
    const sheetId = _ctxSheetId, slot = _ctxSlot;
    hideCellContextMenu();
    removeImage(sheetId, slot);
  }
}

function removePdfPage() {
  const pdfIdx = getPdfIndexForSlot(_ctxSheetId, _ctxSlot);
  hideCellContextMenu();
  if (pdfIdx < 0) return;
  state.pdfPages.splice(pdfIdx, 1);
  recomputePdfAssignments();
  scheduleAutosave();
}

function replacePdfPage() {
  const sheetId = _ctxSheetId;
  const slot    = _ctxSlot;
  hideCellContextMenu();
  const pdfIdx = getPdfIndexForSlot(sheetId, slot);
  if (pdfIdx < 0) return;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      state.pdfPages[pdfIdx] = ev.target.result;
      recomputePdfAssignments();
      scheduleAutosave();
    };
    reader.readAsDataURL(file);
  });
  input.click();
}

// ── Toast ─────────────────────────────────────────────────────────────────

function showToast(msg) {
  const el = document.getElementById('app-toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 3500);
}

// ── Space distribution ────────────────────────────────────────────────────


// ── Print toggle ──────────────────────────────────────────────────────────

function getPrintToggle(sheetId, numStr) {
  const item = getSheetItem(sheetId);
  return item ? (item.printToggles[numStr] ?? true) : true;
}

function setPrintToggle(sheetId, numStr, val) {
  const item = getSheetItem(sheetId);
  if (!item) return;
  if (val === true) {
    delete item.printToggles[numStr];
  } else {
    item.printToggles[numStr] = false;
  }
  renderBlocks(sheetId);
  scheduleAutosave();
}

// ── Capacity bars ─────────────────────────────────────────────────────────

function updateCapacity(sheetId) {
  const blocksEl = document.getElementById('blocks-' + sheetId);
  const fillIn   = document.getElementById('capfill-inprint-' + sheetId);
  const pctIn    = document.getElementById('cappct-inprint-' + sheetId);
  const fillHid  = document.getElementById('capfill-hidden-' + sheetId);
  const pctHid   = document.getElementById('cappct-hidden-' + sheetId);
  if (!blocksEl || !fillIn) return;

  const availH = blocksEl.getBoundingClientRect().height;
  if (availH <= 0) return;

  let inPrintH = 0, hiddenH = 0;
  blocksEl.querySelectorAll('.q-group, .st-block').forEach(grpEl => {
    const h = grpEl.getBoundingClientRect().height;
    if (grpEl.classList.contains('print-off')) hiddenH += h;
    else inPrintH += h;
  });

  const inPct  = availH > 0 ? Math.round(inPrintH  / availH * 100) : 0;
  const hidPct = availH > 0 ? Math.round(hiddenH / availH * 100) : 0;

  fillIn.style.width = Math.min(inPct, 100) + '%';
  fillIn.classList.toggle('amber', inPct >= 85 && inPct <= 100);
  fillIn.classList.toggle('over',  inPct > 100);
  pctIn.textContent = inPct + '%';

  fillHid.style.width = Math.min(hidPct, 100) + '%';
  pctHid.textContent = hidPct > 0 ? hidPct + '%' : '–';
}

// ── Image handling ────────────────────────────────────────────────────────

function loadImage(sheetId, slot, input) {
  if (!input.files || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const src  = ev.target.result;
    const item = getSheetItem(sheetId);
    if (item) item.images[slot] = src;
    rebuildThumbCell(sheetId, slot, item);
    scheduleAutosave();
  };
  reader.readAsDataURL(input.files[0]);
}

function removeImage(sheetId, slot) {
  const item = getSheetItem(sheetId);
  if (!item) return;
  item.images[slot] = null;
  const fi = document.getElementById(`file-${slot}-${sheetId}`);
  if (fi) fi.value = '';
  rebuildThumbCell(sheetId, slot, item);
  scheduleAutosave();
}

// ── Solution modal ────────────────────────────────────────────────────────

let activeSheetId   = null;
let editingEntryId  = null;
let activeDiagTab   = 'latex';
let areaModelEditor = null;
let currentImageData = null;

function clearImageTab() {
  currentImageData = null;
  const wrap = document.getElementById('img-preview-wrap');
  const img  = document.getElementById('img-preview');
  if (wrap) wrap.style.display = 'none';
  if (img)  img.src = '';
}

function loadImageIntoModal(file) {
  const reader = new FileReader();
  reader.onload = ev => {
    currentImageData = ev.target.result;
    const wrap = document.getElementById('img-preview-wrap');
    const img  = document.getElementById('img-preview');
    if (wrap) wrap.style.display = 'block';
    if (img)  img.src = currentImageData;
  };
  reader.readAsDataURL(file);
}

function addSectionTitle(sheetId) {
  const item = getSheetItem(sheetId);
  if (!item) return;
  item.entries.push({ id: nextId('e'), type: 'section-title', text: '' });
  renderBlocks(sheetId);
  scheduleAutosave();
  // Focus the new section title text for immediate editing
  requestAnimationFrame(() => {
    const container = document.getElementById('blocks-' + sheetId);
    const last = container?.querySelector('.st-block:last-child .st-block-text');
    if (last) { last.focus(); }
  });
}

function openSolModal(sheetId) {
  activeSheetId = sheetId; editingEntryId = null;
  document.getElementById('f-num').value = '';
  document.getElementById('f-type').value = 'full-solution';
  document.getElementById('f-body').value = '';
  document.getElementById('f-diag').value = '';
  document.getElementById('f-custom-label').value = '';
  document.getElementById('diag-preview').innerHTML =
    '<span style="color:#ccc;font-size:11px;">Preview will appear here</span>';
  document.getElementById('diag-section').classList.remove('show');
  document.getElementById('custom-label-row').classList.remove('show');
  document.getElementById('sol-modal-title').textContent = 'Add solution';
  switchDiagTab('latex');
  areaModelEditor.clear();
  clearBatexTab();
  clearImageTab();
  document.getElementById('sol-modal').classList.add('open');
  setTimeout(() => document.getElementById('f-num').focus(), 50);
}

function editEntry(sheetId, entryId) {
  const item  = getSheetItem(sheetId); if (!item) return;
  const entry = item.entries.find(e => e.id === entryId); if (!entry) return;

  activeSheetId = sheetId; editingEntryId = entryId;
  document.getElementById('f-num').value = entry.num || '';
  document.getElementById('f-type').value = entry.type;
  document.getElementById('f-body').value = entry.body || '';
  document.getElementById('f-custom-label').value = entry.customLabel || '';
  onTypeChange();

  clearImageTab();
  if (entry.batexCode) {
    document.getElementById('diag-section').classList.add('show');
    switchDiagTab('batex-diag');
    document.getElementById('f-batex-code').value = entry.batexCode;
    if (entry.batexDataUrl) restoreBatexCanvas(entry.batexDataUrl);
  } else if (entry.areaModel) {
    document.getElementById('diag-section').classList.add('show');
    switchDiagTab('area-model');
    areaModelEditor.load(entry.areaModel);
  } else if (entry.diag) {
    document.getElementById('diag-section').classList.add('show');
    switchDiagTab('latex');
    document.getElementById('f-diag').value = entry.diag;
    renderDiagPreview();
  } else if (entry.imageData) {
    document.getElementById('diag-section').classList.add('show');
    switchDiagTab('image');
    currentImageData = entry.imageData;
    const wrap = document.getElementById('img-preview-wrap');
    const img  = document.getElementById('img-preview');
    if (wrap) wrap.style.display = 'block';
    if (img)  img.src = entry.imageData;
  } else {
    document.getElementById('diag-section').classList.remove('show');
    switchDiagTab('latex');
  }
  document.getElementById('sol-modal-title').textContent = 'Edit solution';
  document.getElementById('sol-modal').classList.add('open');
}

function deleteEntry(sheetId, entryId) {
  const item = getSheetItem(sheetId); if (!item) return;
  item.entries = item.entries.filter(e => e.id !== entryId);
  renderBlocks(sheetId);
  scheduleAutosave();
}

function closeSolModal() {
  document.getElementById('sol-modal').classList.remove('open');
  activeSheetId = null; editingEntryId = null;
}

function onTypeChange() {
  const t = document.getElementById('f-type').value;
  document.getElementById('custom-label-row').classList.toggle('show', t === 'custom');
}

function toggleDiagSection() {
  document.getElementById('diag-section').classList.toggle('show');
}

function switchDiagTab(tab) {
  activeDiagTab = tab;
  document.querySelectorAll('.diag-tab').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.diag-tab-panel').forEach(p =>
    p.classList.toggle('active', p.dataset.tabPanel === tab));
}

function clearBatexTab() {
  document.getElementById('f-batex-code').value = '';
  const canvas = document.getElementById('batex-preview-canvas');
  canvas.style.display = 'none';
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function restoreBatexCanvas(dataUrl) {
  const canvas = document.getElementById('batex-preview-canvas');
  const img = new Image();
  img.onload = () => {
    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    canvas.style.display = 'block';
  };
  img.src = dataUrl;
}

// Returns the bounding box of actual drawn content on an offscreen canvas.
// Tries result.width/height from CanvasMath first; falls back to checking
// whether ctx.setSize() resized the canvas away from 2000x2000; then falls
// back to scanning pixel alpha data.
function batexContentBounds(offCvs, result) {
  if (result && typeof result.width === 'number' && result.width > 0 &&
      typeof result.height === 'number' && result.height > 0) {
    return { x: 0, y: 0, w: result.width, h: result.height };
  }
  if (offCvs.width < 2000 || offCvs.height < 2000) {
    return { x: 0, y: 0, w: offCvs.width, h: offCvs.height };
  }
  const W = offCvs.width, H = offCvs.height;
  const data = offCvs.getContext('2d').getImageData(0, 0, W, H).data;
  let minX = W, minY = H, maxX = -1, maxY = -1;
  for (let i = 0, y = 0; y < H; y++) {
    for (let x = 0; x < W; x++, i += 4) {
      if (data[i + 3] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return { x: 0, y: 0, w: 400, h: 150 };
  const pad = 4;
  const x0 = Math.max(0, minX - pad);
  const y0 = Math.max(0, minY - pad);
  return {
    x: x0, y: y0,
    w: Math.min(W, maxX + 1 + pad) - x0,
    h: Math.min(H, maxY + 1 + pad) - y0,
  };
}

function renderBatexPreview() {
  const code   = document.getElementById('f-batex-code').value.trim();
  const canvas = document.getElementById('batex-preview-canvas');
  if (!code) { canvas.style.display = 'none'; return; }
  canvas.style.display = 'block';

  const offCvs = document.createElement('canvas');
  offCvs.width  = 2000;
  offCvs.height = 2000;
  const offCtx = Shortvas.get(offCvs);
  const props = {
    batex:        code,
    x:            25,
    y:            30,
    fontInfo:     { size: 20, family: ['Roboto', 'sans-serif'] },
    wrapWidth:    460,
    insetBlurSize: 16,
    rulerFontSize: 25.5,
    debugBoxes:   false,
  };

  function paint() {
    offCvs.width  = 2000;
    offCvs.height = 2000;
    const result = CanvasMath.render(offCtx, props);
    if (result.errors && result.errors.length) {
      console.error(result.errors);
    }
    const bounds   = batexContentBounds(offCvs, result);
    const fitScale = (bounds.w > 0 && bounds.h > 0) ? Math.min(470 / bounds.w, 400 / bounds.h) : 1;
    canvas.width  = Math.max(1, Math.round(bounds.w * fitScale));
    canvas.height = Math.max(1, Math.round(bounds.h * fitScale));
    const visCtx = canvas.getContext('2d');
    visCtx.clearRect(0, 0, canvas.width, canvas.height);
    visCtx.drawImage(offCvs, bounds.x, bounds.y, bounds.w, bounds.h, 0, 0, canvas.width, canvas.height);
    canvas.style.width  = canvas.width  + 'px';
    canvas.style.height = canvas.height + 'px';
  }

  function doRender() {
    if (typeof withImageLoading === 'function') {
      withImageLoading(offCtx, paint);
    } else {
      paint();
    }
  }

  if (typeof waitForWebFonts === 'function') {
    waitForWebFonts(doRender);
  } else {
    doRender();
  }
}

function renderDiagPreview() {
  const raw = document.getElementById('f-diag').value;
  const el  = document.getElementById('diag-preview');
  if (!raw.trim()) {
    el.innerHTML = '<span style="color:#ccc;font-size:11px;">Preview will appear here</span>';
    return;
  }
  el.textContent = raw;
  renderMath(el);
}

function saveSol() {
  const num    = document.getElementById('f-num').value.trim();
  const type   = document.getElementById('f-type').value;
  const body   = document.getElementById('f-body').value.trim();
  const cLabel = document.getElementById('f-custom-label').value.trim();

  let diag = '', areaModel = null, batexCode = null, batexDataUrl = null, imageData = null;
  if (document.getElementById('diag-section').classList.contains('show')) {
    if (activeDiagTab === 'area-model') {
      areaModel = areaModelEditor.getValue();
    } else if (activeDiagTab === 'batex-diag') {
      batexCode = document.getElementById('f-batex-code').value.trim() || null;
      const previewCanvas = document.getElementById('batex-preview-canvas');
      if (batexCode && previewCanvas.style.display !== 'none') {
        batexDataUrl = previewCanvas.toDataURL('image/png');
      }
    } else if (activeDiagTab === 'image') {
      imageData = currentImageData;
    } else {
      diag = document.getElementById('f-diag').value.trim();
    }
  }

  if (!body && !diag && !areaModel && !batexCode && !imageData) { document.getElementById('f-body').focus(); return; }

  const item = getSheetItem(activeSheetId); if (!item) return;

  if (editingEntryId) {
    const idx = item.entries.findIndex(e => e.id === editingEntryId);
    if (idx > -1)
      item.entries[idx] = { ...item.entries[idx], num, type, customLabel: cLabel, body, diag, areaModel, batexCode, batexDataUrl, imageData };
  } else {
    item.entries.push({ id: nextId('e'), num, type, customLabel: cLabel, body, diag, areaModel, batexCode, batexDataUrl, imageData });
  }

  // No auto-sort — entries stay in user-defined order (drag to reorder)
  renderBlocks(activeSheetId);
  closeSolModal();
  scheduleAutosave();
}

// ── Lesson modal ──────────────────────────────────────────────────────────

function openLessonModal() {
  const next = String((parseInt(state.currentLesson.num) || 0) + 1);
  document.getElementById('l-num').value = next;
  document.getElementById('l-name').value = '';
  document.getElementById('lesson-modal').classList.add('open');
  setTimeout(() => document.getElementById('l-num').focus(), 50);
}
function closeLessonModal() { document.getElementById('lesson-modal').classList.remove('open'); }
function saveLessonModal() {
  const num  = document.getElementById('l-num').value.trim()
    || String((parseInt(state.currentLesson.num) || 0) + 1);
  const name = document.getElementById('l-name').value.trim();
  closeLessonModal();
  addLesson(num, name);
}

// ── Zoom ──────────────────────────────────────────────────────────────────

const ZOOM_LS_KEY  = 'solutions-zoom-v1';
const ZOOM_MIN     = 50;
const ZOOM_MAX     = 150;
const ZOOM_STEP    = 5;
const ZOOM_DEFAULT = 75;
const SHEET_H_PX   = 11 * 96; // 1056 CSS px  (portrait)

let zoomLevel = (() => {
  const saved = parseInt(localStorage.getItem(ZOOM_LS_KEY));
  return (!isNaN(saved) && saved >= ZOOM_MIN && saved <= ZOOM_MAX) ? saved : ZOOM_DEFAULT;
})();

function applyZoom() {
  const scale = zoomLevel / 100;
  // margin-bottom compensates for transform not affecting document flow:
  // layout height = 816px, visual height = 816*scale → gap = 816*(scale-1)
  const marginBottom = (SHEET_H_PX * (scale - 1)).toFixed(2);
  document.documentElement.style.setProperty('--screen-scale', scale.toFixed(5));
  document.documentElement.style.setProperty('--screen-margin-bottom', marginBottom + 'px');
  const pctEl = document.getElementById('zoom-pct');
  if (pctEl) pctEl.textContent = zoomLevel + '%';
  localStorage.setItem(ZOOM_LS_KEY, zoomLevel);
}

function zoomIn() {
  if (zoomLevel < ZOOM_MAX) { zoomLevel = Math.min(zoomLevel + ZOOM_STEP, ZOOM_MAX); applyZoom(); }
}

function zoomOut() {
  if (zoomLevel > ZOOM_MIN) { zoomLevel = Math.max(zoomLevel - ZOOM_STEP, ZOOM_MIN); applyZoom(); }
}

// ── Keyboard shortcuts ────────────────────────────────────────────────────

function handleKeydown(e) {
  if (e.key === 'Escape') { closeSolModal(); closeLessonModal(); }
  if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); saveToFile(); }
}

// ── Init ──────────────────────────────────────────────────────────────────

function init() {
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
  }

  // ── Context menu ──
  document.getElementById('ctx-remove')?.addEventListener('click', removeImageFromCell);
  document.getElementById('ctx-replace')?.addEventListener('click', replacePdfPage);
  document.addEventListener('click', e => {
    const menu = document.getElementById('cell-ctx-menu');
    if (menu && !menu.contains(e.target)) hideCellContextMenu();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') hideCellContextMenu();
  });

  document.getElementById('btn-add-page').addEventListener('click', () => addPage());
  document.getElementById('btn-add-lesson').addEventListener('click', openLessonModal);
  document.getElementById('btn-upload-pdf').addEventListener('click', triggerPdfUpload);
  document.getElementById('file-pdf').addEventListener('change', e => {
    handlePdfUpload(e.target.files[0]);
    e.target.value = '';
  });
  document.getElementById('btn-save').addEventListener('click', saveToFile);
  document.getElementById('btn-load').addEventListener('click', loadFromFile);
  document.getElementById('btn-export-csv').addEventListener('click', exportCsv);
  document.getElementById('btn-import-cancel').addEventListener('click', closeImportModal);
  document.getElementById('btn-import-replace').addEventListener('click', () => executeImport('replace'));
  document.getElementById('btn-import-append').addEventListener('click', () => executeImport('append'));
  document.getElementById('import-csv-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('import-csv-modal')) closeImportModal();
  });
  document.getElementById('btn-print').addEventListener('click', () => window.print());
  document.getElementById('view-toggle-btn').addEventListener('click', toggleViewMode);
  document.getElementById('unit-input').addEventListener('input', updateAllHeaders);

  document.getElementById('bot-add-page').addEventListener('click', () => addPage());
  document.getElementById('bot-add-lesson').addEventListener('click', openLessonModal);

  document.getElementById('f-type').addEventListener('change', onTypeChange);
  document.getElementById('toggle-diag-btn').addEventListener('click', toggleDiagSection);
  document.getElementById('f-diag').addEventListener('input', renderDiagPreview);
  document.getElementById('btn-sol-cancel').addEventListener('click', closeSolModal);
  document.getElementById('btn-sol-save').addEventListener('click', saveSol);
  document.querySelectorAll('.diag-tab').forEach(btn =>
    btn.addEventListener('click', () => switchDiagTab(btn.dataset.tab)));
  const _batexBtn = document.getElementById('batex-render-btn');
  if (_batexBtn) _batexBtn.addEventListener('click', renderBatexPreview);

  document.getElementById('img-upload-btn')?.addEventListener('click', () => {
    document.getElementById('f-img-file').click();
  });
  document.getElementById('f-img-file')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) loadImageIntoModal(file);
    e.target.value = '';
  });
  document.getElementById('img-remove-btn')?.addEventListener('click', clearImageTab);

  document.addEventListener('paste', e => {
    if (!document.getElementById('sol-modal').classList.contains('open')) return;
    if (activeDiagTab !== 'image') return;
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) { loadImageIntoModal(file); e.preventDefault(); }
        break;
      }
    }
  });

  document.getElementById('btn-lesson-cancel').addEventListener('click', closeLessonModal);
  document.getElementById('btn-lesson-save').addEventListener('click', saveLessonModal);

  document.getElementById('sol-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('sol-modal')) closeSolModal();
  });
  document.getElementById('lesson-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('lesson-modal')) closeLessonModal();
  });

  document.addEventListener('keydown', handleKeydown);
  areaModelEditor = initAreaModelEditor('am-a', 'am-b', 'am-preview');
  applyViewMode(state.viewMode, false);

  document.getElementById('btn-zoom-out').addEventListener('click', zoomOut);
  document.getElementById('btn-zoom-in').addEventListener('click', zoomIn);

  const restored = loadFromLocalStorage();
  if (!restored || state.items.length === 0) addPage({ num: '1', name: '' });

  applyZoom();
}

// ── CSV Export ────────────────────────────────────────────────────────────

function exportCsv() {
  const rows = [['Section', 'Problem', 'Category', 'Solution Text', 'BaTeX']];
  let currentSection = '';

  for (const item of state.items) {
    if (item.type !== 'sheet') continue;
    if (!item.entries || item.entries.length === 0) continue;
    for (const entry of item.entries) {
      if (entry.type === 'section-title') {
        currentSection = entry.text || '';
      } else {
        rows.push([
          currentSection,
          entry.num     || '',
          entry.type    || '',
          entry.body    || '',
          entry.batexCode || ''
        ]);
      }
    }
  }

  const csvText = rows.map(row =>
    row.map(cell => {
      const s = String(cell ?? '');
      return (s.includes(',') || s.includes('"') || s.includes('\n'))
        ? '"' + s.replace(/"/g, '""') + '"'
        : s;
    }).join(',')
  ).join('\n');

  const blob = new Blob([csvText], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `solutions-unit${state.unit || 'X'}.csv`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

// ── CSV Import ────────────────────────────────────────────────────────────

let importTargetSheetId = null;

function openImportModal(sheetId) {
  importTargetSheetId = sheetId;
  document.getElementById('import-csv-textarea').value = '';
  document.getElementById('import-csv-modal').classList.add('open');
  document.getElementById('import-csv-textarea').focus();
}

function closeImportModal() {
  document.getElementById('import-csv-modal').classList.remove('open');
  importTargetSheetId = null;
}

function parseCsvRows(text) {
  const lines = text.trim().split('\n').filter(l => l.trim() !== '');
  if (!lines.length) return [];

  const useTab = lines[0].includes('\t');

  function splitLine(line) {
    if (useTab) return line.split('\t').map(s => s.trim());
    const result = [];
    let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (c === '"') inQ = false;
        else cur += c;
      } else {
        if (c === '"') inQ = true;
        else if (c === ',') { result.push(cur.trim()); cur = ''; }
        else cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  }

  const rows = lines.map(splitLine);

  // Skip header row if detected
  const HEADER_WORDS = ['section', 'problem', 'category', 'solution text', 'batex'];
  const firstLower = rows[0].map(c => c.toLowerCase());
  if (HEADER_WORDS.some(w => firstLower.includes(w))) rows.shift();

  return rows;
}

function rowsToEntries(rows) {
  const entries = [];
  let prevSection = null;

  for (const row of rows) {
    if (row.length < 2) continue;
    const [section = '', num = '', type = '', body = '', batexCode = ''] = row;
    const sec = section.trim();

    if (sec !== '' && sec !== prevSection) {
      entries.push({ id: nextId('e'), type: 'section-title', text: sec });
      prevSection = sec;
    }

    const code = batexCode.trim() || null;
    const rawType = type.trim();
    entries.push({
      id: nextId('e'),
      num:         num.trim(),
      type:        rawType ? migrateEntryType(rawType) : 'full-solution',
      customLabel: '',
      body:        body.trim(),
      diag:        '',
      areaModel:   null,
      batexCode:   code,
      batexDataUrl: null,
      zoomLevel:   null
    });
  }

  return entries;
}

function executeImport(mode) {
  const sheetId = importTargetSheetId;
  const item = getSheetItem(sheetId);
  if (!item) return;

  const text = document.getElementById('import-csv-textarea').value;
  const rows = parseCsvRows(text);
  if (!rows.length) { closeImportModal(); return; }

  const newEntries = rowsToEntries(rows);
  if (mode === 'replace') {
    item.entries = newEntries;
  } else {
    item.entries.push(...newEntries);
  }

  closeImportModal();
  renderBlocks(sheetId);
  scheduleAutosave();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
