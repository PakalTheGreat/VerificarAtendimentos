/**
 * Nome da Extensão
 * Autor: Lucas Bouvie
 * Contato: lucas.bouvie@ixcsoft.com.br
 * Descrição: Extensão para puxar atendimentos, enviar saudação e contabilizar clientes que entrarm em contato
 * Data: 2024
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Mensagem recebida no content script:", request.action);
    if (request.action === "startChecking") {
        console.log("Iniciando a verificação...");
        startChecking()
    } else if (request.action === "stopChecking") {
        console.log("Parando a verificação...");
        stopChecking();
    } else if (request.action === "countAttendances") {
        console.log("Iniciando a contagem de atendimentos...");
        countAttendances();
    }
});

let checkInterval

function startChecking() {
    checkInterval = setInterval(checkNotifications, 400);
    console.log("Disparo startChecking.");
}

function checkNotifications() {
    console.log("Verificação em andamento...");
    let notificationDiv = document.querySelector("#container > div.menu > div:nth-child(4) > div")
    if (notificationDiv && parseInt(notificationDiv.textContent.trim()) > 0) {
        console.log("Notificação encontrada, executando ações...");
        clearInterval(checkInterval);
        performClickActions();
    }
}

function performClickActions() {
    console.log("Função iniciou.");
    let homeIcon = document.querySelector("#container > div.menu > div:nth-child(3) > i");
    console.log("Iniciando IF do seletor e posterior clique.");
    if (homeIcon) {
        homeIcon.click();
        console.log("Clique no ícone da casa realizado.");
        setTimeout(clickNextInQueueButton, 200); 
    }
}
function clickNextInQueueButton() {
    const checkButtonLoaded = setInterval(() => {
        let nextInQueueButton = document.querySelector("#paginaDash > div:nth-child(3) > button");
        if (nextInQueueButton && nextInQueueButton.offsetParent !== null) {
            clearInterval(checkButtonLoaded);
            nextInQueueButton.click();
            console.log("Clique no botão da fila de espera realizado.");
            sendGreetingMessage();
            console.log("Função mensagem automática disparada.");
        }
    }, 500); 
}


function sendGreetingMessage() {
    console.log("Função disparada. Aguardando 1 segundo antes de iniciar as ações...");

    setTimeout(() => {
        console.log("Iniciando a execução após 1 segundo...");
        const hour = new Date().getHours();
        let message;

        if (hour < 12) {
            message = "Bom dia, tudo bem? Como posso te auxiliar hoje?";
        } else if (hour >= 12 && hour < 18) {
            message = "Boa tarde, tudo bem? Como posso te auxiliar hoje?";
        } else {
            message = "Boa noite, tudo bem? Como posso te auxiliar hoje?";
        }

        const inputField = document.querySelector("#input_envio_msg");
        if (inputField) {
            inputField.innerText = message; // Usar innerText para um div com contenteditable
            const sendButton = document.querySelector("#container > div.dialog.chat > div.dialog_dados > div.rodape > div.button");
            if (sendButton) {
                sendButton.click();
            }
        }
    }, 1000); 
}



function stopChecking() {
    clearInterval(checkInterval);
    console.log("Verificação interrompida.");
}

function handleReload() {
    chrome.runtime.sendMessage({ action: "pageReloaded" });
    console.log("Página recarregada, enviando mensagem para background.");
}

window.addEventListener('load', handleReload);

// Nova função para contar atendimentos
function countAttendances() {
    const elements = document.querySelectorAll(".data_hora_ultima_msg");

    
    let clientsCount = 0;

    elements.forEach(element => {
        const timeText = element.textContent.trim();
        if (timeText.match(/^\d+:\d+$/)) { // Verifica se é um horário
            clientsCount++;
        }
    });

  
    chrome.runtime.sendMessage({ action: "updateCounts", clientsCount });
}