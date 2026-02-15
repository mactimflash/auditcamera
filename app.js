(function () {
  const statusEl = document.getElementById("status");
  const params = new URLSearchParams(location.search);
  const token = params.get("t");

  // Set your Worker base URL here:
  const WORKER_BASE = "https://auditcamera.starlinksatellitewifi.workers.dev";

  if (!token) {
    statusEl.innerHTML = `<div class="err">Thiếu token. Hãy quay lại Telegram và bấm nút kiểm tra.</div>`;
    return;
  }

  statusEl.textContent = "Đang gửi yêu cầu audit…";

  fetch(`${WORKER_BASE}/camcheck/submit?t=${encodeURIComponent(token)}`, {
    method: "POST",
  })
    .then(r => r.json().catch(() => ({})).then(j => ({ ok: r.ok, status: r.status, j })))
    .then(({ ok, status, j }) => {
      if (!ok || !j.ok) {
        statusEl.innerHTML = `<div class="err">Audit thất bại (${status}). ${j.err || ""}</div>`;
        return;
      }
      statusEl.innerHTML =
        `<div class="ok">
          ✅ Đã gửi kết quả về Telegram.<br/>
          Bạn có thể quay lại group để xem báo cáo.
        </div>`;
    })
    .catch(err => {
      statusEl.innerHTML = `<div class="err">Lỗi mạng: ${String(err)}</div>`;
    });
})();
