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
document.getElementById('newRequest').addEventListener('click', function () {
    location.reload(); // Recargar la página
});

function valorarRespuesta(asistente) {
    alert(`Has valorado que ${asistente} ha respondido mejor.`);
    modal.style.display = "none";
}