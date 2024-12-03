const express = require('express');
const mysql = require('mysql2');
const { authenticateToken, generateToken } = require('./routes/auth');
const { encryptPassword, verifyPassword } = require('./routes/encryption'); 

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'banca_movil',
});

app.use(express.json());

app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await encryptPassword(password);

    db.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error al registrar el usuario.' });
        }
        res.status(200).json({ message: 'Usuario registrado con éxito.' });
      }
    );
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
    if (err) {
      console.error('Error al buscar usuario:', err);
      return res.status(500).json({ message: 'Error en el servidor.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Correo electrónico no encontrado.' });
    }

    const user = result[0];

    try {
      const match = await verifyPassword(password, user.password);
      if (match) {
        const token = generateToken({ id: user.id, email: user.email });
        return res.status(200).json({ message: 'Inicio de sesión exitoso.', token });
      } else {
        return res.status(401).json({ message: 'Contraseña incorrecta.' });
      }
    } catch (err) {
      console.error('Error al verificar la contraseña:', err);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  });
});

app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Acceso permitido.', user: req.user });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});
