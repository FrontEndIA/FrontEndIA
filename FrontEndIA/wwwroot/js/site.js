//#region Modelo gpt 3.5 Turbo
let currentThreadId = null;

document.getElementById('sendRequest').addEventListener('click', function () {
    const API_KEY = 'YOUR_API_KEY';  // Reemplaza con tu clave API
    const ASSISTANT_ID = 'YOUR_ASSISTANT_ID';  // Reemplaza con tu assistant_id

    const userMessage = document.getElementById('userMessage').value;
    if (!userMessage) {
        alert("Por favor, escribe un mensaje.");
        return;
    }

    if (currentThreadId) {
        sendMessageToThread(userMessage, currentThreadId, API_KEY, ASSISTANT_ID);
    } else {
        startNewThread(userMessage, ASSISTANT_ID, API_KEY);
    }
    // Vaciar el textarea después de enviar el mensaje
    document.getElementById('userMessage').value = '';
});

function startNewThread(userMessage, assistantId, apiKey) {
    const API_URL = 'https://api.openai.com/v1/threads/runs';

    const requestData = {
        assistant_id: assistantId,
        model: "gpt-3.5-turbo",
        thread: {
            messages: [
                { role: "user", content: userMessage }
            ]
        }
    };

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
    };

    // Mostrar el mensaje del usuario y el icono de carga
    addMessageToUI('User', userMessage, 'user');
    const loadingIcon = document.createElement('div');
    loadingIcon.className = 'loading';
    document.getElementById('response').appendChild(loadingIcon);

    fetch(API_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.id && data.thread_id) {
                currentThreadId = data.thread_id;
                checkStatus(currentThreadId, data.id, apiKey);
            } else {
                loadingIcon.remove();
                addMessageToUI('Error', 'No se pudo iniciar la ejecución.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            loadingIcon.remove();
            addMessageToUI('Error', `Error: ${error}`, 'error');
        });
}

function sendMessageToThread(userMessage, threadId, apiKey, assistantId) {
    const API_URL = `https://api.openai.com/v1/threads/${threadId}/messages`;

    const requestData = {
        role: "user",
        content: userMessage
    };

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
    };

    // Mostrar el mensaje del usuario y el icono de carga
    addMessageToUI('User', userMessage, 'user');
    const loadingIcon = document.createElement('div');
    loadingIcon.className = 'loading';
    document.getElementById('response').appendChild(loadingIcon);

    fetch(API_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.id) {
                createRunForThread(threadId, assistantId, apiKey);
            } else {
                loadingIcon.remove();
                addMessageToUI('Error', 'No se pudo enviar el mensaje.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            loadingIcon.remove();
            addMessageToUI('Error', `Error: ${error}`, 'error');
        });
}

function createRunForThread(threadId, assistantId, apiKey) {
    const API_URL = `https://api.openai.com/v1/threads/${threadId}/runs`;

    const requestData = {
        assistant_id: assistantId,
        model: "gpt-3.5-turbo",
    };

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
    };

    fetch(API_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.id) {
                checkStatus(threadId, data.id, apiKey);
            } else {
                const loadingIcon = document.querySelector('.loading');
                if (loadingIcon) {
                    loadingIcon.remove();
                }
                addMessageToUI('Error', 'No se pudo crear la ejecución.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const loadingIcon = document.querySelector('.loading');
            if (loadingIcon) {
                loadingIcon.remove();
            }
            addMessageToUI('Error', `Error: ${error}`, 'error');
        });
}

function checkStatus(threadId, runId, apiKey) {
    const CHECK_URL = `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`;

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
    };

    fetch(CHECK_URL, {
        method: 'GET',
        headers: headers
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.status === 'completed') {
                fetchMessages(threadId, apiKey);
            } else {
                setTimeout(() => checkStatus(threadId, runId, apiKey), 2000);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const loadingIcon = document.querySelector('.loading');
            if (loadingIcon) {
                loadingIcon.remove();
            }
            addMessageToUI('Error', `Error: ${error}`, 'error');
        });
}

function fetchMessages(threadId, apiKey) {
    const MESSAGES_URL = `https://api.openai.com/v1/threads/${threadId}/messages`;

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
    };

    fetch(MESSAGES_URL, {
        method: 'GET',
        headers: headers
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            const responseElement = document.getElementById('response');

            // Limpiar el contenido existente y mostrar todos los mensajes en orden
            responseElement.textContent = '';

            data.data.reverse().forEach(message => {
                const role = message.role === 'assistant' ? 'Assistant' : 'User';
                const content = message.content.map(c => c.text.value).join("\n");
                addMessageToUI(role, content, message.role);
            });

            const loadingIcon = document.querySelector('.loading');
            if (loadingIcon) {
                loadingIcon.remove();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const loadingIcon = document.querySelector('.loading');
            if (loadingIcon) {
                loadingIcon.remove();
            }
            addMessageToUI('Error', `Error: ${error}`, 'error');
        });
}

function addMessageToUI(role, content, messageType) {
    const responseElement = document.getElementById('response');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${messageType}`;
    messageElement.textContent = `${role}: ${content}`;

    // Asegurarse de que no tenga borde, relleno, fondo, margen, ni sombra
    messageElement.style.border = 'none';
    messageElement.style.padding = '10px';  // Asegurar relleno
    messageElement.style.background = 'none';
    messageElement.style.margin = '5px 0';  // Reducir margen entre mensajes
    messageElement.style.boxShadow = 'none';
    messageElement.style.borderRadius = '10px';  // Bordes redondeados

    responseElement.appendChild(messageElement);
}

//#endregion