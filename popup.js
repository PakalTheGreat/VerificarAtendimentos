/**
 * Nome da Extensão
 * Autor: Lucas Bouvie
 * Contato: lucas.bouvie@ixcsoft.com.br
 * Descrição: Extensão para puxar atendimentos, enviar saudação e contabilizar clientes que entrarm em contato
 * Data: 2024
 */

let checkInterval;

document.getElementById('startButton').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "startChecking" });
    console.log("Iniciando a verificação a partir do popup.");
    document.getElementById('startButton').disabled = true;
    document.getElementById('stopButton').disabled = false;
});

document.getElementById('stopButton').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "stopChecking" });
    console.log("Parando a verificação a partir do popup.");
    document.getElementById('startButton').disabled = false;
    document.getElementById('stopButton').disabled = true;
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "resetButtons") {
        document.getElementById('startButton').disabled = false;
        document.getElementById('stopButton').disabled = true;
        console.log("Botões resetados no popup.");
    }
});

// chamada para botão de Contabilizar Atendimentos
document.getElementById('countButton').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "countAttendances" });
});

// listener para atualizar a contagem de atendimentos no popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateCounts") {
        document.getElementById('clientsCount').textContent = request.clientsCount;
        //lógica para 'assumidos', validar erro e remover comentario depois
        //document.getElementById('assumedCount').textContent = request.assumedCount;
    }
});
