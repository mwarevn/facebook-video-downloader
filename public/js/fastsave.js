// const elements = {
//   iconArrowUp: document.querySelector(".icon-arrow-up"),
//   inputUrl: document.querySelector("input"),
//   urlForm: document.querySelector(".url-form"),
//   displayResult: document.querySelector(".display-result"),
//   btnPaste: document.querySelector(".btn-paste"),
// };

// elements.btnPaste.addEventListener("click", (e) => {
//   navigator.clipboard
//     ? navigator.clipboard
//         .readText()
//         .then((e) => {
//           (elements.inputUrl.value = e), closeAlert();
//         })
//         .catch((e) => {
//           showAlert("Vui cấp quyền truy cập clipboard cho trang web!");
//         })
//     : showAlert("Tr\xecnh duyệt kh\xf4ng được hỗ trợ!");
// });
// // on icon arrow click
// elements.iconArrowUp.addEventListener("click", function () {
//   validateValueBeforeSubmit();
// });
// // on form submit event
// elements.urlForm.addEventListener("submit", (e) => {
//   e.preventDefault();
//   validateValueBeforeSubmit();
// });
// // valid before submit form
// function validateValueBeforeSubmit() {
//   elements.displayResult.innerHTML = null;
//   elements.displayResult.setAttribute("hidden", "hidden");

//   showLoader();
//   const regex =
//     /^(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.com|fb\.watch).*$/;

//   if (regex.test(elements.inputUrl.value)) {
//     // elements.urlForm.submit();
//     fetch("/get-public-facebook-video", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         video_url: elements.inputUrl.value,
//       }),
//       // mode: "no-cors",
//     })
//       .then((res) => res.json())
//       .then((res) => {
//         if (res.error || res.private) {
//           showAlert(
//             res.error || res.private ? "Video ở chế độ riêng tư !" : null
//           );
//           hideLoader();
//           return;
//         } else {
//           let htmls = "";
//           if (Object.keys(res).length > 0) {
//             Object.keys(res).forEach((item, index) => {
//               htmls += `
//                                 <figure style="padding: 12px; margin: 0 8px; border-radius: 0.375rem">
//                                     <div>
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             fill="none"
//                                             viewBox="0 0 24 24"
//                                             stroke-width="1.5"
//                                             stroke="#FFF"
//                                             width="32"
//                                             height="32"
//                                         >
//                                             <path
//                                                 stroke-linecap="round"
//                                                 stroke-linejoin="round"
//                                                 d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//                                             />
//                                             <path
//                                                 stroke-linecap="round"
//                                                 stroke-linejoin="round"
//                                                 d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
//                                             />
//                                         </svg>
//                                         <div style="width: 100%; margin: 0px 15px; color: white">
//                                             <span>${res[item].quality}</span>
//                                             <div><small>render: ${res[item].render}</small></div>
//                                         </div>
//                                         <a href="${res[item].url}" class="btn-download">Download</a>
//                                     </div>
//                                 </figure>
//                                 `;
//             });

//             elements.displayResult.innerHTML = htmls;
//             elements.displayResult.removeAttribute("hidden");
//           }
//         }
//       })
//       .finally(() => {
//         hideLoader();
//       });
//   } else {
//     showAlert("Invalid, please paste facebook video url!");
//     hideLoader();
//   }
// }
// // on input url event
// elements.inputUrl.addEventListener("input", function () {
//   // set icon color
//   elements.iconArrowUp.style.background =
//     elements.inputUrl.value != "" ? "#FFF" : "#676767";
//   // set icon pointer
//   elements.iconArrowUp.style.cursor =
//     elements.inputUrl.value != "" ? "pointer" : "default";
// });

// function showAlert(msg) {
//   document.getElementById("custom-alert").style.display = "block";
//   document.querySelector(".alert-msg").innerHTML = msg;
//   setTimeout(
//     () => (document.getElementById("custom-alert").style.display = "none"),
//     2500
//   );
// }

// function closeAlert() {
//   document.getElementById("custom-alert").style.display = "none";
// }

// function showLoader() {
//   document.querySelector(".loader").removeAttribute("hidden");
//   // hideLoader();
// }

// function hideLoader() {
//   document.querySelector(".loader").setAttribute("hidden", "hidden");
// }

const elements = {
  iconArrowUp: document.querySelector(".icon-arrow-up"),
  inputUrl: document.querySelector("input"),
  urlForm: document.querySelector(".url-form"),
  displayResult: document.querySelector(".display-result"),
  btnPaste: document.querySelector(".btn-paste"),
  customAlert: document.getElementById("custom-alert"),
  alertMsg: document.querySelector(".alert-msg"),
  loader: document.querySelector(".loader"),
};

// Event delegation for inputUrl and iconArrowUp
document.addEventListener("input", function (event) {
  if (event.target === elements.inputUrl) {
    handleInputUrl();
  }
});

elements.iconArrowUp.addEventListener("click", function () {
  validateValueBeforeSubmit();
});

elements.btnPaste.addEventListener("click", function () {
  handlePaste();
});

elements.urlForm.addEventListener("submit", function (e) {
  e.preventDefault();
  validateValueBeforeSubmit();
});

function handleInputUrl() {
  elements.iconArrowUp.style.background =
    elements.inputUrl.value !== "" ? "#FFF" : "#676767";
  elements.iconArrowUp.style.cursor =
    elements.inputUrl.value !== "" ? "pointer" : "default";
}

function handlePaste() {
  navigator.clipboard
    ? navigator.clipboard
        .readText()
        .then((text) => {
          elements.inputUrl.value = text;
          closeAlert();
        })
        .catch(() => {
          showAlert("Vui cấp quyền truy cập clipboard cho trang web!");
        })
    : showAlert("Trình duyệt không được hỗ trợ!");
}

function showAlert(msg) {
  elements.customAlert.style.display = "block";
  elements.alertMsg.innerHTML = msg;
  setTimeout(() => {
    elements.customAlert.style.display = "none";
  }, 2500);
}

function closeAlert() {
  elements.customAlert.style.display = "none";
}

function showLoader() {
  elements.loader.removeAttribute("hidden");
}

function hideLoader() {
  elements.loader.setAttribute("hidden", "hidden");
}

function validateValueBeforeSubmit() {
  elements.displayResult.innerHTML = "";
  elements.displayResult.setAttribute("hidden", "");

  showLoader();
  const regex =
    /^(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.com|fb\.watch).*$/;

  if (regex.test(elements.inputUrl.value)) {
    fetch("/get-public-facebook-video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_url: elements.inputUrl.value,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error || res.private) {
          showAlert(
            res.error || res.private ? "Video ở chế độ riêng tư !" : null
          );
          hideLoader();
          return;
        } else {
          let htmls = "";
          if (Object.keys(res).length > 0) {
            Object.keys(res).forEach((item) => {
              htmls += `
                  <figure style="padding: 12px; margin: 0 8px; border-radius: 0.375rem">
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#FFF" width="32" height="32">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"/>
                      </svg>
                      <div style="width: 100%; margin: 0px 15px; color: white">
                        <span>${res[item].quality}</span>
                        <div><small>render: ${res[item].render}</small></div>
                      </div>
                      <a href="${res[item].url}" class="btn-download">Download</a>
                    </div>
                  </figure>
                `;
            });

            elements.displayResult.innerHTML = htmls;
            elements.displayResult.removeAttribute("hidden");
          }
        }
      })
      .finally(() => {
        hideLoader();
      });
  } else {
    showAlert("Invalid, please paste facebook video url!");
    hideLoader();
  }
}
