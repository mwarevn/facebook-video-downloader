const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { app } = require("../utils/common");

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
    let sd_url, hd_url, full_hd_url, audio_url;
    let representations;
    try {
        representations = JSON.parse(
            html
                .split('"extensions":{"all_video_dash_prefetch_representations":[{"representations":')[1]
                .split(',"video_id":')[0]
        );

        // Lặp qua danh sách representations để lấy URL của video và audio
        for (let i of representations) {
            if (i.height == 1080 && i.width == 1920 && i.mime_type == "video/mp4") {
                full_hd_url = i.base_url;
            } else if (i.height == 0 && i.width == 0 && i.mime_type == "audio/mp4") {
                audio_url = i.base_url;
            }
        }

        sd_url =
            decodeSpecialCharacters(html.split('"browser_native_sd_url":"')[1].split('"')[0]).replace(/\\/g, "") +
            "&dl=1";
        hd_url =
            decodeSpecialCharacters(html.split('"browser_native_hd_url":"')[1].split('"')[0]).replace(/\\/g, "") +
            "&dl=1";

        return { full_hd_url, hd_url, sd_url, audio_url };
    } catch (e) {
        console.log("Failed to get url from raw!");
        return false;
    }
};

const crawlFacebookVideoData = async (video_url) => {
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
    // [GET] - /facebook-video-downloader
    facebookPublicDownloadPage(req, res, next) {
        res.render("pages/facebook_video_downloader", app);
    }

    // [GET] - /facebook-private-video-downloader
    facebookPrivateDownloadPage(req, res) {
        res.render("pages/facebook_private_video_downloader", app);
    }

    // [GET] - /tiktok-video-downloader
    tiktokDownloadPage(req, res) {
        res.render("pages/tiktok_video_downloader");
    }

    // [POST] - /get-public-facebook-video
    getPublicFacebookVideo(req, res, next) {
        const video_url = req.body.video_url;
        crawlFacebookVideoData(video_url)
            .then((response) => res.json(response))
            .catch((err) => res.json({ msg: "Errror!" }));
    }

    // [POST] - /get-private-facebook-video
    getPrivateFaceBookVideo(req, res, next) {
        const page_source = req.body.page_source;
        res.json(getFacebookUrlFromRaw(page_source) || { msg: "Error, can not find video source!" });
    }

    // [POST] - /get-details-tiktok-video
    async getDetailsTikTokVideo(req, res) {
        const video_url = req.body.video_url;

        let chromeOptions = new chrome.Options();

        chromeOptions.addArguments("--headless");
        const driver = new Builder().setChromeOptions(chromeOptions).forBrowser("chrome").build();

        // type swipe photo
        if (video_url.includes("/photo/")) {
            await driver.get("https://snaptik.app/");
            await driver.wait(until.elementLocated(By.id("url")), 8000);

            // Find the input field by its ID and input a value
            const inputField = await driver.findElement(By.id("url"));
            await inputField.sendKeys(video_url);

            // Find the button element by its ID and click it
            const button = await driver.findElement(By.css('button[aria-label="Get"]'));
            await button.click();

            await driver.wait(until.elementLocated(By.css('button[data-event="click_render"]')), 10000);

            const descElement = await driver.wait(until.elementLocated(By.css(".video-title")), 10000);
            const desc = await descElement.getText();
            const coverElement = await driver.wait(until.elementLocated(By.id("thumbnail")), 10000);
            const cover = await coverElement.getAttribute("src");

            const btnRender = await driver.findElement(By.css('button[data-event="click_render"]'));
            await btnRender.click();

            const downloadLinkElement = await driver.wait(
                until.elementLocated(By.css('a[data-event="download_mp4_render"].show')),
                10000
            );

            const video_render = await downloadLinkElement.getAttribute("href");

            await driver.wait(until.elementLocated(By.css('img[loading="lazy"]')), 10000);
            const photosElement = await driver.findElements(By.css('img[loading="lazy"]'));
            let photos = [];

            for (let e of photosElement) {
                let src = await e.getAttribute("src");
                photos.push(src);
            }

            const video = {
                desc,
                cover,
                video_render,
                photos,
                type: "photo",
            };

            res.json(video);
            return;
        }

        // type video
        crawlTikTokVideoData(video_url)
            .then((response) => response.text())
            .then((response) => {
                let video;

                try {
                    const jsonData = JSON.parse(
                        response
                            .split('__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application/json">')[1]
                            .split("</script>")[0]
                    );

                    video = jsonData.__DEFAULT_SCOPE__["webapp.video-detail"].itemInfo.itemStruct;
                } catch (error) {
                    console.log("no data found!");
                }

                return video;
            })
            .then(async (video) => {
                if (!video) {
                    res.json({ msg: "Error, can not found video data!" });
                    return;
                }

                try {
                    await driver.get("https://snaptik.app/");
                    await driver.wait(until.elementLocated(By.id("url")), 8000);

                    // Find the input field by its ID and input a value
                    const inputField = await driver.findElement(By.id("url"));
                    await inputField.sendKeys(video_url);

                    // Find the button element by its ID and click it
                    const button = await driver.findElement(By.css('button[aria-label="Get"]'));
                    await button.click();

                    await driver.wait(until.elementLocated(By.css('a[data-event="server01_file"]')), 10000);

                    const server01_file = await driver
                        .findElement(By.css('a[data-event="server01_file"]'))
                        .getAttribute("href");
                    const server02_file = await driver
                        .findElement(By.css('a[data-event="snaptik_file"]'))
                        .getAttribute("href");

                    res.json({ server01_file, server02_file, video });
                } catch (error) {
                    res.json({ msg: "Error when downlaoding: " + error });
                    console.log("Error can not download video!");
                }
            })
            .catch((err) => {
                res.json({ msg: "Error, can not get video source!" });
            });
    }
}

module.exports = new HomeController();
