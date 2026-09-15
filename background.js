// Abre o painel lateral ao clicar no ícone da extensão
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));

// Escuta os textos copiados vindos das páginas web
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "TEXT_COPIED" && message.text) {
    chrome.storage.local.get({ isCapturing: true, history: [] }, (result) => {
      // Se a chavinha estiver desligada, não faz nada
      if (!result.isCapturing) return;

      const textToSave = message.text;
      let history = result.history || [];
      
      // Pega o último texto salvo para evitar duplicatas seguidas
      const lastItem = history.length > 0 ? history[history.length - 1] : null;
      const lastText = lastItem ? (typeof lastItem === 'string' ? lastItem : lastItem.text) : null;

      if (lastText !== textToSave) {
        history.push({ text: textToSave }); 
        if (history.length > 30) history.shift(); // Limite máximo de 30 itens
        chrome.storage.local.set({ history: history });
      }
    });
  }
  return true;
});