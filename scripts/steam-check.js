console.log("Running Script");

(async () => {

  const sleep = (s) => {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
 }
  

 const { status: check }  = await chrome.storage.local.get(['status']);
  const getEle = (selector) => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (document.querySelector(selector)) {
          clearInterval(interval);
          resolve(document.querySelector(selector));
        }

      }, 100);
    })
  }

  const getAllEle = (selector) => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (document.querySelectorAll(selector)) {
          clearInterval(interval);
          resolve(document.querySelectorAll(selector));
        }

      }, 100);
    })
  }

  const getFromChromeStorage = (key) => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], CS => {
        if (CS[key]) resolve(CS[key])
      })
    })
  }

  const getGameStatus = async (gameId) => {
    const response = await fetch(`https://store.steampowered.com/app/${gameId}`, {
      credentials: 'include'
    });

    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const status = [...doc.querySelectorAll('div.label')].filter(item => item.innerText.includes("Profile Features Limited") || item.innerText.includes("Steam is learning about this game"));
    if (status.length) return true;
    else false; 
  }


  const delay = await getFromChromeStorage('delay');

  let TOTAL_GAMES_BOUGHT = 0;
  const numberOfGames = await getFromChromeStorage('games');
  const amount = await getFromChromeStorage('amount');

  const buyGame = async () => {
    if (TOTAL_GAMES_BOUGHT >= numberOfGames) {
      return;
    }
    const mainDiv = await getEle('#search_resultsRows');
    const game = mainDiv.querySelector('a:not([scanned])');

    if (game) {
      game.setAttribute('scanned', true);

      console.log(game.querySelector('.ds_flag ds_incart_flag'))

      if (game.querySelector('.ds_flag.ds_incart_flag')) {
        buyGame();
      } else {
        const currency = game.querySelector('.col.search_price').innerText;
        const gamePrice = Number(currency.replace(/[^0-9.-]+/g,""));
    
        if (gamePrice <= amount) {
          console.log(game.querySelector('.title').innerText,  "  ADDING TO CART!");
          chrome.runtime.sendMessage({
            url: game.href,
            message: 'ADD_TO_CART',
            delay
          })
          TOTAL_GAMES_BOUGHT = TOTAL_GAMES_BOUGHT + 1; 
          if (TOTAL_GAMES_BOUGHT < numberOfGames) {
            await sleep(delay);
            buyGame();
          }
          
        } else {
          buyGame();
        }
      }

      
    } else {
      window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
    }
   
    
  }

  buyGame();



  // setInterval(async () => {
  //   const allGames = [...mainDiv.querySelectorAll('a:not([scanned])')];

  //   if (allGames.length) {
  //     for (let i = 0; i < allGames.length; i++) {
  //       const currency = allGames[i].querySelector('.col.search_price').innerText
  //       const number = Number(currency.replace(/[^0-9.-]+/g,""));
  //       const numberOfGames = await getFromChromeStorage('games');
  //       const amount = await getFromChromeStorage('amount');

  //       console.log({
  //         number: numberOfGames,
  //         amount: amount,
  //         delay
  //       })

  //       allGames[i].setAttribute('scanned', true);
  //     }
  //   } 

  
  // }, delay * 2000);
 

})()
