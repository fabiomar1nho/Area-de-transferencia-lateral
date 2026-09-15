document.addEventListener("copy", () => {
  try {
    const selectedText = window.getSelection().toString().trim();
    
    // Verifica se a extensão ainda está ativa antes de enviar a mensagem
    if (selectedText && chrome.runtime?.id) {
      chrome.runtime.sendMessage({ type: "TEXT_COPIED", text: selectedText });
    }
  } catch (error) {
    // Ignora silenciosamente se o contexto foi invalidado (ex: extensão atualizada)
  }
});