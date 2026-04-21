// ── Batex Diagram Renderer ────────────────────────────────────────────────
// Standalone canvas-based diagram helpers that mirror the AoPS batex diagram API.
// The diagram code runs in a sandbox with ctx (canvas context) and all helpers
// injected as local variables.

// ── Color palette (matches AoPS diagram colors) ───────────────────────────

const COLOR_MAP = {
  white: '#fff', black: '#000', gray: '#9e9e9e', lightgray: '#d3d3d3',
  darkgray: '#616161', blue: '#1565c0', lightblue: '#90caf9',
  red: '#c62828', green: '#2e7d32', yellow: '#f9a825', orange: '#e65100',
  purple: '#6a1b9a', pink: '#f48fb1', teal: '#00695c', brown: '#4e342e',
  'light gray': '#d3d3d3', 'dark gray': '#616161',
};

function resolveColor(name) {
  if (!name) return '#fff';
  return COLOR_MAP[name.toLowerCase()] || name;
}

// ── V and V3 vector helpers ───────────────────────────────────────────────

export const V  = (x, y)    => [x, y];
export const V3 = (x, y, z) => [x, y, z];

// ── fillAll ───────────────────────────────────────────────────────────────

export function fillAll(ctx, colorName) {
  const c = ctx.canvas || ctx;
  ctx.save();
  ctx.fillStyle = resolveColor(colorName);
  ctx.fillRect(0, 0, c.width || ctx.getWidth(), c.height || ctx.getHeight());
  ctx.restore();
}

// ── drawArrow ─────────────────────────────────────────────────────────────

export function drawArrow(ctx, x1, y1, x2, y2, opts = {}) {
  const dx  = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return;
  const headLen = opts.headLength ?? Math.min(12, len * 0.35);
  const angle   = Math.atan2(dy, dx);
  const lw      = opts.lineWidth ?? 2;

  ctx.save();
  ctx.lineWidth   = lw;
  ctx.strokeStyle = opts.color ?? ctx.strokeStyle ?? '#333';
  ctx.fillStyle   = opts.color ?? ctx.fillStyle   ?? '#333';

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLen * Math.cos(angle - 0.38), y2 - headLen * Math.sin(angle - 0.38));
  ctx.lineTo(x2 - headLen * Math.cos(angle + 0.38), y2 - headLen * Math.sin(angle + 0.38));
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// ── drawCurlyBrace ────────────────────────────────────────────────────────

export function drawCurlyBrace(ctx, spanPx, x, y, side = 't') {
  const h = 8;
  const mid = x + spanPx / 2;
  ctx.save();
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (side === 't') {
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x, y - h, x + spanPx / 4, y - h);
    ctx.quadraticCurveTo(mid - 2, y - h, mid, y - h * 2);
    ctx.quadraticCurveTo(mid + 2, y - h, x + 3 * spanPx / 4, y - h);
    ctx.quadraticCurveTo(x + spanPx, y - h, x + spanPx, y);
  } else {
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x, y + h, x + spanPx / 4, y + h);
    ctx.quadraticCurveTo(mid - 2, y + h, mid, y + h * 2);
    ctx.quadraticCurveTo(mid + 2, y + h, x + 3 * spanPx / 4, y + h);
    ctx.quadraticCurveTo(x + spanPx, y + h, x + spanPx, y);
  }
  ctx.stroke();
  ctx.restore();
}

// ── label ─────────────────────────────────────────────────────────────────
// label(ctx, text, x, y, directionVec, options)
// directionVec e.g. [0, -1] for above, [1, 0] for right

export function label(ctx, text, x, y, directionVec, opts = {}) {
  const clean    = stripMath(text);
  const fontSize = opts.fontSize ?? 14;
  const color    = opts.color    ?? '#000';
  const pad      = opts.padding  ?? 3;

  ctx.save();
  ctx.font         = `${fontSize}px Roboto, sans-serif`;
  ctx.fillStyle    = color;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';

  const tw  = ctx.measureText(clean).width;
  const th  = fontSize;
  const dir = Array.isArray(directionVec) ? directionVec : [0, -1];
  const lx  = x + dir[0] * (tw / 2 + pad);
  const ly  = y + dir[1] * (th / 2 + pad);

  if (opts.backColor) {
    ctx.fillStyle = resolveColor(opts.backColor);
    ctx.fillRect(lx - tw / 2 - pad, ly - th / 2 - pad, tw + 2 * pad, th + 2 * pad);
    ctx.fillStyle = color;
  }
  ctx.fillText(clean, lx, ly);
  ctx.restore();
}

// ── TapeDiagram ───────────────────────────────────────────────────────────
// TapeDiagram(ctx, xOffset, yOffset, options)
//
// options:
//   cells:  [{content, width, bgColor, color, quantity, dashed, fontSize, contentOffset}]
//   braces: [{content, fromIndex, length, position:'top'|'bottom', fontSize, boxSize}]
//   height: 'shorter' | 'taller' | default(50)
//   xScale: number (default 1)
//   yScale: number (default 1)
//   setSize: bool (default true) — auto-size canvas
//   xSize:  number (default 288) — total tape width in px before scaling

export function TapeDiagram(ctx, xOff = 0, yOff = 0, opts = {}) {
  const {
    cells   = [],
    braces  = [],
    height  = null,
    xScale  = 1,
    yScale  = 1,
    setSize = true,
    xSize   = 288,
  } = opts;

  const cellH = (height === 'shorter' ? 35 : height === 'taller' ? 65 : 50) * yScale;
  const tapeW = xSize * xScale;
  xOff       += 2;  // matches bundle +2

  // Expand cells with quantity
  const expanded = [];
  const cellDef  = {
    content: '', width: 1, bgColor: 'white', color: 'black',
    quantity: 1, dashed: false, fontSize: 0.9, contentOffset: 0,
  };
  for (const c of cells) {
    const merged = { ...cellDef, ...c };
    for (let q = 0; q < (merged.quantity || 1); q++) {
      const isDashedDivider = merged.dashed && q < (merged.quantity || 1) - 1;
      expanded.push({ ...merged, _dashedDivider: isDashedDivider });
    }
  }

  const totalW = expanded.reduce((s, c) => s + (c.width || 1), 0) || 1;

  // Brace heights
  const topBraceH = braces.some(b => b.position !== 'bottom') ? 36 : 0;
  const botBraceH = braces.some(b => b.position === 'bottom') ? 36 : 0;

  const canvasW = tapeW + xOff + 4;
  const canvasH = cellH + yOff + topBraceH + botBraceH + 8;

  const raw = ctx.canvas ?? { width: 0, height: 0 };

  if (setSize) {
    if (ctx.setSize) {
      ctx.setSize(canvasW, canvasH);
    } else {
      raw.width  = canvasW;
      raw.height = canvasH;
    }
  }

  const drawY = yOff + topBraceH;
  const base  = ctx.canvas ? ctx : null;
  const c2d   = base ? ctx : ctx; // ctx is already the 2d context

  // Draw cells
  let cx = xOff;
  for (let i = 0; i < expanded.length; i++) {
    const cell = expanded[i];
    const cw   = (cell.width || 1) * tapeW / totalW;

    c2d.save();
    c2d.fillStyle = resolveColor(cell.bgColor);
    c2d.fillRect(cx, drawY, cw, cellH);

    // Divider line (right edge of each cell except last)
    if (i < expanded.length - 1) {
      c2d.strokeStyle = '#333';
      c2d.lineWidth   = cell._dashedDivider ? 2 : 2;
      c2d.setLineDash(cell._dashedDivider ? [4, 2] : []);
      c2d.beginPath();
      c2d.moveTo(cx + cw, drawY);
      c2d.lineTo(cx + cw, drawY + cellH);
      c2d.stroke();
    }

    // Cell text content
    const text = stripMath(cell.content || '');
    if (text) {
      const fs = (cell.fontSize ?? 0.9) * 16;
      c2d.fillStyle    = resolveColor(cell.color || 'black');
      c2d.font         = `${fs}px Roboto, sans-serif`;
      c2d.textAlign    = 'center';
      c2d.textBaseline = 'middle';
      c2d.setLineDash([]);
      c2d.fillText(text, cx + cw / 2, drawY + cellH / 2 + (cell.contentOffset || 0));
    }
    c2d.restore();
    cx += cw;
  }

  // Outer border
  c2d.save();
  c2d.strokeStyle = '#333';
  c2d.lineWidth   = 2;
  c2d.setLineDash([]);
  c2d.strokeRect(xOff, drawY, tapeW, cellH);
  c2d.restore();

  // Braces
  for (const brace of braces) {
    const fi   = brace.fromIndex ?? 0;
    const bLen = brace.length    ?? expanded.length - fi;
    const pos  = brace.position !== 'bottom' ? 'top' : 'bottom';

    // Compute brace span
    let bx1 = xOff, bx2 = xOff;
    let wAcc = 0;
    for (let i = 0; i < expanded.length; i++) {
      const cw = (expanded[i].width || 1) * tapeW / totalW;
      if (i < fi) bx1 = xOff + (wAcc += cw) - cw, bx1 += cw;
      else if (i < fi) { wAcc += cw; }
      if (i === fi) bx1 = xOff + wAcc;
      if (i < fi + bLen) bx2 = xOff + (wAcc += cw);
      else if (i >= fi + bLen) { /* already past */ }
      if (i < fi) wAcc += 0; // already accumulated
    }
    // Simpler span calculation:
    let spanStart = xOff, spanW = 0, wacc = 0;
    for (let i = 0; i < expanded.length; i++) {
      const cw = (expanded[i].width || 1) * tapeW / totalW;
      if (i === fi)   spanStart = xOff + wacc;
      if (i >= fi && i < fi + bLen) spanW += cw;
      wacc += cw;
    }

    const braceY = pos === 'top'
      ? drawY
      : drawY + cellH;

    // Draw curly brace
    const braceContent = stripMath(brace.content || '');
    const bfs = (brace.fontSize ?? 1) * 14;

    c2d.save();
    c2d.strokeStyle = '#333';
    c2d.lineWidth   = 1.5;
    drawCurlyBrace(c2d, spanW, spanStart, braceY, pos === 'top' ? 't' : 'b');

    // Brace label / box
    if (brace.content) {
      const labelY = pos === 'top'
        ? braceY - 20
        : braceY + 20;

      if (brace.boxSize) {
        const bs = brace.boxSize;
        c2d.strokeRect(spanStart + spanW / 2 - bs / 2, labelY - bs / 2, bs, bs);
      }
      if (braceContent) {
        c2d.font         = `${bfs}px Roboto, sans-serif`;
        c2d.fillStyle    = resolveColor(brace.color || 'black');
        c2d.textAlign    = 'center';
        c2d.textBaseline = 'middle';
        c2d.fillText(braceContent, spanStart + spanW / 2, labelY);
      }
    }
    c2d.restore();
  }
}

// ── NumberLine ────────────────────────────────────────────────────────────
// Simple canvas number line.
// NumberLine(ctx, start, end, options)
// options: {step, width, height, labels, markAt, setSize}

export function NumberLine(ctx, start = 0, end = 10, opts = {}) {
  const {
    step    = 1,
    width   = 280,
    height  = 60,
    labels  = true,
    markAt  = [],
    setSize = true,
  } = opts;

  if (setSize) {
    if (ctx.setSize) ctx.setSize(width + 20, height + 20);
    else {
      if (ctx.canvas) { ctx.canvas.width = width + 20; ctx.canvas.height = height + 20; }
    }
  }

  const margin = 10;
  const y = (height + 20) / 2;
  const range = end - start || 1;

  const toX = v => margin + ((v - start) / range) * width;

  ctx.save();
  ctx.strokeStyle = '#333';
  ctx.fillStyle   = '#333';
  ctx.lineWidth   = 2;
  ctx.setLineDash([]);

  // Main line
  drawArrow(ctx, margin - 4, y, margin + width + 8, y, { lineWidth: 2 });

  // Ticks and labels
  ctx.font         = '12px Roboto, sans-serif';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'top';

  for (let v = start; v <= end; v += step) {
    const x = toX(v);
    ctx.beginPath();
    ctx.moveTo(x, y - 6);
    ctx.lineTo(x, y + 6);
    ctx.stroke();
    if (labels) ctx.fillText(String(v), x, y + 8);
  }

  // markAt points
  for (const val of markAt) {
    const x = toX(val);
    ctx.save();
    ctx.fillStyle = '#1565c0';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

// ── DotGroups (simplified) ────────────────────────────────────────────────
// DotGroups(ctx, groups, options)
// groups: [{count, color}]

export function DotGroups(ctx, groups = [], opts = {}) {
  const dotR    = opts.dotRadius ?? 8;
  const pad     = opts.padding   ?? 4;
  const perRow  = opts.perRow    ?? 5;
  const setSize = opts.setSize   !== false;

  let maxCols = 0;
  let rows    = 0;
  for (const g of groups) {
    const cnt = g.count || 0;
    maxCols = Math.max(maxCols, Math.min(cnt, perRow));
    rows   += Math.ceil(cnt / perRow);
  }

  const w = (maxCols * (dotR * 2 + pad)) + pad;
  const h = (rows * (dotR * 2 + pad)) + pad;

  if (setSize) {
    if (ctx.setSize) ctx.setSize(w, h);
    else if (ctx.canvas) { ctx.canvas.width = w; ctx.canvas.height = h; }
  }

  let gy = pad;
  for (const g of groups) {
    const cnt   = g.count || 0;
    const gRows = Math.ceil(cnt / perRow);
    for (let i = 0; i < cnt; i++) {
      const col = i % perRow;
      const row = Math.floor(i / perRow);
      const cx  = pad + col * (dotR * 2 + pad) + dotR;
      const cy  = gy + row * (dotR * 2 + pad) + dotR;
      ctx.save();
      ctx.fillStyle   = resolveColor(g.color || 'blue');
      ctx.strokeStyle = resolveColor(g.color || 'blue');
      ctx.beginPath();
      ctx.arc(cx, cy, dotR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    gy += gRows * (dotR * 2 + pad);
  }
}

// ── Encircle (draws an ellipse around a region) ───────────────────────────

export function Encircle(ctx, x, y, w, h, opts = {}) {
  ctx.save();
  ctx.strokeStyle = resolveColor(opts.color || 'red');
  ctx.lineWidth   = opts.lineWidth ?? 2;
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h / 2, w / 2 + 4, h / 2 + 4, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// ── XOGrid (simple grid with X/O markers) ────────────────────────────────

export function XOGrid(ctx, grid, opts = {}) {
  const cellSize = opts.cellSize ?? 30;
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;
  const w = cols * cellSize;
  const h = rows * cellSize;

  if (opts.setSize !== false) {
    if (ctx.setSize) ctx.setSize(w + 4, h + 4);
    else if (ctx.canvas) { ctx.canvas.width = w + 4; ctx.canvas.height = h + 4; }
  }

  ctx.save();
  ctx.strokeStyle = '#333';
  ctx.lineWidth   = 1;

  for (let r = 0; r < rows; r++) {
    for (let cc = 0; cc < cols; cc++) {
      const x = cc * cellSize + 2;
      const y = r * cellSize + 2;
      ctx.strokeRect(x, y, cellSize, cellSize);
      const val = grid[r][cc];
      if (val) {
        ctx.save();
        ctx.font         = `${cellSize * 0.6}px Roboto, sans-serif`;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle    = val === 'X' ? '#c62828' : '#1565c0';
        ctx.fillText(val, x + cellSize / 2, y + cellSize / 2);
        ctx.restore();
      }
    }
  }
  ctx.restore();
}

// ── Utility: strip $...$ LaTeX delimiters for plain-text fallback ─────────

function stripMath(text) {
  if (!text) return '';
  return text
    .replace(/\$\$(.*?)\$\$/gs, '$1')
    .replace(/\$(.*?)\$/g, '$1')
    .replace(/\\\((.*?)\\\)/gs, '$1')
    .replace(/\\\[(.*?)\\\]/gs, '$1')
    .replace(/\\blank\{[^}]*\}/g, '□')
    .replace(/\\smaller\[[^\]]*\]\{([^}]*)\}/g, '$1')
    .replace(/\\bigger\[[^\]]*\]\{([^}]*)\}/g, '$1')
    .replace(/\\color\{[^}]*\}\{([^}]*)\}/g, '$1')
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)')
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/[{}]/g, '')
    .trim();
}

// ── Wrap ctx for batex-style usage ────────────────────────────────────────
// Creates a Shortvas-compatible canvas context wrapper for a real canvas element.

function wrapContext(canvas) {
  const ctx2d = canvas.getContext('2d');

  // Build a thin proxy that adds Shortvas-style helpers to a native context
  const proxy = new Proxy(ctx2d, {
    get(target, prop) {
      if (prop === 'canvas')    return canvas;
      if (prop === 'setSize')   return (w, h) => { canvas.width = w; canvas.height = h; };
      if (prop === 'getWidth')  return () => canvas.width;
      if (prop === 'getHeight') return () => canvas.height;
      if (prop === 'setLineDash') return (arr) => target.setLineDash(arr);
      if (prop === 'rotateAboutDeg') return (deg, cx, cy) => {
        target.translate(cx, cy);
        target.rotate(deg * Math.PI / 180);
        target.translate(-cx, -cy);
      };
      const val = target[prop];
      return typeof val === 'function' ? val.bind(target) : val;
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
  });

  return proxy;
}

// ── renderDiagramCode ─────────────────────────────────────────────────────
// Runs diagram JavaScript code with all helpers available.
// Returns a data URL of the rendered canvas.

export async function renderDiagramCode(code, canvasEl) {
  // Start with a default canvas size; code can call ctx.setSize() to resize.
  canvasEl.width  = 300;
  canvasEl.height = 200;

  const ctx = wrapContext(canvasEl);

  // Collect all helpers
  const helpers = {
    ctx,
    V, V3, fillAll, drawArrow, drawCurlyBrace, label,
    TapeDiagram, NumberLine, DotGroups, Encircle, XOGrid,
    // Passthrough stubs for less-common helpers
    drawBatex:        (c, text, x, y) => { c.fillText(stripMath(text), x, y); },
    measureBatex:     () => ({ width: 60, height: 20 }),
    drawBatexAtCenter:(c, text, x, y) => { c.textAlign = 'center'; c.fillText(stripMath(text), x, y); c.textAlign = 'left'; },
    drawBatexInRect:  (c, text, rect) => { c.fillText(stripMath(text), rect[0], rect[1]); },
    drawQuadArrow:    (c, x1, y1, cx_, cy_, x2, y2) => {
      c.save(); c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo(cx_, cy_, x2, y2); c.stroke(); c.restore();
      drawArrow(c, cx_, cy_, x2, y2);
    },
    drawToothpick:    () => {},
    drawProtractor:   () => {},
    drawRuler:        () => {},
    EngineHelper:     {},
    KeepingTrack:     {},
    KeepingTrackPairs:{},
    rrDraw:           () => {},
    CubeVolume:       () => {},
    RoundVolume:      () => {},
    ShapeArea:        () => {},
    ShapeVolume:      () => {},
    CheckerboardPaths:() => {},
    CityWalks:        () => {},
    GridShapes:       () => {},
    Colorominoes:     () => {},
    CrossSums:        () => {},
    DotTrace:         () => {},
    WaterfallPuzzle:  () => {},
    LH:               () => {},
    D:                { N:[0,-.7], NE:[.5,-.5], E:[.7,0], SE:[.5,.5], S:[0,.7], SW:[-.5,.5], W:[-.7,0], NW:[-.5,-.5] },
    Dir:              { N:[0,-.7], NE:[.5,-.5], E:[.7,0], SE:[.5,.5], S:[0,.7], SW:[-.5,.5], W:[-.7,0], NW:[-.5,-.5] },
    Shortvas:         null,
  };

  // Build injected preamble (mirrors cleanDiagramCode)
  const paramNames = Object.keys(helpers);
  const paramVals  = Object.values(helpers);

  try {
    const fn = new Function(
      ...paramNames,
      `"use strict"; return (async () => {\n${code}\n})();`
    );
    await fn(...paramVals);
  } catch (err) {
    const c2d = canvasEl.getContext('2d');
    c2d.clearRect(0, 0, canvasEl.width, canvasEl.height);
    c2d.fillStyle = '#c62828';
    c2d.font      = '12px monospace';
    c2d.textBaseline = 'top';
    const msg = 'Error: ' + err.message;
    // Word-wrap error message
    const maxW = canvasEl.width - 12;
    let line = '', y = 8;
    for (const word of msg.split(' ')) {
      const test = line ? line + ' ' + word : word;
      if (c2d.measureText(test).width > maxW) {
        c2d.fillText(line, 8, y);
        line = word;
        y += 16;
      } else {
        line = test;
      }
    }
    if (line) c2d.fillText(line, 8, y);
  }

  return canvasEl.toDataURL('image/png');
}
