document.querySelector('#games').addEventListener('change',(e) => {
    chrome.storage.local.set({ games: Number(document.querySelector('#games').value)})
})

document.querySelector('#amount').addEventListener('change',(e) => {
  chrome.storage.local.set({ amount: Number(document.querySelector('#amount').value)})
})

document.querySelector('#delay').addEventListener('change',(e) => {
  chrome.storage.local.set({ delay: Number(document.querySelector('#delay').value)})
})

document.querySelector('#Save').addEventListener('click',(e) => {
  chrome.storage.local.set({
    games: Number(document.querySelector('#games').value),
    amount: Number(document.querySelector('#amount').value),
    delay: Number(document.querySelector('#delay').value)
  })
})

document.querySelector('#Start').addEventListener('click', () => {
    const query = { active: true, currentWindow: true };
    function callback(tabs) {
        const currentTab = tabs[0]; 
        chrome.scripting.executeScript(
            {
              target: {tabId: currentTab.id},
              files: ['scripts/steam-check.js']
            },
            () => { console.log("Executed Script")});
      }

    chrome.tabs.query(query, callback);
})

const setUI = () => {
  chrome.storage.local.get(['games', 'amount', 'delay'], CS => {
    if (CS.games) document.querySelector('#games').value = CS.games;
    if (CS.amount) document.querySelector('#amount').value = CS.amount;
    if (CS.delay) document.querySelector('#delay').value = CS.delay;
  })
}

setUI();








