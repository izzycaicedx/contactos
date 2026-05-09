const express = require("express");
const cors = require("cors");
const db = require("./db");
const path = require('path');


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));


app.get("/api/contacts", (req, res) => {
  try {
    const contacts = db.prepare("SELECT * FROM contacts ORDER BY id ASC").all();
    res.status(200).json(contacts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error obteniendo contactos" });
  }
});

app.get("/api/contacts/:id", (req, res) => {
  try {
    const id = req.params.id;
    const contact = db.prepare("SELECT * FROM contacts WHERE id = ?").get(id);
    if (!contact) {
      return res.status(404).json({ error: "Contacto no encontrado" });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error obteniendo contacto" });
  }
});

app.post("/api/contacts", (req, res) => {
  try {
    const { name, lastname, sex, phone, city, address } = req.body;
    if (!name || !lastname || !phone) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    const result = db.prepare(`
      INSERT INTO contacts (name, lastname, sex, phone, city, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, lastname, sex || 'other', phone, city || '', address || '');
    const newContact = db.prepare("SELECT * FROM contacts WHERE id = ?")
                         .get(result.lastInsertRowid);
    res.status(201).json(newContact);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creando contacto" });
  }
});

app.put("/api/contacts/:id", (req, res) => {
  try {
    const id = req.params.id;
    const { name, lastname, sex, phone, city, address } = req.body;
    const contact = db.prepare("SELECT * FROM contacts WHERE id = ?").get(id);
    if (!contact) {
      return res.status(404).json({ error: "Contacto no encontrado" });
    }
    db.prepare(`
      UPDATE contacts
      SET name = ?, lastname = ?, sex = ?, phone = ?, city = ?, address = ?
      WHERE id = ?
    `).run(
      name     || contact.name,
      lastname || contact.lastname,
      sex      || contact.sex,
      phone    || contact.phone,
      city     || contact.city,
      address  || contact.address,
      id
    );
    const updatedContact = db.prepare("SELECT * FROM contacts WHERE id = ?").get(id);
    res.status(200).json(updatedContact);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error actualizando contacto" });
  }
});

app.delete("/api/contacts/:id", (req, res) => {
  try {
    const id = req.params.id;
    const contact = db.prepare("SELECT * FROM contacts WHERE id = ?").get(id);
    if (!contact) {
      return res.status(404).json({ error: "Contacto no encontrado" });
    }
    db.prepare("DELETE FROM contacts WHERE id = ?").run(id);
    res.status(200).json({ 
      message: "Contacto eliminado exitosamente",
      deleted: contact
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error eliminando contacto" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 API lista en http://localhost:${PORT}/api/contacts`);
});