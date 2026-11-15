/* Patterns – drawing each kind of picture (scenes.js).
   PScenes.render(pz, V) returns the HTML for the middle of the puzzle screen;
   PScenes.option(o) returns the inside of one answer button.
   V is the puzzle's live state from game.js: filled gaps, shown hints (V.vis),
   marks on things tapped, what is built or selected, and whether it is solved. */
(function () {
  'use strict';
  const A = window.PArt;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pc = t => A.svg(t, 'pc');
  const done = V => V.solved || V.revealed;

  /* ---------- what goes in one cell (line, circle, grid) ---------- */
  function content(c, V, pz) {
    if (c.q) return done(V) ? { html: pc(c.tok), cls: 'q just' } : { html: '<span class="qm" aria-hidden="true">?</span>', cls: 'q' };
    if (c.gap) {
      const got = V.filled[c.id];
      if (got) return { html: pc(got), cls: 'gap filled' + (V.justId === c.id ? ' just' : '') };
      if (V.revealed) return { html: pc(c.tok), cls: 'gap filled shown' };
      const now = pz.slots && pz.slots[V.fillAt] === c.id && !V.locked ? ' now' : '';
      const ghost = (c.ghost || V.vis.has('ghost') || V.ghostSlots.has(c.id)) ? `<span class="ghost">${pc(c.tok)}</span>` : '';
      return { html: ghost, cls: 'gap' + now };
    }
    if (c.empty) return { html: '', cls: 'empty' + (c.now && !V.locked ? ' now' : '') };
    if (c.wrong && done(V) && c.fixTo) return { html: pc(c.fixTo), cls: 'fixed just' };
    if (c.later) return { html: '', cls: 'later' };
    if (c.faint) return { html: '', cls: 'later' };
    return { html: pc(c.tok), cls: c.justB ? 'just' : '' };
  }
  const attrs = c => (c.u !== undefined ? ` data-u="${c.u}"` : '') + (c.note !== undefined && c.note >= 0 ? ` data-note="${c.note}"` : '');
  function tagFor(c, V) {
    const live = c.tap && !V.solved && !V.revealed && !V.locked;
    return live ? ['button', ` type="button" data-act="cell" aria-label="${esc(A.name(c.tok))}"`] : ['div', ''];
  }

  /* ---------- a line: a train, number stones or plain cards ---------- */
  function lineScene(pz, V) {
    const sc = pz.scene, style = sc.style || 'train';
    const units = sc.unit && (V.vis.has('units') || V.lit) && !pz.noLight;
    const labels = V.vis.has('labels'), hops = V.vis.has('hops') || (V.lit && style === 'stones'), turns = V.vis.has('turns') || V.lit;
    const maxN = Math.max(...sc.rows.map(r => r.cells.length + (r.cells.some(c => c.far) ? 1 : 0)));
    let h = `<div class="ln ln-${style}${units ? ' show-units' : ''}${labels ? ' show-labels' : ''}${hops ? ' show-hops' : ''}${sc.positions ? ' show-pos' : ''}${sc.roomy ? ' roomy' : ''}" style="--n:${maxN};--rows:${sc.rows.length}">`;
    sc.rows.forEach(row => {
      h += '<div class="ln-row">' + (row.label ? `<div class="ln-label">${esc(row.label)}</div>` : '') + '<div class="ln-track">';
      if (style === 'train') h += A.engine();
      const cells = row.build ? row.cells.map((c, i) => V.built[i]
        ? Object.assign({}, c, { tok: V.built[i], empty: false, justB: i === V.built.length - 1 && V.justBuilt })
        : Object.assign({}, c, { empty: true, now: i === V.built.length })) : row.cells;
      const L = sc.unit;
      cells.forEach((c, i) => {
        const cc = content(c, V, pz), [tag, act] = tagFor(c, V);
        let cls = `car ${cc.cls}`;
        if (units && c.u !== undefined && L) { if (i % L === 0) cls += ' ustart'; if (i % L === L - 1 || i === cells.length - 1 || (cells[i + 1] && cells[i + 1].far)) cls += ' uend'; }
        if (V.marks[c.id]) cls += ' ' + V.marks[c.id];
        if (c.dim && !done(V)) cls += ' dim';
        if (c.far) { cls += ' far'; h += '<span class="far-gap" aria-hidden="true">…</span>'; }
        const extra = (labels && c.letter ? `<span class="lbl">${c.letter}</span>` : '') +
          (hops && c.hop ? `<span class="hop">${esc(c.hop)}</span>` : '') +
          (turns && c.turnHint ? `<span class="hop turn">${c.turnHint > 0 ? '↻' : '↺'}</span>` : '') +
          (c.pos ? `<span class="pos">${c.pos}</span>` : '') +
          (units && c.u !== undefined && L ? '<span class="ubar"></span>' : '');
        h += `<${tag} class="${cls}" data-id="${c.id}"${attrs(c)}${act}><span class="box">${cc.html}</span>${extra}</${tag}>`;
      });
      h += '</div></div>';
    });
    if (sc.rule) h += `<div class="rule-card">Rule: ${esc(sc.rule)}</div>`;
    return h + '</div>';
  }

  /* ---------- a necklace ---------- */
  function circleScene(pz, V) {
    const sc = pz.scene, cells = sc.cells, n = sc.ghostRest || cells.length, R = 40;
    const units = sc.unit && (V.vis.has('units') || V.lit) && !pz.noLight;
    const step = 360 / n, size = Math.min(18, 232 / n);
    const pt = (a, r = R) => [50 + r * Math.cos(a * Math.PI / 180), 50 + r * Math.sin(a * Math.PI / 180)];
    let svg = `<svg class="ring-svg" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="${R}" class="cord"/>`;
    if (units) {
      const L = sc.unit;
      for (let u = 0; u * L < cells.length; u++) {
        const a0 = -90 + u * L * step + 1.5, a1 = -90 + Math.min(cells.length, (u + 1) * L) * step - 1.5;
        const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
        svg += `<path class="uarc" data-u="${u}" d="M${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}" stroke-width="${(size * 1.15).toFixed(2)}"/>`;
      }
    }
    svg += `<circle cx="50" cy="${50 - R}" r="2.2" class="clasp"/>`;
    if (sc.join && V.lit) svg += sc.joinBad
      ? `<g class="join bad"><circle cx="50" cy="${50 - R - 6}" r="3.6"/><path d="M48.4 ${50 - R - 7.6}l3.2 3.2M51.6 ${50 - R - 7.6}l-3.2 3.2"/></g>`
      : `<g class="join"><circle cx="50" cy="${50 - R - 6}" r="3.6"/><path d="M48.2 ${50 - R - 6}l1.3 1.3 2.4-2.6"/></g>`;
    svg += '</svg>';
    let beads = '';
    for (let i = 0; i < n; i++) {
      const a = -90 + (i + 0.5) * step, [x, y] = pt(a);
      const pos = `left:${x.toFixed(2)}%;top:${y.toFixed(2)}%;width:${size.toFixed(2)}%;height:${size.toFixed(2)}%`;
      if (i >= cells.length) { beads += `<div class="bead later" style="${pos}"></div>`; continue; }
      const c = cells[i], cc = content(c, V, pz), [tag, act] = tagFor(c, V);
      let cls = `bead ${cc.cls}`;
      if (V.marks[c.id]) cls += ' ' + V.marks[c.id];
      beads += `<${tag} class="${cls}" style="${pos}" data-id="${c.id}"${attrs(c)}${act}><span class="box" style="transform:rotate(${a.toFixed(1)}deg)">${cc.html}</span></${tag}>`;
    }
    return `<div class="ring-wrap"><div class="ring">${svg}${beads}</div></div>`;
  }

  /* ---------- a grid: garden tiles, the hundred square, shape grids ---------- */
  function gridScene(pz, V) {
    const sc = pz.scene, w = sc.w, h = sc.h;
    const focus = sc.cells.find(c => c.q || c.gap) || {};
    const fr = focus.r !== undefined ? focus.r : (focus.id ? Math.floor(+focus.id.slice(1) / w) : -1);
    const fc = focus.c !== undefined ? focus.c : (focus.id ? +focus.id.slice(1) % w : -1);
    let cells = '';
    sc.cells.forEach((c, i) => {
      const r = c.r !== undefined ? c.r : Math.floor(i / w), col = c.c !== undefined ? c.c : i % w;
      const [tag, act0] = tagFor(c, V);
      let cls = 'cell', inner;
      if (sc.kind === 'num') {
        const right = (V.solved || V.revealed) && pz.rightIds && pz.rightIds.includes(c.id);
        cls += c.on || right ? ' on' : '';
        if (right) cls += ' just';
        inner = `<span class="nm">${c.num}</span>`;
      } else {
        const cc = content(c, V, pz); cls += ' ' + cc.cls; inner = cc.html;
      }
      if (V.vis.has('row') && r === fr) cls += ' hl';
      if (V.vis.has('col') && col === fc) cls += ' hl';
      if (V.marks[c.id]) cls += ' ' + V.marks[c.id];
      const act = tag === 'button' && sc.kind === 'num' ? ` type="button" data-act="cell" aria-label="${c.num}"` : act0;
      cells += `<${tag} class="${cls}" data-id="${c.id}"${attrs(c)}${act}>${inner}</${tag}>`;
    });
    let over = '';
    const motif = sc.unitBox && (V.vis.has('motif') || (V.lit && sc.kind === 'tile' && !pz.noLight) || (sc.corner && V.lit));
    if (motif) {
      const [mw, mh] = sc.unitBox;
      over = `<svg class="motif" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">`;
      for (let x = mw; x < w; x += mw) over += `<line x1="${x}" y1="0" x2="${x}" y2="${h}"/>`;
      for (let y = mh; y < h; y += mh) over += `<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`;
      over += '</svg>';
    }
    return `<div class="gridw gk-${sc.kind}" style="--w:${w};--h:${h}"><div class="grid">${cells}${over}</div></div>`;
  }

  /* ---------- growing blocks ---------- */
  function norm(blocks) {
    const mx = Math.min(...blocks.map(b => b[0])), my = Math.min(...blocks.map(b => b[1]));
    return blocks.map(b => [b[0] - mx, b[1] - my]);
  }
  function blocksSvg(blocks, col, opts = {}) {
    const nb = norm(blocks), cols = Math.max(...nb.map(b => b[0])) + 1, rows = Math.max(...nb.map(b => b[1])) + 1;
    const fresh = new Set((opts.fresh || []).map(b => b.join(',')));
    const dark = A.C[col] ? A.C[col][2] : '#7B5339';
    let s = `<svg class="blocks" viewBox="-1 -1 ${cols * 10 + 2} ${rows * 10 + 2}" style="width:calc(var(--u) * ${cols});height:calc(var(--u) * ${rows})" aria-hidden="true">`;
    nb.forEach((b, i) => {
      const x = b[0] * 10, y = (rows - 1 - b[1]) * 10, isNew = fresh.has(blocks[i].join(','));
      s += `<g class="blk${isNew ? ' nb' : ''}"><rect x="${x + 0.5}" y="${y + 0.5}" width="9" height="9" rx="1.8" fill="url(#pg-${col})" stroke="${dark}" stroke-width=".8"/>` +
        `<path d="M${x + 2} ${y + 7.5}V${y + 2}H${x + 7.5}" fill="none" stroke="#FFFFFF" stroke-opacity=".45" stroke-width=".9" stroke-linecap="round"/></g>`;
    });
    return s + '</svg>';
  }
  function figsScene(pz, V) {
    const sc = pz.scene, figs = sc.figs;
    const dims = figs.map(f => { const nb = norm(f.blocks); return [Math.max(...nb.map(b => b[0])) + 1, Math.max(...nb.map(b => b[1])) + 1]; });
    let maxRows = Math.max(...dims.map(d => d[1])), totalCols = dims.reduce((a, d) => a + d[0], 0);
    if (sc.build) { maxRows = Math.max(maxRows, sc.build.h); totalCols += sc.build.w; }
    const slots = figs.length + (sc.build ? 1 : 0) + (sc.more ? 1 : 0);
    const hShare = sc.table ? '36cqh' : '(78cqh - 34px)';
    let vars = `--uh:calc(${hShare} / ${maxRows});--uw:calc((94cqw - ${slots * 48}px) / ${Math.max(totalCols, 3)})`;
    if (sc.build) {
      // On a narrow screen the build grid moves under the steps, so size the blocks for two rows.
      const figCols = dims.reduce((a, d) => a + d[0], 0), figRows = Math.max(...dims.map(d => d[1]));
      vars += `;--uhn:calc((74cqh - 80px) / ${figRows + sc.build.h});--uwn:calc((94cqw - ${(slots - 1) * 48}px) / ${Math.max(figCols, sc.build.w, 3)})`;
    }
    const showNew = V.vis.has('add') || (V.lit && !sc.order);
    let h = `<div class="figs${sc.table ? ' has-table' : ''}${sc.build ? ' has-build' : ''}" style="${vars}"><div class="fig-row">`;
    figs.forEach((f, i) => {
      const id = f.id || `f${i}`;
      let fresh = [];
      if (showNew && i > 0 && !f.q) { const prev = new Set(figs[i - 1].blocks.map(b => b.join(','))); fresh = f.blocks.filter(b => !prev.has(b.join(','))); }
      if (showNew && f.q && done(V) && i > 0) { const prev = new Set(figs[i - 1].blocks.map(b => b.join(','))); fresh = f.blocks.filter(b => !prev.has(b.join(','))); }
      const live = f.tap && !V.solved && !V.revealed && !V.locked;
      const tag = live ? 'button' : 'div';
      let cls = 'fig' + (f.q ? ' q' : '') + (f.small ? ' small' : '') + (V.marks[id] ? ' ' + V.marks[id] : '');
      let inner;
      if (f.q && !done(V)) {
        const [cw, ch] = dims[i];
        inner = `<span class="fig-q" style="width:calc(var(--u) * ${Math.max(cw, 1.4)});height:calc(var(--u) * ${Math.max(ch, 1.4)})"><span class="qm">?</span></span>`;
      } else inner = blocksSvg(f.blocks, f.col || 'orange', { fresh });
      const order = V.order.indexOf(id);
      const badge = order >= 0 ? `<span class="order-n">${order + 1}</span>` : '';
      const count = V.vis.has('count') || (V.lit && !sc.order && sc.table === undefined) ? `<span class="fig-count">${f.blocks.length}</span>` : '';
      h += `<${tag} class="${cls}" data-id="${id}"${live ? ` type="button" data-act="cell" aria-label="Tower of ${f.blocks.length}"` : ''}>${inner}${badge}` +
        `${f.label ? `<span class="fig-label">${esc(f.label)}</span>` : ''}${count}</${tag}>`;
    });
    if (sc.more) h += `<div class="fig more"><span class="far-gap">…</span><span class="fig-q small-q"><span class="qm">?</span></span><span class="fig-label">Step ${sc.more}</span></div>`;
    if (sc.build) {
      const b = sc.build, want = new Set(pz.want || []);
      let cells = '';
      b.cells.forEach(c => {
        const on = V.sel.has(c.id) || (V.revealed && want.has(c.id));
        const ghost = !on && V.vis.has('ghost') && want.has(c.id);
        const live = !V.solved && !V.revealed && !V.locked;
        cells += `<${live ? 'button' : 'div'} class="bcell${on ? ' on' : ''}${ghost ? ' ghost' : ''}${V.marks[c.id] ? ' ' + V.marks[c.id] : ''}" data-id="${c.id}"${live ? ' type="button" data-act="cell" aria-label="Square"' : ''}>` +
          (on ? blocksSvg([[0, 0]], b.col).replace('class="blocks"', 'class="blocks one"') : '') + `</${live ? 'button' : 'div'}>`;
      });
      h += `<div class="fig build"><div class="bgrid" style="grid-template-columns:repeat(${b.w},var(--u));grid-template-rows:repeat(${b.h},var(--u))">${cells}</div><span class="fig-label">${esc(b.label)}</span></div>`;
    }
    h += '</div>';
    if (sc.table) h += tableHTML(sc.table, pz, V);
    return h + '</div>';
  }
  function tableHTML(t, pz, V) {
    const diffs = V.vis.has('diffs') || V.lit;
    const ans = pz.opts && pz.opts.find(o => o.right);
    let top = `<tr><th>${esc(t.head[0])}</th>`, bot = `<tr><th>${esc(t.head[1])}</th>`, mid = '<tr class="diffs"><th></th>';
    t.cols.forEach((c, i) => {
      if (t.gapBefore && i === t.cols.length - 1) { top += '<td class="far-gap">…</td>'; bot += '<td class="far-gap">…</td>'; mid += '<td></td>'; }
      const isQ = i === t.ask;
      const v = c[1] == null || isQ ? (done(V) && ans ? A.numText(ans.tok.v) : '?') : c[1];
      top += `<td>${c[0]}</td>`;
      bot += `<td class="${isQ ? 'q' + (done(V) ? ' just' : '') : ''}">${v}</td>`;
      const prev = t.cols[i - 1];
      mid += `<td>${i > 0 && !(t.gapBefore && i === t.cols.length - 1) && prev[1] != null && c[1] != null ? '+' + (c[1] - prev[1]) : ''}</td>`;
    });
    return `<table class="gtable"><tbody>${top}</tr>${diffs ? mid + '</tr>' : ''}${bot}</tr></tbody></table>`;
  }

  /* ---------- the pattern machine ---------- */
  function machineScene(pz, V) {
    const sc = pz.scene, ans = pz.opts && pz.opts.find(o => o.right);
    const num = (v, ask, id) => {
      if (ask && !done(V)) return `<span class="mnum q" data-id="${id}"><span class="qm">?</span></span>`;
      const val = ask && ans && ans.tok ? ans.tok.v : v;
      return `<span class="mnum${ask ? ' just' : ''}" data-id="${id}">${A.svg({ theme: 'num', v: val }, 'pc')}</span>`;
    };
    let ins = '', outs = '';
    sc.rows.forEach((r, i) => { ins += num(r.inp, r.ask === 'in', `in${i}`); outs += num(r.out, r.ask === 'out', `out${i}`); });
    const ruleText = sc.rule === '?' ? (done(V) && ans ? ans.text : '?') : sc.rule;
    const gear = '<svg class="gear" viewBox="-30 -30 60 60" aria-hidden="true">' + A.worldIcon(5, '#EDEAF7', '#8E82C9') + '</svg>';
    return `<div class="mach${sc.two ? ' two' : ''}"><div class="mcol"><span class="mhead">In</span>${ins}</div>` +
      `<div class="marrow" aria-hidden="true"></div><div class="mbox">${gear}<span class="mrule${sc.rule === '?' ? ' q' : ''}${sc.rule === '?' && done(V) ? ' just' : ''}" data-id="rule">${esc(ruleText)}</span></div>` +
      `<div class="marrow" aria-hidden="true"></div><div class="mcol"><span class="mhead">Out</span>${outs}</div></div>`;
  }

  /* ---------- "this changes into this" ---------- */
  function analogyScene(pz, V) {
    const sc = pz.scene, ans = pz.opts.find(o => o.right);
    const card = (t, id, q) => `<span class="acard${q ? ' q' : ''}${q && done(V) ? ' just' : ''}" data-id="${id}">${q && !done(V) ? '<span class="qm">?</span>' : pc(q ? ans.tok : t)}</span>`;
    const arrow = '<span class="aarrow" aria-hidden="true"></span>';
    return `<div class="anal"><div class="apair">${card(sc.a, 'a')}${arrow}${card(sc.b, 'b')}</div><div class="asep" aria-hidden="true"></div>` +
      `<div class="apair">${card(sc.c, 'c')}${arrow}${card(null, 'd', true)}</div></div>`;
  }

  /* ---------- mirrors ---------- */
  function picSvg(p, cls = 'pic') {
    const on = new Set((p.on || []).map(([x, y]) => `${x},${y}`)), dark = A.C[p.col] ? A.C[p.col][2] : '#555';
    let s = `<svg class="${cls}" viewBox="-0.1 -0.1 ${p.w + 0.2} ${p.h + 0.2}" aria-hidden="true"><rect x="0" y="0" width="${p.w}" height="${p.h}" rx=".25" fill="#FFFFFF"/>`;
    for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) {
      const k = `${x},${y}`;
      s += on.has(k) ? `<rect x="${x + 0.06}" y="${y + 0.06}" width=".88" height=".88" rx=".14" fill="url(#pg-${p.col})" stroke="${dark}" stroke-width=".05"/>`
        : `<rect x="${x + 0.06}" y="${y + 0.06}" width=".88" height=".88" rx=".14" fill="#F3EFE7"/>`;
    }
    if (p.line === 'v' || p.line === 'both') s += `<line x1="${p.w / 2}" y1="-0.05" x2="${p.w / 2}" y2="${p.h + 0.05}" class="mline"/>`;
    if (p.line === 'h' || p.line === 'both') s += `<line x1="-0.05" y1="${p.h / 2}" x2="${p.w + 0.05}" y2="${p.h / 2}" class="mline"/>`;
    if (p.line === 'none') s += `<path d="M${p.w * 0.3} ${p.h * 0.3}L${p.w * 0.7} ${p.h * 0.7}M${p.w * 0.7} ${p.h * 0.3}L${p.w * 0.3} ${p.h * 0.7}" class="mnone"/>`;
    return s + '</svg>';
  }
  function mirrorScene(pz, V) {
    const sc = pz.scene;
    if (sc.build) {
      const want = new Set(pz.want), half = sc.w / 2;
      let cells = '';
      sc.cells.forEach(c => {
        const on = c.on || V.sel.has(c.id) || (V.revealed && want.has(c.id));
        const ghost = !on && V.vis.has('ghost') && want.has(c.id);
        const live = c.tap && !V.solved && !V.revealed && !V.locked;
        const tag = live ? 'button' : 'div';
        cells += `<${tag} class="mcell${on ? ' on' : ''}${c.on ? ' given' : ''}${ghost ? ' ghost' : ''}${c.tap ? ' open' : ''}${V.marks[c.id] ? ' ' + V.marks[c.id] : ''}" data-id="${c.id}"${live ? ' type="button" data-act="cell" aria-label="Square"' : ''}></${tag}>`;
      });
      const lines = (sc.axis === 'v' || sc.axis === 'both' ? `<span class="mline-v" style="left:50%"></span>` : '') + (sc.axis === 'h' || sc.axis === 'both' ? `<span class="mline-h" style="top:50%"></span>` : '');
      return `<div class="gridw gk-mirror" style="--w:${sc.w};--h:${sc.h};--mc:${A.C[sc.col][1]};--md:${A.C[sc.col][2]}"><div class="grid">${cells}${lines}</div></div>`;
    }
    if (sc.side) {
      const ans = pz.opts.find(o => o.right);
      const right = done(V) ? picSvg(ans.pic, 'pic big just') : `<span class="pic-q"><span class="qm">?</span></span>`;
      return `<div class="mside${sc.axis === 'h' ? ' vertical' : ''}">${picSvg({ w: sc.w, h: sc.h, on: sc.on, col: sc.col }, 'pic big')}<span class="pond" aria-hidden="true"></span>${right}</div>`;
    }
    const ans = pz.opts.find(o => o.right);
    return `<div class="mside single">${picSvg({ w: sc.w, h: sc.h, on: sc.on, col: sc.col, line: done(V) && ans ? ans.line : null }, 'pic big')}</div>`;
  }

  /* ---------- the answer buttons ---------- */
  function mini(toks) { return `<span class="mini">${toks.map(t => `<span class="mc">${pc(t)}</span>`).join('')}</span>`; }
  function option(o) {
    if (o.tok) return pc(o.tok);
    if (o.mini) return mini(o.mini);
    if (o.row) return `<span class="mini tiles">${o.row.map(t => `<span class="mc">${pc(t)}</span>`).join('')}</span>`;
    if (o.block) return `<span class="mini quad">${o.block.map(t => `<span class="mc">${pc(t)}</span>`).join('')}</span>`;
    if (o.fig) {
      const nb = norm(o.fig), rows = Math.max(...nb.map(b => b[1])) + 1, cols = Math.max(...nb.map(b => b[0])) + 1;
      return `<span class="ofig" style="--u:min(clamp(12px, 3.4dvh, 30px), calc(var(--opt) * .8 / ${Math.max(rows, cols, 1)}))">${blocksSvg(o.fig, o.col || 'orange')}</span>`;
    }
    if (o.pic) return picSvg(o.pic) + (o.text && o.line ? `<span class="otext small">${esc(o.text)}</span>` : '');
    return `<span class="otext${o.letters ? ' letters' : ''}${o.card ? ' card' : ''}">${esc(o.text)}</span>`;
  }
  function optionKind(o) {
    if (o.tok) return 'tok';
    if (o.mini || o.row) return 'wide';
    if (o.block || o.fig || o.pic) return 'pic';
    return o.card ? 'card' : 'text';
  }

  function render(pz, V) {
    switch (pz.scene.type) {
      case 'line': return lineScene(pz, V);
      case 'circle': return circleScene(pz, V);
      case 'grid': return gridScene(pz, V);
      case 'figs': return figsScene(pz, V);
      case 'machine': return machineScene(pz, V);
      case 'analogy': return analogyScene(pz, V);
      case 'mirror': return mirrorScene(pz, V);
      default: return '';
    }
  }

  window.PScenes = { render, option, optionKind, blocksSvg, picSvg, mini };
})();
