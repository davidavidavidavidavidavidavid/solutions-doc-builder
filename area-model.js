// ── Area Model Renderer & Editor ─────────────────────────────────────────
// Digit-count → size in units: 1→2, 2→3, 3→4, 4→5, 5→6
// Each unit = BASE_PX pixels.

const BASE_PX = 20;
const DIGIT_UNITS = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6 };

function numDigits(n) {
  return String(Math.abs(Math.round(n))).replace(/^0+/, '').length || 1;
}

function sizePx(n) {
  const d = Math.min(numDigits(n), 5);
  return (DIGIT_UNITS[d] ?? 6) * BASE_PX;
}

// Decompose a positive integer by place value, dropping zero terms.
// e.g. 483 → [400, 80, 3]
function decompose(n) {
  const s = String(Math.abs(Math.round(n)));
  return s
    .split('')
    .map((digit, i) => parseInt(digit) * Math.pow(10, s.length - 1 - i))
    .filter(v => v > 0);
}

// Build a standalone area-model DOM element.
export function buildAreaModelEl(a, b) {
  const rows = decompose(a); // vertical parts (left axis)
  const cols = decompose(b); // horizontal parts (top axis)

  // Pre-compute cell sizes, enforcing square when digit counts match.
  const rowH = rows.map(r => sizePx(r));
  const colW = cols.map(c => sizePx(c));

  rows.forEach((r, ri) => {
    cols.forEach((c, ci) => {
      if (numDigits(r) === numDigits(c)) {
        const sq = Math.max(rowH[ri], colW[ci]);
        rowH[ri] = sq;
        colW[ci] = sq;
      }
    });
  });

  const table = document.createElement('table');
  table.className = 'area-model-table';
  table.style.tableLayout = 'fixed';

  // ── Header row (column labels) ────────────────────────────────────────
  const headerRow = document.createElement('tr');

  // Top-left corner cell (matches the row-header column)
  const corner = document.createElement('td');
  corner.className = 'am-corner';
  corner.style.width = '36px'; // row-header width
  headerRow.appendChild(corner);

  cols.forEach((c, ci) => {
    const th = document.createElement('td');
    th.className = 'am-col-header';
    th.textContent = c;
    th.style.width = colW[ci] + 'px';
    th.style.height = '20px';
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  // ── Data rows ─────────────────────────────────────────────────────────
  rows.forEach((r, ri) => {
    const tr = document.createElement('tr');

    // Row header (no border, right-aligned)
    const rh = document.createElement('td');
    rh.className = 'am-row-header';
    rh.textContent = r;
    rh.style.width = '36px';
    rh.style.height = rowH[ri] + 'px';
    tr.appendChild(rh);

    cols.forEach((c, ci) => {
      const td = document.createElement('td');
      td.className = 'am-cell';
      td.textContent = r * c;
      td.style.width = colW[ci] + 'px';
      td.style.height = rowH[ri] + 'px';
      tr.appendChild(td);
    });

    table.appendChild(tr);
  });

  const wrap = document.createElement('div');
  wrap.className = 'area-model-wrap';
  wrap.appendChild(table);
  return wrap;
}

// ── Modal editor wiring ───────────────────────────────────────────────────
// Call once after the modal HTML exists. Returns an object with helpers.
export function initAreaModelEditor(inputAId, inputBId, previewId) {
  const inputA = document.getElementById(inputAId);
  const inputB = document.getElementById(inputBId);
  const preview = document.getElementById(previewId);

  function refresh() {
    const a = parseInt(inputA.value);
    const b = parseInt(inputB.value);
    preview.innerHTML = '';
    if (a > 0 && b > 0 && a <= 99999 && b <= 99999) {
      preview.appendChild(buildAreaModelEl(a, b));
    } else {
      preview.innerHTML = '<span style="color:#ccc;font-size:11px;">Enter two numbers above to preview</span>';
    }
  }

  inputA.addEventListener('input', refresh);
  inputB.addEventListener('input', refresh);

  return {
    // Load existing values into the editor.
    load(areaModel) {
      inputA.value = areaModel ? areaModel.a : '';
      inputB.value = areaModel ? areaModel.b : '';
      refresh();
    },
    // Clear the editor.
    clear() {
      inputA.value = '';
      inputB.value = '';
      preview.innerHTML = '<span style="color:#ccc;font-size:11px;">Enter two numbers above to preview</span>';
    },
    // Return { a, b } if valid, else null.
    getValue() {
      const a = parseInt(inputA.value);
      const b = parseInt(inputB.value);
      return (a > 0 && b > 0) ? { a, b } : null;
    }
  };
}
