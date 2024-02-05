chrome.runtime.sendMessage({ 
    type: 'contentScriptResult',  
    content: document.querySelector('[data-track-load="description_content"]').textContent,
    userLanguage: document.querySelector('[class="rounded items-center whitespace-nowrap focus:outline-none inline-flex bg-transparent dark:bg-dark-transparent text-text-secondary dark:text-text-secondary active:bg-transparent dark:active:bg-dark-transparent hover:bg-fill-secondary dark:hover:bg-fill-secondary px-1.5 py-0.5 text-sm font-normal group"]').textContent,
    currentSolution: Array.from(document.querySelectorAll('.view-lines.monaco-mouse-cursor-text .view-line')).slice(0, -1).map(viewLine => viewLine.textContent.trim()).join('\n')
});
