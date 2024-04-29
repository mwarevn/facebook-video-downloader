const Buffer = require("buffer").Buffer;

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

const extract_url_from_crawl = (html) => {
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

const crawlHtml = (videoLink) => {
    return fetch(videoLink, {
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
        .then((text) => extract_url_from_crawl(text))
        .catch((err) => {
            console.log("Failed to crawl!!!" + err);
            return false;
        });
};

class HomeController {
    index(req, res, next) {
        res.render("home/index", { title: "Anh Minh" });
    }

    privateDownloadPage(req, res) {
        res.render("home/private_download", { title: "Anh Minh" });
    }

    getPublicVideo(req, res, next) {
        const video_url = req.body.video_url;
        crawlHtml(video_url)
            .then((response) => res.json(response))
            .catch((err) => res.json({ msg: "Errror!" }));
    }

    getPrivateVideo(req, res, next) {
        const page_source = req.body.page_source;

        const decodedString = Buffer.from(page_source, "base64").toString("utf-8");

        res.json(extract_url_from_crawl(page_source) || { msg: "Error, can not find video source!" });
    }
}

module.exports = new HomeController();
