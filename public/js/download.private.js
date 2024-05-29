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
  thead = $("thead"),
  urlPageSource = $("#url-page-source"),
  inputPageSource = $("#input-page-source");
(inputUrl.oninput = () => {
  if (isValidURL(inputUrl.value)) {
    alert.hide();
    urlPageSource.value = "view-source:" + inputUrl.value;
  } else {
    alert.show("Vui l\xf2ng điền đ\xfang url video facebook");
    return;
  }
}),
  (inputUrl.onpaste = () => {
    if (isValidURL(inputUrl.value)) {
      alert.hide();
      urlPageSource.value = "view-source:" + inputUrl.value;
    } else {
      alert.show("Vui l\xf2ng điền đ\xfang url video facebook");
      return;
    }
  }),
  (urlPageSource.onfocus = () => {
	// urlPageSource.select();
	window.open(urlPageSource.value)
  
  }),
  (btnGetLinkDownload.onclick = async () => {
    let e = inputPageSource.value.trim();
    if ((tb.hide(), alert.hide(), loading.show(), !e || "" == e)) {
      loading.hide(), alert.show("Vui l\xf2ng d\xe1n nội dung copy!");
      return;
    }
    let t = await (
      await fetch("/get-private-facebook-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_source: (e = e
            .split("is_rss_podcast_video")[1]
            .split("sequence_number")[0]),
        }),
      })
    ).json();
    if (!t || Object.keys(t).length <= 0) {
      alert.show("Error, Failed to get download link!");
      return;
    }
    let n = 0;
    (tbody.innerHTML = Object.keys(t)
      .map((e, l) =>
        "fullhd" == e || "audio" == e
          ? ""
          : `
                                <tr>
                                    <th>${++n}</th>
                                    <td>${t[e].quality}</td>
                                    <td>${t[e].render}</td>
                                    <td><a class="btn btn-primary py-0 btn-sm rounded rounded-0 text-white" href="${
                                      t[e].url
                                    }" download="${t[e].url}">Download</a></td>
                                </tr>
                            `
      )
      .join("")),
      tb.show(),
      loading.hide(),
      inputPageSource.scrollIntoView();
  });
const tb = {
  show: function () {
    (table.hidden = null), (thead.hidden = null);
  },
  hide: function () {
    (table.hidden = "true"), (thead.hidden = "true"), (tbody.innerHTML = null);
  },
};
btnPasteClipboard.addEventListener("click", (e) => {
  if (navigator.clipboard) {
    navigator.clipboard
      .readText()
      .then((e) => {
        inputUrl.value = e;
        alert.hide();
      })
      .catch((e) => {
        alert.show("Vui cấp quyền truy cập clipboard cho trang web!");
      });
  } else alert.show("Trình duyệt không được hỗ trợ!");
});
const alert = {
    show: function (e = "unknown error!") {
      (alertElement.hidden = null), (alertContent.textContent = e);
    },
    hide: function () {
      alertElement.hidden = "true";
    },
  },
  isValidURL = (e) => {
    let t = /^(https?:\/\/)?(www\.)?([\w-]+\.)+[\w]{2,}(\/\S*)?$/;
    if (!t.test(e)) return !1;
    e = e.trim().replace(/\/+$/, "");
    let n = ["fb.com", "facebook.com", "fb.watch"],
      l = new URL(e).hostname,
      i = n.some((e) => l.includes(e));
    return i;
  },
  loading = {
    show: function () {
      (inputPageSource.disabled = "true"),
        (btnGetLinkDownload.disabled = "true"),
        (btnPasteClipboard.disabled = "true"),
        (inputUrl.disabled = "true"),
        (loadingElement.hidden = null);
    },
    hide: function () {
      (inputPageSource.disabled = null),
        (btnGetLinkDownload.disabled = null),
        (btnPasteClipboard.disabled = null),
        (inputUrl.disabled = null),
        (loadingElement.hidden = "true");
    },
  };
