(async () => {

    console.log("Adding To Cart!");

    const script = document.createElement("script");

    script.src = chrome.runtime.getURL('scripts/test.js')

    document.body.appendChild(script);

    chrome.runtime.sendMessage({
        message: 'CLOSE_WINDOW'
    })

})();