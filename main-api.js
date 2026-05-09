const API_URL = "https://7t678dqz-3000.use2.devtunnels.ms/api/contacts";

const btnAgregar = document.getElementById("agregar");
const lista      = document.getElementById("lista-contactos");
const spinner    = document.getElementById("loading-spinner");

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

async function mostrarContactos() {
    try {
        mostrarSpinner();
        const response  = await fetch(API_URL);
        const contactos = await response.json();
        lista.innerHTML = "";

        contactos.forEach(function(contacto) {
            const icono = contacto.sex === "femenino" ? "👩" : "👨";
            const li = document.createElement("li");
            li.innerHTML = icono + " " + contacto.name + " " + contacto.lastname + " - " + contacto.city +
                ' <button onclick="eliminar(' + contacto.id + ')">🗑️</button>' +
                ' <button onclick="editar(' + contacto.id + ')">✏️</button>';
            lista.appendChild(li);
        });

        ocultarSpinner();
    } catch (error) {
        console.log(error);
        ocultarSpinner();
        alert("No se pudo conectar con el servidor.");
    }
}

btnAgregar.addEventListener("click", function() {
    if (!validarCampos()) return;

    const genero = document.querySelector('input[name="genero"]:checked');
    if (!genero) {
        alert("Selecciona un género.");
        return;
    }

    mostrarSpinner();

    const contacto = {
        name:     document.getElementById("nombre").value.trim(),
        lastname: document.getElementById("apellido").value.trim(),
        phone:    document.getElementById("telefono").value.trim(),
        city:     document.getElementById("ciudad").value.trim(),
        address:  document.getElementById("correo").value.trim(),
        sex:      genero.value
    };

    fetch(API_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(contacto)
    })
    .then(function() {
        document.getElementById("nombre").value   = "";
        document.getElementById("apellido").value = "";
        document.getElementById("telefono").value = "";
        document.getElementById("ciudad").value   = "";
        document.getElementById("correo").value   = "";
        document.querySelectorAll('input[name="genero"]').forEach(function(r) { r.checked = false; });
        ocultarSpinner();
        mostrarContactos();
    })
    .catch(function(error) {
        console.log(error);
        ocultarSpinner();
        alert("Error al agregar contacto.");
    });
});

function eliminar(id) {
    if (!confirm("¿Deseas eliminar este contacto?")) return;

    fetch(API_URL + "/" + id, { method: "DELETE" })
    .then(function() {
        mostrarContactos();
    })
    .catch(function(error) {
        console.log(error);
        alert("Error al eliminar contacto.");
    });
}

async function editar(id) {
    try {
        const response = await fetch(API_URL + "/" + id);
        const c        = await response.json();

        document.getElementById("nombre").value   = c.name;
        document.getElementById("apellido").value = c.lastname;
        document.getElementById("telefono").value = c.phone;
        document.getElementById("ciudad").value   = c.city;
        document.getElementById("correo").value   = c.address;
        document.querySelector('input[name="genero"][value="' + c.sex + '"]').checked = true;

        await fetch(API_URL + "/" + id, { method: "DELETE" });
        mostrarContactos();
    } catch (error) {
        console.log(error);
        alert("Error al editar contacto.");
    }
}

mostrarContactos();