require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5433,
});

pool.connect()
    .then(() => console.log('✅ Conectado a PostgreSQL'))
    .catch(err => {
        console.error('❌ Error al conectar a PostgreSQL:', err);
        process.exit(1);
    });

// Registro de usuario
app.post('/register', async (req, res) => {
    const { username, email, password, edad, altura, peso, sexo, telefono } = req.body;
    if (!username || !email || !password || !edad || !altura || !peso || !sexo || !telefono) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO users (username, email, password, edad, altura, peso, sexo, telefono)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id`;
        const result = await pool.query(query, [username, email, hashedPassword, edad, altura, peso, sexo, telefono]);
        res.status(201).json({ message: "Usuario registrado correctamente", userId: result.rows[0].id });
    } catch (err) {
        console.error('❌ Error en el registro:', err);
        res.status(500).json({ error: 'Error en el registro' });
    }
});

// Inicio de sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length > 0) {
            const match = await bcrypt.compare(password, result.rows[0].password);
            if (match) {
                res.status(200).json({ message: "Inicio de sesión exitoso", user: result.rows[0] });
            } else {
                res.status(401).json({ error: "Contraseña incorrecta" });
            }
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (err) {
        console.error('❌ Error en el login:', err);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
});

// Obtener datos del usuario
app.get('/user/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await pool.query("SELECT username, email, edad, altura, peso, sexo, telefono FROM users WHERE id = $1", [userId]);
        if (result.rows.length > 0) {
            res.status(200).json({ user: result.rows[0] });
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (err) {
        console.error('❌ Error al obtener usuario:', err);
        res.status(500).json({ error: 'Error al obtener datos del usuario' });
    }
});

// Actualizar perfil del usuario
app.put('/update-profile/:id', async (req, res) => {
    const userId = req.params.id;
    const { username, email, edad, altura, peso, sexo, telefono } = req.body;
    try {
        await pool.query(
            "UPDATE users SET username = $1, email = $2, edad = $3, altura = $4, peso = $5, sexo = $6, telefono = $7 WHERE id = $8",
            [username, email, edad, altura, peso, sexo, telefono, userId]
        );
        res.status(200).json({ message: "Perfil actualizado correctamente" });
    } catch (err) {
        console.error('❌ Error al actualizar perfil:', err);
        res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});