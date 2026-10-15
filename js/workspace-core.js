/* FitPlan Studio — phần dùng chung cho 4 workspace (CRUD, bảng quản lý). Cần common.js */
const ST = {
  pending: ['wa', 'Đang chờ'],
  rejected: ['er', 'Bị từ chối'],
  completed: ['ok', 'Hoàn thành'],
  archived: ['gr', 'Đã huỷ'],
};
const DEF = {
    chal: { part: 0, arch: false },
    ex: { arch: false },
    users: { arch: false },
  },
  FS = {};
function mgr(k, t, fs, cols, o = {}) {
  FS[k] = fs;
  const e = ed[k] != null ? D[k].find((x) => x.id == ed[k]) : null,
    r = D[k];
  return (
    `<form class=card data-f=${k}><h3>${e ? 'Sửa' : 'Thêm'}
${t}</h3>${fs.map((f) => fld(f, e ? e[f.n] : f.d, er[k] && er[k][f.n])).join('')}<button class="btn pr">${e ? 'Lưu' : 'Thêm'}</button> 
${e ? bt('Huỷ', 'cancel', '', 'gh', k) : ''}</form>` +
    (r.length
      ? `<div class=wrap><table><tr>${cols.map((c) => `<th>${c[0]}`).join('')}<th></tr>${r
          .map(
            (
              x,
            ) => `<tr>${cols.map((c) => `<td>${c[1](x)}`).join('')}<td>${bt('Sửa', 'edit', x.id, '', k)} 
${o.arch ? bt(x.arch ? 'Khôi phục' : 'Lưu trữ', 'arch', x.id, 'gh', k) : bt('Xoá', 'del', x.id, 'er', k)}</tr>`,
          )
          .join('')}</table></div>`
      : bx(o.empty))
  );
}
const stb = (x) => bd(x.arch ? 'gr' : 'ok', x.arch ? 'Lưu trữ' : 'Hoạt động');
const gen = (d, k) => {
  const fs = FS[k],
    e = chk(fs, d);
  er[k] = e;
  if (Object.keys(e).length) return draw();
  fs.forEach((x) => {
    if (x.t == 'number') d[x.n] = +d[x.n];
  });
  if (ed[k] != null)
    Object.assign(
      D[k].find((x) => x.id == ed[k]),
      d,
    );
  else D[k].push({ id: ++nid, ...(DEF[k] || {}), ...d });
  ed[k] = null;
  toast('Đã lưu');
  draw();
};

Object.assign(A, {
  edit: (i, k) => {
    ed[k] = i;
    er[k] = {};
    draw();
  },
  cancel: (i, k) => {
    ed[k] = null;
    er[k] = {};
    draw();
  },
  del: (i, k) => {
    D[k] = D[k].filter((x) => x.id != i);
    if (ed[k] == i) ed[k] = null;
    draw();
  },
  arch: (i, k) => {
    const x = D[k].find((x) => x.id == i);
    x.arch = !x.arch;
    draw();
  },
});
F._g = gen;
