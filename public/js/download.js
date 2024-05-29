const $ = document.querySelector.bind(document),
  $$ = document.querySelectorAll.bind(document),
  alertElement = $('div[role="alert"]'),
  alertContent = $(".alert-content"),
  inputUrl = $("#input-url"),
  btnPasteClipboard = $(".btn-paste-clipboard"),
  btnGetLinkDownload = $(".btn-get-link-download"),
  loadingElement = $(".loading"),
  tbody = $("tbody"),
  table = $("table"),
  thead = $("thead");
btnGetLinkDownload.onclick = async () => {
  if (
    (tb.hide(),
    alert.hide(),
    loading.show(),
    !isValidURL(inputUrl.value.trim()))
  ) {
    loading.hide(), alert.show("please paste valid facebook video url!");
    return;
  }
  let e = await (
    await fetch("/get-public-facebook-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ video_url: inputUrl.value.trim() }),
    })
  ).json();
  if (e.error) {
    alert.show(e.error), loading.hide();
    return;
  }
  if (e.msg) {
    alert.show(e.msg), loading.hide();
    return;
  }
  if (e.private) {
    alert.show(
      'Video n\xe0y ở chế độ ri\xeang tư, vui l\xf2ng sử dụng <a class="text-secondary" href="/facebook-private-video-downloader">c\xf4ng cụ tải video facebook ri\xeang tư</a>.'
    ),
      loading.hide();
    return;
  }
  if (!e || Object.keys(e).length <= 0) {
    alert.show("Error, Failed to get download link!"), loading.hide();
    return;
  }
  (tbody.innerHTML = Object.keys(e)
    .map((t, n) =>
      "fullhd" == t || "audio" == t
        ? ""
        : `<tr><th>${n + 1}</th><td>${e[t].quality}</td><td>${
            e[t].render
          }</td><td><a class="btn btn-primary py-0 btn-sm rounded rounded-0 text-white" href="${
            e[t].url
          }" download="${e[t].url}">Download</a></td></tr>`
    )
    .join("")),
    tb.show(),
    loading.hide(),
    inputUrl.scrollIntoView();
};
const tb = {
  show: function () {
    (table.hidden = null), (thead.hidden = null);
  },
  hide: function () {
    (table.hidden = "true"), (thead.hidden = "true"), (tbody.innerHTML = null);
  },
};
btnPasteClipboard.addEventListener("click", (e) => {
  navigator.clipboard
    ? navigator.clipboard
        .readText()
        .then((e) => {
          (inputUrl.value = e), alert.hide();
        })
        .catch((e) => {
          alert.show("Vui cấp quyền truy cập clipboard cho trang web!");
        })
    : alert.show("Tr\xecnh duyệt kh\xf4ng được hỗ trợ!");
});
const alert = {
    show: function (e = "unknown error!") {
      (alertElement.hidden = null), (alertContent.innerHTML = e);
    },
    hide: function () {
      alertElement.hidden = "true";
    },
  },
  isValidURL = (e) => {
    if (!/^(https?:\/\/)?(www\.)?([\w-]+\.)+[\w]{2,}(\/\S*)?$/.test(e))
      return !1;
    e = e.trim().replace(/\/+$/, "");
    let t = ["fb.com", "facebook.com", "fb.watch"],
      n = new URL(e).hostname;
    return t.some((e) => n.includes(e));
  },
  loading = {
    show: function () {
      (btnGetLinkDownload.disabled = "true"),
        (btnPasteClipboard.disabled = "true"),
        (inputUrl.disabled = "true"),
        (loadingElement.hidden = null);
    },
    hide: function () {
      (btnGetLinkDownload.disabled = null),
        (btnPasteClipboard.disabled = null),
        (inputUrl.disabled = null),
        (loadingElement.hidden = "true");
    },
  };


// (document.onkeydown = (e) => {
//   code = e.keyCode;
//   let t = $('[note="' + (type = e.shiftKey ? "b" : "a") + code + '"]');
//   try {
//     t.classList.add("note-active"),
//       setTimeout(() => {
//         t.classList.remove("note-active");
//       }, 100),
//       playNote(code, e.shiftKey);
//   } catch (n) {
//     console.clear();
//   }
// }),
//   document.addEventListener(
//     "contextmenu",
//     function (e) {
//       e.preventDefault();
//     },
//     !1
//   ),
//   (function e() {
//     try {
//       !(function e(t) {
//         (1 !== ("" + t / t).length || t % 20 == 0) &&
//           function () {}.constructor("debugger")(),
//           e(++t);
//       })(0);
//     } catch (t) {
//       setTimeout(e, 5e3);
//     }
//   })(); //sito/wp-includes/wlwmanifest.xml
