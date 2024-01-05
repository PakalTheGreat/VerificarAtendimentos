/**
 * Nome da Extensão
 * Autor: Lucas Bouvie
 * Contato: lucas.bouvie@ixcsoft.com.br
 * Descrição: Extensão para puxar atendimentos, enviar saudação e contabilizar clientes que entrarm em contato
 * Data: 2024
 */

let checkInterval;

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extensão instalada.');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Mensagem recebida no background script:", request.action);
    if (request.action === "startChecking" || request.action === "stopChecking" || request.action === "countAttendances") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, request);
            console.log("Mensagem enviada para o content script.");
        });
    }
});

function startChecking() {
    chrome.tabs.sendMessage({ action: "startChecking" });
}

function stopChecking() {
    chrome.tabs.sendMessage({ action: "stopChecking" });
}
