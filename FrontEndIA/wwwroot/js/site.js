// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
// Obtener el modal
var modal = document.getElementById("modal");
// Obtener el botón que abre el modal
var btn = document.getElementById("button3");
// Obtener el elemento <span> que cierra el modal
var span = document.getElementsByClassName("close")[0];
// Cuando el usuario haga clic en el botón, abre el modal
btn.onclick = function () {
    modal.style.display = "block";
}
// Cuando el usuario haga clic en <span> (x), cierra el modal
span.onclick = function () {
    modal.style.display = "none";
}
// Cuando el usuario haga clic fuera del modal, ciérralo
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Obtener referencia al botón "Enviar"
var enviarBtn = document.getElementById("button1");

// Agregar un evento de clic al botón "Enviar"
enviarBtn.addEventListener("click", function () {
    var mensaje = document.getElementById("usrbox").value;

    // Enviar mensaje a la API de OpenAI para el primer asistente
    enviarMensaje(mensaje, 'URL_de_la_API_1', 'clave_de_API_1', 'answer1');

    // Enviar mensaje a la API de OpenAI para el segundo asistente
    enviarMensaje(mensaje, 'URL_de_la_API_2', 'clave_de_API_2', 'answer2');

    // Deshabilitar el textarea después de enviar el mensaje
    document.getElementById("usrbox").disabled = true;

    enviarBtn.disabled = false;
});

// Función para enviar un mensaje a la API de OpenAI
function enviarMensaje(mensaje, apiURL, apiKey, respuestaId) {
    // Simulamos el envío del mensaje ya que no tenemos las claves y URLs de las APIs
    // Aquí deberías realizar una solicitud real a la API de OpenAI
    // Reemplaza 'URL_de_la_API' con la URL de la API proporcionada por tu jefe y 'tu_clave_de_API' con tu clave de API proporcionada por OpenAI
    // Además, asegúrate de manejar correctamente las respuestas y errores de la API en el código real

    // Por ahora, solo mostramos un mensaje de ejemplo
    var respuestaEjemplo = "Esta es una respuesta de ejemplo del asistente para el mensaje: '" + mensaje + "'";
    document.getElementById(respuestaId).innerText = respuestaEjemplo;
}


// Supongamos que recibes las respuestas de los modelos de IA y las guardas en estas variables:
var respuestaModelo1 = " ";
var respuestaModelo2 = " ";

// Actualiza el contenido del primer <div> con id "answer1"
document.getElementById("answer1").innerText = respuestaModelo1;

// Actualiza el contenido del segundo <div> con id "answer2"
document.getElementById("answer2").innerText = respuestaModelo2;

// Obtener referencia al botón "Nueva conversación"
var nuevaConversacionBtn = document.getElementById("button2");
// Agregar un evento de clic al botón
nuevaConversacionBtn.addEventListener("click", function () {
    // Limpiar el contenido del textarea
    document.getElementById("usrbox").value = "";

    // Limpiar el contenido de las respuestas de los asistentes
    limpiarRespuestas();

    document.getElementById("usrbox").disabled = false;

    enviarBtn.disabled = false;
});

// Función para limpiar el contenido de las respuestas de los asistentes
function limpiarRespuestas() {
    document.getElementById("answer1").innerText = "";
    document.getElementById("answer2").innerText = "";
}
