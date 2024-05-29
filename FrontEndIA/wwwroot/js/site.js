// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
// Obtener el modal
var modal = document.getElementById("modal");
var btn = document.getElementById("button3");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

var enviarBtn = document.getElementById("button1");

enviarBtn.addEventListener("click", async function () {
    var mensaje = document.getElementById("usrbox").value;

    if (mensaje.trim() === "") {
        alert("El mensaje no puede estar vacío.");
        return;
    }

    document.getElementById("usrbox").disabled = true;
    enviarBtn.disabled = true;

    try {
        await Promise.all([
            handleMessage('https://api.caceres.com/api/AssistantOpenAiV2/v2', 'clave_api_gpt35_turbo', mensaje, 'answer1'),
            handleMessage('https://api.caceres.com/api/AssistantOpenAiV2/v2', 'clave_api_gpt35_turbo_entrenado', mensaje, 'answer2')
        ]);
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
    }
});

async function handleMessage(apiURL, apiKey, mensaje, respuestaId) {
    try {
        const threadId = await createThread(apiURL, apiKey);
        const messageId = await createMessage(apiURL, apiKey, threadId, mensaje);
        const respuesta = await retrieveMessage(apiURL, apiKey, threadId, messageId);
        document.getElementById(respuestaId).innerText = respuesta;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById(respuestaId).innerText = `Error: ${error.message}`;
    }
}

async function createThread(apiURL, apiKey) {
    const response = await fetch(`${apiURL}/CreateThread`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }
    });
    if (!response.ok) {
        throw new Error('Error al crear el hilo');
    }
    const data = await response.json();
    return data.threadId;
}

async function createMessage(apiURL, apiKey, threadId, mensaje) {
    const response = await fetch(`${apiURL}/CreateMessage/${threadId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            content: mensaje
        })
    });
    if (!response.ok) {
        throw new Error('Error al crear el mensaje');
    }
    const data = await response.json();
    return data.messageId;
}

async function retrieveMessage(apiURL, apiKey, threadId, messageId) {
    const response = await fetch(`${apiURL}/RetrieveMessage/${threadId}/${messageId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }
    });
    if (!response.ok) {
        throw new Error('Error al recuperar el mensaje');
    }
    const data = await response.json();
    return data.content;
}

var nuevaConversacionBtn = document.getElementById("button2");
nuevaConversacionBtn.addEventListener("click", function () {
    document.getElementById("usrbox").value = "";
    limpiarRespuestas();
    document.getElementById("usrbox").disabled = false;
    enviarBtn.disabled = false;
});

function limpiarRespuestas() {
    document.getElementById("answer1").innerText = "";
    document.getElementById("answer2").innerText = "";
}

// Manejar las valoraciones
var button4 = document.getElementById("button4");
var button5 = document.getElementById("button5");

button4.addEventListener("click", function () {
    valorarRespuesta("GPT-3.5 Turbo");
});

button5.addEventListener("click", function () {
    valorarRespuesta("GPT-3.5 Turbo entrenado");
});

function valorarRespuesta(asistente) {
    alert(`Has valorado que ${asistente} ha respondido mejor.`);
    modal.style.display = "none";
}