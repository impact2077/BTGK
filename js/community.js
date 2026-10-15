/* Vai trò: Điều phối cộng đồng (community) — Challenge, Leaderboard, Nội dung */
Object.assign(VIEW, {
  chal: () =>
    h('Challenge', 'Tổng quan và quản lý thử thách') +
    `<div class=grid>${stat(D.chal.filter((x) => !x.arch).length, 'Đang chạy')}
        ${stat(
          D.chal.reduce((a, x) => a + x.part, 0),
          'Lượt tham gia',
        )}
        ${stat(D.chal.filter((x) => x.arch).length, 'Đã lưu trữ')}
        </div>` +
    mgr(
      'chal',
      'challenge',
      [
        {
          n: 'name',
          l: 'Tên challenge',
          req: 1,
        },
        { n: 'period', l: 'Thời gian', req: 1 },
      ],
      [
        ['Challenge', (x) => x.name],
        ['Thời gian', (x) => x.period],
        ['Tham gia', (x) => x.part],
        ['Trạng thái', (x) => bd(x.arch ? 'gr' : 'ok', x.arch ? 'Lưu trữ' : 'Đang chạy')],
      ],
      { arch: 1, empty: 'Chưa có challenge nào.' },
    ),
  board: () =>
    h('Bảng xếp hạng', 'Theo dõi và điều chỉnh') +
    `<div class=wrap><table><tr><th>#<th>Thành viên<th>Điểm<th>Trạng thái<th></tr>${[...D.board]
      .sort((a, b) => b.score - a.score)
      .map(
        (x, i) => `<tr><td>${i + 1}<td>${x.name}<td><input id=sc${x.id}
         type=number value=${x.score} 
         style=width:80px><td>${bd(x.hide ? 'gr' : 'ok', x.hide ? 'Đã ẩn' : 'Hợp lệ')}<td>${bt('Lưu điểm', 'sc', x.id)} 
         ${bt(x.hide ? 'Hiện' : 'Ẩn', 'hd', x.id, 'gh')}</tr>`,
      )
      .join('')}</table></div>`,
  cnt: () =>
    h('Nội dung wellness', 'Bài viết sức khỏe') +
    mgr(
      'cnt',
      'bài viết',
      [
        { n: 'title', l: 'Tiêu đề', req: 1 },
        { n: 'body', l: 'Nội dung', t: 'area', req: 1 },
      ],
      [
        ['Tiêu đề', (x) => x.title],
        ['Nội dung', (x) => x.body.slice(0, 50)],
      ],
      { empty: 'Chưa có bài viết nào.' },
    ),
});

Object.assign(A, {
  sc: (i) => {
    D.board.find((x) => x.id == i).score = +$('#sc' + i).value;
    toast('Đã lưu điểm');
    draw();
  },
  hd: (i) => {
    const x = D.board.find((x) => x.id == i);
    x.hide = x.hide ? 0 : 1;
    draw();
  },
});
