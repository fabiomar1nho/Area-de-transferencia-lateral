document.addEventListener("DOMContentLoaded", () => {
  const listDiv = document.getElementById("list");
  const clearBtn = document.getElementById("clear-btn");
  const exportBtn = document.getElementById("export-btn");
  const captureToggle = document.getElementById("capture-toggle");
  const toast = document.getElementById("toast");
  
  const noteInput = document.getElementById("note-input");
  const addNoteBtn = document.getElementById("add-note-btn");
  
  let currentHistory = [];

  // Função para exibir aviso flutuante
  function showToast(message = "Texto copiado!") {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 1500);
  }

  // Carrega e gerencia a chave liga/desliga
  chrome.storage.local.get({ isCapturing: true }, (result) => {
    captureToggle.checked = result.isCapturing;
  });

  captureToggle.addEventListener("change", (e) => {
    chrome.storage.local.set({ isCapturing: e.target.checked });
  });

  // Lógica de Adicionar Nota Manual
  function addNewNote() {
    const text = noteInput.value.trim();
    if (!text) return;

    chrome.storage.local.get({ history: [] }, (result) => {
      let history = result.history || [];
      const lastItem = history.length > 0 ? history[history.length - 1] : null;
      const lastText = lastItem ? (typeof lastItem === 'string' ? lastItem : lastItem.text) : null;

      if (lastText !== text) {
        history.push({ text: text });
        if (history.length > 30) history.shift();
        
        chrome.storage.local.set({ history: history }, () => {
          noteInput.value = ""; 
          showToast("Nota adicionada!");
        });
      } else {
        noteInput.value = ""; 
      }
    });
  }

  addNoteBtn.addEventListener("click", addNewNote);

  noteInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Impede pular linha se não segurar o shift
      addNewNote();
    }
  });

  // Formatação de letras maiúsculas/minúsculas
  function capitalizeText(text) {
    return text.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  }

  // Atualizar (Salvar edição) de forma segura direto do Storage
  function updateItemText(index, newText) {
    const trimmed = newText.trim();
    if (!trimmed) {
      showToast("O texto não pode estar vazio!");
      return;
    }

    chrome.storage.local.get({ history: [] }, (result) => {
      let history = result.history || [];
      if (history[index] !== undefined) {
        if (typeof history[index] === 'string') {
          history[index] = { text: trimmed };
        } else {
          history[index].text = trimmed;
        }
        
        chrome.storage.local.set({ history: history }, () => {
          showToast("Alteração salva!");
        });
      }
    });
  }

  // Excluir item de forma segura
  function deleteItem(index) {
    chrome.storage.local.get({ history: [] }, (result) => {
      let history = result.history || [];
      history.splice(index, 1);
      chrome.storage.local.set({ history: history }, () => {
        showToast("Item excluído!");
      });
    });
  }

  function createActionBtn(label, title, extraClass, onClick) {
    const btn = document.createElement("button");
    btn.className = `action-btn ${extraClass}`;
    btn.textContent = label;
    btn.title = title;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      onClick();
    });
    return btn;
  }

  // Renderiza a lista completa
  function renderList(history) {
    currentHistory = history;
    listDiv.innerHTML = "";
    
    if (!history || history.length === 0) {
      listDiv.innerHTML = '<div class="empty">Nenhum texto salvo.<br><br>Copie qualquer texto no navegador ou digite uma nota acima.</div>';
      return;
    }

    history.forEach((item, index) => {
      const textVal = typeof item === 'string' ? item : item.text;

      const itemDiv = document.createElement("div");
      itemDiv.className = "item";
      
      const textContainer = document.createElement("div");
      textContainer.className = "item-text";
      textContainer.title = "Clique para copiar";
      textContainer.textContent = textVal;

      const actionsDiv = document.createElement("div");
      actionsDiv.className = "item-actions";

      let isEditing = false;
      
      // Clique para copiar o texto (só se não estiver editando)
      textContainer.addEventListener("click", () => {
        if (isEditing) return;
        
        navigator.clipboard.writeText(textVal).then(() => {
          showToast("Texto copiado!");
        });
      });

      // Botões de Formatação (escondidos inicialmente)
      const btnUpper = createActionBtn("AA", "Tudo Maiúsculo", "", () => {
        const ta = textContainer.querySelector("textarea");
        if(ta) ta.value = ta.value.toUpperCase();
      });
      const btnLower = createActionBtn("aa", "Tudo Minúsculo", "", () => {
        const ta = textContainer.querySelector("textarea");
        if(ta) ta.value = ta.value.toLowerCase();
      });
      const btnCap = createActionBtn("Aa", "Iniciais Maiúsculas", "", () => {
        const ta = textContainer.querySelector("textarea");
        if(ta) ta.value = capitalizeText(ta.value);
      });

      btnUpper.style.display = "none";
      btnLower.style.display = "none";
      btnCap.style.display = "none";

      const btnDelete = createActionBtn("🗑️", "Excluir", "delete", () => deleteItem(index));

      // Lógica do Botão Editar/Salvar
      const btnEdit = createActionBtn("✏️ Editar", "Modificar Texto", "", () => {
        if (!isEditing) {
          isEditing = true;
          const textarea = document.createElement("textarea");
          textarea.className = "edit-textarea";
          textarea.value = textVal;
          
          textarea.addEventListener("click", (e) => e.stopPropagation());
          
          textContainer.innerHTML = "";
          textContainer.appendChild(textarea);
          textContainer.title = ""; 
          textarea.focus();

          btnEdit.textContent = "💾 Salvar";
          
          btnUpper.style.display = "";
          btnLower.style.display = "";
          btnCap.style.display = "";
          btnDelete.style.display = "none";
        } else {
          const textarea = textContainer.querySelector("textarea");
          if (textarea) {
            updateItemText(index, textarea.value);
          }
          isEditing = false;
        }
      });

      actionsDiv.append(btnUpper, btnLower, btnCap, btnEdit, btnDelete);
      itemDiv.append(textContainer, actionsDiv);
      listDiv.appendChild(itemDiv);
    });
    
    // Faz o scroll automático para baixo ao carregar novos itens
    setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 50);
  }

  function loadHistory() {
    chrome.storage.local.get({ history: [] }, (result) => renderList(result.history));
  }

  // Exportar para TXT
  exportBtn.addEventListener("click", () => {
    if (!currentHistory || currentHistory.length === 0) {
      alert("Não há histórico para exportar!");
      return;
    }

    let txtContent = "=== HISTÓRICO DA ÁREA DE TRANSFERÊNCIA ===\n\n";

    currentHistory.forEach((item, idx) => {
      const textVal = typeof item === 'string' ? item : item.text;
      txtContent += `[Item ${idx + 1}]\n`;
      txtContent += `${textVal}\n`;
      txtContent += `----------------------------------------\n\n`;
    });

    const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `historico_transferencia_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Limpar Tudo
  clearBtn.addEventListener("click", () => {
    if(confirm("Tem certeza que deseja apagar todo o histórico?")) {
      chrome.storage.local.set({ history: [] }, () => {
        showToast("Histórico limpo!");
      });
    }
  });

  // Atualiza em tempo real se a memória mudar
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.history) {
      renderList(changes.history.newValue);
    }
  });

  loadHistory();
});