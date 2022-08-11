chrome.runtime.onInstalled.addListener(async () => {
  console.log("Extension Installed");
});

const getFromChromeStorage = (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], CS => {
      if (CS[key]) resolve(CS[key])
    })
  })
}

chrome.runtime.onMessage.addListener(async (request, sender) => {

  const delay = await getFromChromeStorage('delay');
  const { url, message } = request;
   if (message == 'ADD_TO_CART') {
    chrome.windows.create(
      {
        url,
        type: 'popup'
      },
      ({ tabs: [newTab] }) => {
        setTimeout(() => {
          chrome.scripting.executeScript(
            {
              target: { tabId: newTab.id },
              files: ['scripts/steam-buy.js']
            },
            (res) => { console.log(res); console.log("Executed Script") });
        }, 2000);

      });
  } else if (request.message == "CLOSE_WINDOW") {
    console.log(request, sender);
    
    setTimeout(() => {
      chrome.windows.remove(sender.tab.windowId);
      console.log("Window Removed!");
    }, delay * 1000)
  }

})





