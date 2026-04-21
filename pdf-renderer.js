// ── PDF Renderer ──────────────────────────────────────────────────────────
// Manages PDF.js document loading, IntersectionObserver-based lazy rendering,
// and an LRU cache of the last MAX_CACHE rendered pages.

const WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const SCALE       = 1.5;
const JPEG_Q      = 0.85;
const MAX_CACHE   = 10;

let pdfDoc         = null;
let ioObserver     = null;
let pendingRenders = []; // { el, pageNum } queued before PDF was loaded

const pageCache = new Map(); // pageNum → JPEG data URL (LRU)

// ── Init ──────────────────────────────────────────────────────────────────

export function initPdfRenderer() {
  if (typeof pdfjsLib === 'undefined') {
    console.warn('PDF.js not loaded — PDF upload will be unavailable');
    return;
  }
  pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_URL;

  ioObserver = new IntersectionObserver(handleIntersect, {
    rootMargin: '250px 0px' // start loading a bit before the sheet enters view
  });
}

// ── IntersectionObserver callback ─────────────────────────────────────────

function handleIntersect(entries) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const pgNum = parseInt(el.dataset.pdfPage, 10);
    // Already rendered or overridden by a manual image — stop watching
    if (!pgNum || el.classList.contains('has-image') || el.classList.contains('has-pdf-rendered')) {
      ioObserver.unobserve(el);
      return;
    }
    ioObserver.unobserve(el); // render once; re-observe only after a full canvas rebuild
    if (!pdfDoc) {
      pendingRenders.push({ el, pgNum });
    } else {
      _renderIntoEl(el, pgNum);
    }
  });
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Load (or reload) a PDF from a base64 data-URI or raw base64 string.
 * Returns the page count when ready.
 */
export async function loadPdfDocument(base64) {
  // Tear down any previously loaded document
  if (pdfDoc) { await pdfDoc.destroy(); pdfDoc = null; }
  pageCache.clear();
  pendingRenders = [];

  const raw    = base64.includes(',') ? base64.split(',')[1] : base64;
  const binary = atob(raw);
  const bytes  = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

  pdfDoc = await pdfjsLib.getDocument({ data: bytes }).promise;

  // Read aspect ratio from page 1 (width / height at scale 1)
  const firstPage = await pdfDoc.getPage(1);
  const vp        = firstPage.getViewport({ scale: 1 });
  const aspectRatio = vp.width / vp.height;

  // Flush any renders that arrived while we were loading
  const flush = pendingRenders.splice(0);
  flush.forEach(({ el, pgNum }) => _renderIntoEl(el, pgNum));

  return { numPages: pdfDoc.numPages, aspectRatio };
}

export function getPdfPageCount() { return pdfDoc ? pdfDoc.numPages : 0; }
export function isPdfLoaded()     { return pdfDoc !== null; }

/**
 * Register a student-col element for lazy PDF rendering via IntersectionObserver.
 */
export function observePdfSheet(el, pageNum) {
  if (!ioObserver) return;
  el.dataset.pdfPage = pageNum;
  ioObserver.observe(el);
}

/**
 * Render immediately, bypassing the IntersectionObserver.
 * Safe to call before the PDF is loaded — it will queue and run after load.
 */
export function renderPdfPageImmediately(el, pageNum) {
  if (!pdfDoc) {
    el.dataset.pdfPage = pageNum;
    pendingRenders.push({ el, pgNum: pageNum });
    return;
  }
  _renderIntoEl(el, pageNum);
}

export function unloadPdf() {
  if (pdfDoc) { pdfDoc.destroy(); pdfDoc = null; }
  pageCache.clear();
  pendingRenders = [];
}

// ── Internal rendering ────────────────────────────────────────────────────

async function _renderIntoEl(el, pgNum) {
  // Guard: element may have been given a manual image since it was queued
  if (el.classList.contains('has-image') || el.classList.contains('has-pdf-rendered')) return;
  if (!pdfDoc) return;

  // Update placeholder text while rendering
  const placeholder = el.querySelector('.pdf-placeholder');
  if (placeholder) placeholder.textContent = `Rendering page ${pgNum}…`;

  let dataURL = _getCached(pgNum);
  if (!dataURL) {
    try {
      const page     = await pdfDoc.getPage(pgNum);
      const viewport = page.getViewport({ scale: SCALE });
      const canvas   = document.createElement('canvas');
      canvas.width   = viewport.width;
      canvas.height  = viewport.height;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      dataURL = canvas.toDataURL('image/jpeg', JPEG_Q);
      _setCached(pgNum, dataURL);
    } catch (err) {
      if (placeholder) placeholder.textContent = `⚠ Could not render page ${pgNum}`;
      return;
    }
  }

  if (placeholder) placeholder.remove();
  const staleImg = el.querySelector('img.page-img');
  if (staleImg) staleImg.remove();

  const img = document.createElement('img');
  img.src   = dataURL;
  img.className = 'page-img';
  // Insert before the remove button so z-ordering is preserved
  const removeBtn = el.querySelector('.remove-img');
  if (removeBtn) el.insertBefore(img, removeBtn);
  else el.appendChild(img);

  el.classList.add('has-pdf-rendered');
}

// ── LRU cache helpers ─────────────────────────────────────────────────────

function _getCached(pgNum) {
  if (!pageCache.has(pgNum)) return null;
  const val = pageCache.get(pgNum);
  // Refresh to tail (most-recently-used)
  pageCache.delete(pgNum);
  pageCache.set(pgNum, val);
  return val;
}

function _setCached(pgNum, dataURL) {
  pageCache.delete(pgNum);
  pageCache.set(pgNum, dataURL);
  if (pageCache.size > MAX_CACHE) {
    // Evict the oldest (head of insertion-ordered Map)
    pageCache.delete(pageCache.keys().next().value);
  }
}
