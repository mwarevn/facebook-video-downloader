var i18n = require("i18n");
let lang = "en";
const { URL } = require("url");
const { Builder, By, Key, until } = require("selenium-webdriver");
const axios = require("axios");
const chrome = require("selenium-webdriver/chrome");

function decodeSpecialCharacters(encodedLink) {
    let decodedLink = encodedLink
        .replace(/\\u0025/g, "%")
        .replace(/\\u0026/g, "&")
        .replace(/\\u002F/g, "/")
        .replace(/\\u003A/g, ":")
        .replace(/\\u003F/g, "?")
        .replace(/\\u0023/g, "#")
        .replace(/\\u0024/g, "$")
        .replace(/\\u002B/g, "+")
        .replace(/\\u002C/g, ",")
        .replace(/\\u0020/g, " ")
        .replace(/\\u005F/g, "_")
        .replace(/\\u002E/g, ".")
        .replace(/\\u003D/g, "=")
        .replace(/\\u0025/g, "%")
        .replace(/\\u007B/g, "{")
        .replace(/\\u007D/g, "}")
        .replace(/\\u003C/g, "<")
        .replace(/\\u003E/g, ">")
        .replace(/\\u005B/g, "[")
        .replace(/\\u005D/g, "]")
        .replace(/\\u0022/g, '"')
        .replace(/\\u005C/g, "\\")
        .replace(/\\u005E/g, "^")
        .replace(/\\u0026/g, "&")
        .replace(/\\u003B/g, ";")
        .replace(/\\u007C/g, "|")
        .replace(/\\u0060/g, "`")
        .replace(/\\u0027/g, "'")
        .replace(/\\u002D/g, "-")
        .replace(/\\u0021/g, "!")
        .replace(/\\u0040/g, "@")
        .replace(/\\u002A/g, "*")
        .replace(/\\u0028/g, "(")
        .replace(/\\u0029/g, ")")
        .replace(/\\u003A/g, ":")
        .replace(/\\u002F/g, "/")
        .replace(/\\u003F/g, "?")
        .replace(/\\u0023/g, "#")
        .replace(/\\u0024/g, "$")
        .replace(/\\u002B/g, "+")
        .replace(/\\u002C/g, ",")
        .replace(/\\u0020/g, " ")
        .replace(/\\u005F/g, "_")
        .replace(/\\u002E/g, ".")
        .replace(/\\u003D/g, "=")
        .replace(/\\u0025/g, "%")
        .replace(/\\u007B/g, "{")
        .replace(/\\u007D/g, "}")
        .replace(/\\u003C/g, "<")
        .replace(/\\u003E/g, ">")
        .replace(/\\u005B/g, "[")
        .replace(/\\u005D/g, "]")
        .replace(/\\u0022/g, '"')
        .replace(/\\u005C/g, "\\")
        .replace(/\\u005E/g, "^")
        .replace(/\\u0026/g, "&")
        .replace(/\\u003B/g, ";")
        .replace(/\\u007C/g, "|")
        .replace(/\\u0060/g, "`")
        .replace(/\\u0027/g, "'")
        .replace(/\\u002D/g, "-")
        .replace(/\\u0021/g, "!")
        .replace(/\\u0040/g, "@")
        .replace(/\\u002A/g, "*")
        .replace(/\\u0028/g, "(")
        .replace(/\\u0029/g, ")");
    return decodedLink;
}
function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

const getFacebookUrlFromRaw = (html) => {
    let sd_url, hd_url;
    try {
        sd_url =
            decodeSpecialCharacters(html.split('"browser_native_sd_url":"')[1].split('"')[0]).replace(/\\/g, "") +
            "&dl=1";
        hd_url =
            decodeSpecialCharacters(html.split('"browser_native_hd_url":"')[1].split('"')[0]).replace(/\\/g, "") +
            "&dl=1";
    } catch {}

    return { hd_url, sd_url };
};

const crawlFacebookVideoData = (video_url) => {
    return fetch(video_url, {
        headers: {
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "vi",
            "cache-control": "max-age=0",
            dpr: "2",
            priority: "u=0, i",
            "sec-ch-prefers-color-scheme": "light",
            "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
            "sec-ch-ua-full-version-list":
                '"Chromium";v="124.0.6367.92", "Google Chrome";v="124.0.6367.92", "Not-A.Brand";v="99.0.0.0"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-model": '""',
            "sec-ch-ua-platform": '"macOS"',
            "sec-ch-ua-platform-version": '"14.4.1"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "viewport-width": "674",
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
    })
        .then((response) => response.text())
        .then((text) => getFacebookUrlFromRaw(text))
        .catch((err) => {
            console.log("Failed to crawl!!!" + err);
            return false;
        });
};

const crawlTikTokVideoData = (video_url) => {
    return fetch(video_url, {
        headers: {
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "vi,vi-VN;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
            "cache-control": "max-age=0",
            priority: "u=0, i",
            "sec-ch-ua": '"Google Chrome";v="118", "Chromium";v="118", "Not=A?Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
    });
};

class HomeController {
    index(req, res, next) {
        var langCode = req.params.lang;

        i18n.setLocale(req, lang || langCode);
        res.render("home/index", { lang: lang || langCode });
    }

    privateDownloadPage(req, res) {
        var langCode = req.params.lang;
        i18n.setLocale(req, lang || langCode);
        res.render("home/private_download", { lang: lang || langCode });
    }

    tiktokDownloadPage(req, res) {
        var langCode = req.params.lang;
        i18n.setLocale(req, lang || langCode);
        res.render("home/tiktok", { lang: lang || langCode });
    }

    getPublicVideo(req, res, next) {
        const video_url = req.body.video_url;
        crawlFacebookVideoData(video_url)
            .then((response) => res.json(response))
            .catch((err) => res.json({ msg: "Errror!" }));
    }

    getPrivateVideo(req, res, next) {
        const page_source = req.body.page_source;
        res.json(getFacebookUrlFromRaw(page_source) || { msg: "Error, can not find video source!" });
    }

    // getTikTokVideo(req, res) {
    //     const video_url = req.body.video_url;
    //     const optionHeaders = {
    //         headers: {
    //             accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    //             "accept-language": "vi,vi-VN;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5",
    //             "cache-control": "max-age=0",
    //             priority: "u=0, i",
    //             "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    //             "sec-ch-ua-mobile": "?0",
    //             "sec-ch-ua-platform": '"macOS"',
    //             "sec-fetch-dest": "document",
    //             "sec-fetch-mode": "navigate",
    //             "sec-fetch-site": "same-origin",
    //             "sec-fetch-user": "?1",
    //             "upgrade-insecure-requests": "1",
    //         },
    //         referrerPolicy: "strict-origin-when-cross-origin",
    //         body: null,
    //         method: "GET",
    //     };
    //     crawlTikTokVideoData(video_url, optionHeaders)
    //         .then((response) => response.text())
    //         .then((response) => {
    //             const jsonData = JSON.parse(
    //                 response
    //                     .split('__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application/json">')[1]
    //                     .split("</script>")[0]
    //             );

    //             const video = jsonData.__DEFAULT_SCOPE__["webapp.video-detail"].itemInfo.itemStruct.video;

    //             if (video) {
    //                 res.json(video);
    //             } else {
    //                 res.json({ msg: "Error, can not get video source!" });
    //             }
    //         })
    //         .catch((err) => {
    //             res.json({ msg: "Error, can not get video source!" });
    //         });
    // }

    saveTmpBlob(req, res) {
        const blob = req.body.blobUrl;

        res.send("ok blob");
    }

    forceDownloadVideoTiktok() {}

    async getTikTokVideo(req, res) {
        var input_video_url = req.body.video_url;

        let chromeOptions = new chrome.Options();
        chromeOptions.addArguments("--headless");
        // chromeOptions.addArguments("--disable-gpu");
        chromeOptions.setUserPreferences({
            "download.default_directory": __dirname.split("controllers")[0] + "public/tmp/videos",
        });

        const driver = new Builder().setChromeOptions(chromeOptions).forBrowser("chrome").build();

        try {
            const fileName = generateRandomString(28) + ".mp4";

            console.log(fileName);
            await driver.get(input_video_url);
            await driver.wait(until.elementLocated(By.css("video")), 8000);

            const videoTag = await driver.findElement(By.css("video"));
            const videoSourceUrl = await videoTag.getAttribute("src");

            await driver.executeScript(`
                const videoElement = document.querySelector('video[crossorigin="use-credentials"]');

                fetch(videoElement.src)
                .then(response => response.blob())
                .then(blob => {

                    // Tạo một URL cho Blob object
                    var blobUrl = window.URL.createObjectURL(blob);

                    // Tạo một thẻ a ẩn để tải xuống
                    var downloadLink = document.createElement('a');
                    downloadLink.style.display = 'none';
                    downloadLink.href = blobUrl;
                    downloadLink.setAttribute('download', '${fileName}');
                    document.body.appendChild(downloadLink);

                    downloadLink.click();

                    document.body.removeChild(downloadLink);
                })
                .catch(error => console.error('Error downloading video:', error))

            `);

            // driver.quit();

            res.send({
                link: `${process.env.HOST}/tmp/videos/${fileName}`,
            });

            // const response = await axios.get(input_video_url, { responseType: 'stream' });

            // res.setHeader('Content-Type', response.headers['content-type']);
            // response.data.pipe(res);
        } catch (error) {
            res.send(123);
        }
    }
}

module.exports = new HomeController();
