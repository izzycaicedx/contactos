const btnAgregar     = document.getElementById("agregar");
const lista          = document.getElementById("lista-contactos");
const spinner        = document.getElementById("loading-spinner");
 
function getContactos() {
    return JSON.parse(localStorage.getItem("contactos") || "[]");
}
 
function guardarContactos(arr) {
    localStorage.setItem("contactos", JSON.stringify(arr));
}
 
function mostrarSpinner() {
    spinner.style.display = "block";
}
 
function ocultarSpinner() {
    spinner.style.display = "none";
}
 
function validarCampos() {
    const nombre   = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const ciudad   = document.getElementById("ciudad").value.trim();
    const correo   = document.getElementById("correo").value.trim();
 
    if (!nombre || !apellido || !telefono || !ciudad || !correo) {
        alert("Por favor completa todos los campos.");
        return false;
    }
    return true;
}
 
function mostrarContactos() {
    const contactos = getContactos();
    lista.innerHTML = "";
 
    contactos.forEach(function(contacto, indice) {
        const icono = contacto.genero === "femenino" ? "👩" : "👨";
 
        const li = document.createElement("li");
        li.innerHTML = icono + " " + contacto.nombre + " " + contacto.apellido + " - " + contacto.ciudad +
            ' <button onclick="eliminar(' + indice + ')">🗑️</button>' +
            ' <button onclick="editar(' + indice + ')">✏️</button>';
 
        lista.appendChild(li);
    });
}
 
btnAgregar.addEventListener("click", function() {
    if (!validarCampos()) return;
 
    const genero = document.querySelector('input[name="genero"]:checked');
    if (!genero) {
        alert("Selecciona un género.");
        return;
    }
 
    mostrarSpinner();
 
    setTimeout(function() {
        const contacto = {
            nombre:   document.getElementById("nombre").value.trim(),
            apellido: document.getElementById("apellido").value.trim(),
            telefono: document.getElementById("telefono").value.trim(),
            ciudad:   document.getElementById("ciudad").value.trim(),
            correo:   document.getElementById("correo").value.trim(),
            genero:   genero.value
        };
 
        const contactos = getContactos();
        contactos.push(contacto);
        guardarContactos(contactos);
 
        document.getElementById("nombre").value   = "";
        document.getElementById("apellido").value = "";
        document.getElementById("telefono").value = "";
        document.getElementById("ciudad").value   = "";
        document.getElementById("correo").value   = "";
        document.querySelectorAll('input[name="genero"]').forEach(function(r) { r.checked = false; });
 
        ocultarSpinner();
        mostrarContactos();
    }, 1000);
});
 
function eliminar(indice) {
    if (!confirm("¿Deseas eliminar este contacto?")) return;
 
    const contactos = getContactos();
    contactos.splice(indice, 1);
    guardarContactos(contactos);
    mostrarContactos();
}
 
function editar(indice) {
    const contactos = getContactos();
    const c = contactos[indice];
 
    document.getElementById("nombre").value   = c.nombre;
    document.getElementById("apellido").value = c.apellido;
    document.getElementById("telefono").value = c.telefono;
    document.getElementById("ciudad").value   = c.ciudad;
    document.getElementById("correo").value   = c.correo;
    document.querySelector('input[name="genero"][value="' + c.genero + '"]').checked = true;
 
    contactos.splice(indice, 1);
    guardarContactos(contactos);
    mostrarContactos();
}
 
mostrarContactos();