/* FitPlan Studio — lõi dùng chung cho mọi trang */
const $ = (s) => document.querySelector(s),
  dt = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  };
const esc = (s) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const mailOK = (v) => /^\S+@\S+\.\S+$/.test(v);

/* ---------- lưu trữ ---------- */
const ls = {
  get(k, f) {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : f;
    } catch (e) {
      return f;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  },
  del(k) {
    try {
      localStorage.removeItem(k);
    } catch (e) {}
  },
};
const K = { st: 'fp_state', us: 'fp_user', se: 'fp_settings', tt: 'fp_flash' };

/* ---------- hằng số ---------- */
const ROOT = new URL('../', document.currentScript.src).href;
const RL = {
  member: 'Người tập',
  coach: 'Huấn luyện viên',
  community: 'Điều phối cộng đồng',
  admin: 'Quản trị viên',
};
const NAV = {
  member: [
    ['dash', 'Dashboard', 'member/dashboard.html'],
    ['plan', 'Kế hoạch', 'member/plan.html'],
    ['log', 'Nhật ký', 'member/log.html'],
  ],
  coach: [
    ['members', 'Học viên', 'coach/members.html'],
    ['review', 'Duyệt kế hoạch', 'coach/review.html'],
    ['tpl', 'Template', 'coach/templates.html'],
  ],
  community: [
    ['chal', 'Challenge', 'community/challenges.html'],
    ['board', 'Leaderboard', 'community/leaderboard.html'],
    ['cnt', 'Nội dung', 'community/content.html'],
  ],
  admin: [
    ['ex', 'Bài tập', 'admin/exercises.html'],
    ['users', 'Người dùng', 'admin/users.html'],
    ['stats', 'Analytics', 'admin/analytics.html'],
  ],
};
const ROUTE = Object.fromEntries(
  Object.entries({
    index: 'index.html',
    login: 'login.html',
    register: 'register.html',
    forgot: 'forgot-password.html',
    profile: 'profile.html',
    settings: 'settings.html',
    notifications: 'notifications.html',
    403: '403.html',
    404: '404.html',
  }).map(([k, v]) => [k, ROOT + v]),
);
const PATH = {};
Object.values(NAV)
  .flat()
  .forEach((n) => (PATH[n[0]] = ROOT + n[2]));

/* ---------- dữ liệu demo ---------- */
let D = {
  users: [
    { id: 1, name: 'Nguyễn Văn An', email: 'an@mail.com', role: 'Người tập', arch: false },
    { id: 2, name: 'Coach Hùng', email: 'hung@mail.com', role: 'Huấn luyện viên', arch: false },
    {
      id: 3,
      name: 'Lan Điều Phối',
      email: 'lan@mail.com',
      role: 'Điều phối cộng đồng',
      arch: false,
    },
    { id: 4, name: 'Admin', email: 'admin@mail.com', role: 'Quản trị viên', arch: false },
  ],
  mem: [
    { id: 1, name: 'Nguyễn Văn An', goal: 'Giảm cân', n: 4 },
    { id: 2, name: 'Trần Thị Bình', goal: 'Tăng cơ', n: 5 },
    { id: 3, name: 'Lê Minh Cường', goal: 'Duy trì', n: 3 },
    { id: 4, name: 'Phạm Thu Hà', goal: 'Tăng cơ', n: 4 },
  ],
  ml: { 1: [1, 1, 1, 1, 0], 2: [0, 0, 0, 1], 3: [1, 1], 4: [1, 0, 1, 0] },
  log: [
    { id: 1, d: dt(0), ex: 'Squat 3x12', ok: 'Xong' },
    { id: 2, d: dt(1), ex: 'Plank 3x30s', ok: 'Xong' },
    { id: 3, d: dt(2), ex: 'Chạy 20 phút', ok: 'Xong' },
    { id: 4, d: dt(5), ex: 'Chạy 20 phút', ok: 'Bỏ dở' },
  ],
  plans: [
    {
      id: 1,
      m: 'Nguyễn Văn An',
      t: 'Kế hoạch giảm cân — Tuần 3',
      it: ['Squat — 3 hiệp x 12', 'Plank — 3 hiệp x 30 giây', 'Chạy bộ — 20 phút'],
      st: 'pending',
    },
    {
      id: 2,
      m: 'Trần Thị Bình',
      t: 'Kế hoạch tăng cơ — Tuần 2',
      it: ['Đẩy tạ ngực — 4 hiệp x 8', 'Kéo xà — 3 hiệp x 10'],
      st: 'rejected',
    },
    {
      id: 3,
      m: 'Lê Minh Cường',
      t: 'Kế hoạch duy trì — Tuần 1',
      it: ['Chạy bộ — 30 phút', 'Giãn cơ — 10 phút'],
      st: 'completed',
    },
    {
      id: 4,
      m: 'Phạm Thu Hà',
      t: 'Kế hoạch tăng cơ — Tuần 4',
      it: ['Deadlift — 4 hiệp x 6', 'Plank — 3 hiệp x 45 giây'],
      st: 'archived',
    },
  ],
  tpl: [
    { id: 1, name: 'Squat', group: 'Chân', sets: 3, reps: 12 },
    { id: 2, name: 'Plank', group: 'Bụng', sets: 3, reps: 30 },
    { id: 3, name: 'Chạy bộ', group: 'Cardio', sets: 1, reps: 20 },
    { id: 4, name: 'Đẩy tạ ngực', group: 'Ngực', sets: 4, reps: 8 },
    { id: 5, name: 'Kéo xà', group: 'Lưng', sets: 3, reps: 10 },
  ],
  chal: [
    { id: 1, name: '30 ngày plank', period: '01–30/10', part: 54, arch: false },
    { id: 2, name: '10K bước mỗi ngày', period: 'Tuần này', part: 41, arch: false },
    { id: 3, name: 'Thử thách hè', period: 'Tháng 8', part: 33, arch: true },
  ],
  board: [
    { id: 1, name: 'Nguyễn Văn An', score: 980, hide: 0 },
    { id: 2, name: 'Trần Thị Bình', score: 910, hide: 0 },
    { id: 3, name: 'Lê Minh Cường', score: 905, hide: 0 },
  ],
  cnt: [
    {
      id: 1,
      title: '5 cách giữ thói quen tập',
      body: 'Đặt lịch cố định, bắt đầu nhỏ, ghi log mỗi buổi.',
    },
    {
      id: 2,
      title: 'Ngủ đủ giấc để tăng cơ',
      body: 'Cơ phục hồi tốt nhất khi ngủ 7–8 tiếng mỗi đêm.',
    },
  ],
  ex: [
    { id: 1, name: 'Squat', group: 'Chân', lvl: 'Cơ bản', arch: false },
    { id: 2, name: 'Plank', group: 'Bụng', lvl: 'Cơ bản', arch: false },
    { id: 3, name: 'Burpee', group: 'Toàn thân', lvl: 'Nâng cao', arch: true },
  ],
  notif: {
    member: [
      {
        id: 1,
        t: 'Kế hoạch đã được duyệt',
        b: 'Huấn luyện viên đã chấp nhận kế hoạch Tuần 3 của bạn.',
        d: dt(0),
        read: false,
      },
      {
        id: 2,
        t: 'Nhắc tập hôm nay',
        b: 'Bạn chưa ghi log hôm nay. Giữ streak nhé!',
        d: dt(0),
        read: false,
      },
      { id: 3, t: 'Challenge mới', b: '"30 ngày plank" đang mở đăng ký.', d: dt(3), read: true },
    ],
    coach: [
      {
        id: 1,
        t: 'Kế hoạch mới chờ duyệt',
        b: 'Nguyễn Văn An vừa gửi kế hoạch giảm cân Tuần 3.',
        d: dt(0),
        read: false,
      },
      {
        id: 2,
        t: 'Học viên bỏ buổi tập',
        b: 'Trần Thị Bình chưa ghi log 3 ngày liên tiếp.',
        d: dt(1),
        read: false,
      },
    ],
    community: [
      {
        id: 1,
        t: 'Challenge sắp kết thúc',
        b: '"30 ngày plank" kết thúc trong 3 ngày nữa.',
        d: dt(0),
        read: false,
      },
      {
        id: 2,
        t: 'Điểm bất thường',
        b: 'Có 1 thành viên tăng điểm đột biến trên bảng xếp hạng.',
        d: dt(2),
        read: true,
      },
    ],
    admin: [
      {
        id: 1,
        t: 'Người dùng mới',
        b: 'Có tài khoản mới đăng ký trong 24 giờ qua.',
        d: dt(0),
        read: false,
      },
      {
        id: 2,
        t: 'Sao lưu hoàn tất',
        b: 'Bản sao lưu dữ liệu hằng ngày đã chạy thành công.',
        d: dt(1),
        read: true,
      },
    ],
  },
};
let M = { goal: '', n: 0, plan: null },
  nid = 100;
const sv = ls.get(K.st);
if (sv && sv.D && sv.D.notif) {
  D = sv.D;
  M = sv.M;
  nid = sv.nid;
}
const save = () => ls.set(K.st, { D, M, nid });

/* ---------- phiên & cài đặt ---------- */
let U = ls.get(K.us, null);
const SET = Object.assign(
  { theme: 'auto', email: true, remind: true, community: false, fail: false },
  ls.get(K.se, {}),
);
const applyTheme = () =>
  SET.theme == 'auto'
    ? document.documentElement.removeAttribute('data-theme')
    : document.documentElement.setAttribute('data-theme', SET.theme);
applyTheme();
const home = () => ROOT + NAV[U.role][0][2];
const unread = () => (U ? (D.notif[U.role] || []).filter((n) => !n.read).length : 0);

/* ---------- trạng thái giao diện ---------- */
let PAGE = '',
  S = '',
  WS = false,
  q = '',
  ed = {},
  er = {},
  ai = {},
  mod = null,
  rev = {},
  bz = false,
  tk = 0;
const VIEW = {},
  F = {},
  A = {};

/* ---------- helper dựng HTML ---------- */
const h = (t, s) => `<div class=top><h1>${t}</h1><p>${s}</p></div>`,
  bd = (c, t) => `<span class="b ${c}">${t}</span>`,
  bx = (m, x = '') => `<div class=sb>${m}${x}</div>`;
const bt = (t, a, i = '', c = '', k = '') =>
  `<button type=button class="btn ${c}" data-a="${a}" data-i="${i}" data-k="${k}">${t}</button>`;
const card = (t, b) => `<div class=card><h3>${t}</h3>${b}</div>`,
  stat = (n, l) => `<div class=stat><b>${n}</b><span>${l}</span></div>`;
const fld = (f, v, e) =>
  `<label>${f.l}${f.t == 'select' ? `<select name=${f.n}>${f.o.map((o) => `<option value="${esc(o)}" ${o == v ? 'selected' : ''}>${esc(o) || '— Chọn —'}</option>`).join('')}</select>` : f.t == 'area' ? `<textarea name=${f.n} rows=3>${esc(v)}</textarea>` : `<input name=${f.n} type=${f.t || 'text'} value="${esc(v)}">`}${e ? `<span class=err>${e}</span>` : ''}</label>`;
const chk = (fs, d) => {
  const e = {};
  fs.forEach((x) => {
    const v = (d[x.n] || '').toString().trim();
    if (x.req && !v) e[x.n] = x.l + ' không được để trống.';
    else if (x.min && !(+v >= x.min)) e[x.n] = x.l + ' phải là số dương.';
  });
  return e;
};

/* ---------- layout chung ---------- */
const head = () => {
  const on = (p) => (PAGE == p ? 'on' : ''),
    n = unread();
  return `<header><a class=logo href="${ROOT}index.html">FitPlan Studio</a><nav>${
    U
      ? NAV[U.role]
          .map(
            (x) => `<a class="tab ${x[0] == PAGE ? 'on' : ''}" href="${ROOT + x[2]}">${x[1]}</a>`,
          )
          .join('') +
        `<a class="tab ${on('notifications')}" href="${ROOT}notifications.html">Thông báo${n ? ` <span class=dot>${n}</span>` : ''}</a>` +
        `<a class="tab ${on('profile')}" href="${ROOT}profile.html" title="${RL[U.role]}">${esc(U.name)}</a>` +
        `<a class="tab ${on('settings')}" href="${ROOT}settings.html">Cài đặt</a>` +
        bt('Đăng xuất', 'out', '', 'gh')
      : `<a class="btn gh" href="${ROOT}login.html">Đăng nhập</a> <a class="btn pr" href="${ROOT}register.html">Đăng ký</a>`
  }</nav></header>`;
};
const foot = () =>
  `<footer>FitPlan Studio — BTL-29 · <a href="${ROOT}index.html">Trang chủ</a></footer>`;

function draw(l) {
  const t = ++tk;
  $('#app').innerHTML = head() + '<main id=v></main>' + foot();
  const m = $('#v'),
    fill = () => {
      if (t != tk) return;
      m.innerHTML =
        WS && SET.fail
          ? bx('Không thể tải dữ liệu. Vui lòng thử lại.', bt('Thử lại', 'r0'))
          : VIEW[S]() + (WS && mod ? modal() : '');
    };
  l && WS ? ((m.innerHTML = bx('Đang tải...')), setTimeout(fill, 300)) : fill();
  save();
}

let tm;
const toast = (m) => {
  const e = $('#tt');
  e.textContent = m;
  e.className = 'tt on';
  clearTimeout(tm);
  tm = setTimeout(() => (e.className = 'tt'), 1800);
};
const flash = (m) => ls.set(K.tt, m);

/* ---------- điều hướng ---------- */
function go(s) {
  if (s == 'home') return (location.href = U ? home() : ROUTE.login);
  const u = ROUTE[s] || PATH[s];
  if (u) location.href = u;
}
A.go = (i) => go(i);
A.out = () => {
  ls.del(K.us);
  U = null;
  flash('Đã đăng xuất');
  location.href = ROUTE.index;
};
A.r0 = () => draw(true);

/* ---------- khởi động trang ----------
 o.page   : khoá trang (trùng khoá trong NAV với trang vai trò)
 o.access : 'public' | 'guest' (chỉ khách) | 'auth' (cần đăng nhập)
 o.role   : (tuỳ chọn) chỉ vai trò này được vào, sai vai trò -> 403.html
 o.view   : hàm trả HTML */
function boot(o) {
  PAGE = o.page;
  if (o.access == 'guest' && U) {
    location.replace(home());
    return;
  }
  if (o.access == 'auth' && !U) {
    location.replace(
      ROUTE.login + '?next=' + encodeURIComponent(location.href.replace(ROOT, '').split('#')[0]),
    );
    return;
  }
  if (o.role && U.role != o.role) {
    location.replace(ROUTE['403']);
    return;
  }
  Object.assign(F, o.forms || {});
  Object.assign(A, o.actions || {});
  WS = !!o.role;
  const f = ls.get(K.tt);
  if (f) {
    ls.del(K.tt);
    toast(f);
  }
  S = o.page;
  if (o.view) VIEW[S] = o.view;
  draw(WS);
}

/* ---------- sự kiện ---------- */
document.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target,
    k = f.dataset.f,
    fn = F[k] || F._g;
  if (fn) fn(Object.fromEntries(new FormData(f)), k);
});
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-a]');
  if (b && A[b.dataset.a]) A[b.dataset.a](b.dataset.i, b.dataset.k);
});
document.addEventListener('change', (e) => {
  const k = e.target.dataset.set;
  if (!k) return;
  SET[k] = e.target.type == 'checkbox' ? e.target.checked : e.target.value;
  ls.set(K.se, SET);
  applyTheme();
  toast('Đã lưu cài đặt');
});
