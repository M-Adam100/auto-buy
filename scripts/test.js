const interval = setInterval(() => {
        const addButton =  document.querySelector('.game_purchase_action').querySelector('a');
        const dateOption = document.querySelector('option[value="1998"]');

      if (addButton) {
        clearInterval(interval);
        addButton.dispatchEvent(new MouseEvent('click'));

      } else if (dateOption) {
          dateOption.selected = true;
      }
    }, 100);