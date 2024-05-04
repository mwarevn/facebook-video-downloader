const pasteFromClipboard = async () => {
    let msg;
    // Check if the Permissions API is supported
    if (navigator.permissions) {
        // Request permission to access the clipboard
        await navigator.permissions.query({ name: "clipboard-read" }).then(async (result) => {
            // If permission is granted
            if (result.state === "granted") {
                // Paste from clipboard
                await navigator.clipboard.readText().then((text) => {
                    msg = "Pasted text " + text;
                });
            } else {
                msg = "Permission to access clipboard was denied.";
            }
        });
    } else {
        msg = "Permissions API is not supported in this browser.";
    }

    return msg;
};
