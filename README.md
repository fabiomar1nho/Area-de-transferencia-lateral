# 📋 Área de Transferência Lateral (Chrome Extension)

Uma extensão leve e prática para Google Chrome (Manifest V3) que captura textos copiados no navegador e permite gerenciar anotações rápidas diretamente no painel lateral (Side Panel).

## ✨ Funcionalidades

- **Captura Automática:** Registra textos copiados em qualquer aba do navegador em tempo real.
- **Chave Liga/Desliga:** Pause e retome a captura de textos com um clique.
- **Notas Manuais:** Adicione suas próprias anotações diretamente pelo painel (pressione `Enter` para salvar).
- **Edição e Formatação:** Modifique textos salvos e aplique formatações rápidas:
  - TUDO MAIÚSCULO
  - tudo minúsculo
  - Iniciais Maiúsculas
- **Exportação:** Salve todo o seu histórico em um arquivo `.txt` com um clique.
- **Histórico Inteligente:** Mantém os últimos 30 itens salvos (ordem cronológica) utilizando o armazenamento local do Chrome, sem perder dados ao fechar o navegador.

---

## 🚀 Como Instalar (Modo Desenvolvedor)

Como esta extensão ainda não está na Chrome Web Store, você pode instalá-la manualmente seguindo estes passos:

1. Acesse a página de [Releases](https://github.com/fabiomar1nho/area-de-transferencia-lateral/releases) deste repositório.
2. Baixe o arquivo `.zip` da versão mais recente.
3. Extraia o conteúdo do arquivo `.zip` em uma pasta no seu computador.
4. Abra o Google Chrome e digite na barra de endereços: `chrome://extensions/`
5. No canto superior direito, ative a chave **Modo do desenvolvedor**.
6. Clique no botão **Carregar sem compactação** (no canto superior esquerdo).
7. Selecione a pasta onde você extraiu os arquivos da extensão.
8. Pronto! A extensão aparecerá na sua lista. Recomendamos fixar o ícone na barra do navegador clicando no ícone de "quebra-cabeça".

---

## 💻 Estrutura do Projeto

O projeto foi construído utilizando as diretrizes mais recentes do **Manifest V3** do Google Chrome.

* `manifest.json`: Configurações e permissões.
* `background.js`: Service worker que gerencia o estado da extensão e intercepta as cópias.
* `content.js`: Script injetado nas páginas web para ler os eventos de cópia (`Ctrl+C`).
* `sidepanel.html` / `sidepanel.js`: Interface de usuário e lógica do painel lateral.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 & CSS3** (Interface fluida e sem frameworks externos)
- **Vanilla JavaScript** (Lógica de dados e formatação)
- **Chrome Extension APIs** (`chrome.sidePanel`, `chrome.storage.local`, `chrome.runtime`)

---

## 👨‍💻 Autor

Desenvolvido por [fabiomar1nho](https://github.com/fabiomar1nho).

---

## 🤖 Divulgação do Uso de IA (Transparência)

Transparência e integridade são valores essenciais para este projeto. Durante o desenvolvimento da extensão **Área de Transferência Lateral**, ferramentas de Inteligência Artificial (IA) foram utilizadas como assistentes no fluxo de trabalho (pair-programming), atuando estritamente para acelerar etapas de codificação, diagnosticar erros e lidar com tarefas repetitivas.

**Como a IA foi utilizada neste projeto:**

* **Desenvolvimento e APIs:** Auxílio na estruturação do código padrão em Vanilla JavaScript, HTML e CSS, além de pesquisas de sintaxe para a implementação das APIs mais recentes do Manifest V3 do Chrome (como `chrome.sidePanel` e `chrome.storage`).
* **Resolução de Problemas (Debugging):** Diagnóstico e sugestões de correção para comportamentos assíncronos e erros nativos do navegador (ex: contorno do erro *"Extension context invalidated"* nos scripts de conteúdo).
* **Documentação e Lançamentos:** Elaboração dos rascunhos para este `README.md`, formatação padronizada das Notas de Lançamento (Release Notes) no GitHub.

**Supervisão e Direção Humana:**

Embora a IA tenha acelerado significativamente o fluxo de trabalho e eliminado atritos técnicos, toda a idealização, definição das regras, testes práticos e decisões arquitetônicas foram inteiramente conduzidas e validadas por intervenção humana. A IA serviu como uma ferramenta complementar de apoio à execução, permitindo que o foco do desenvolvimento permanecesse na usabilidade, estabilidade e na criação de valor real para o usuário final.
