const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'banca_movil',
});
app.use(express.json());
// Register
app.post('/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  db.query(
    'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
    [firstName, lastName, email, password],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al registrar el usuario.' });
      }
      res.status(200).json({ message: 'Usuario registrado con éxito.' });
    }
  );
});
// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) {
      console.error('Error al buscar usuario:', err);
      return res.status(500).json({ message: 'Error en el servidor.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Correo electrónico no encontrado.' });
    }

    const user = result[0];
    if (user.password === password) {
      return res.status(200).json({ message: 'Inicio de sesión exitoso.' });
    } else {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});
