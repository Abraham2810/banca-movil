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
      'INSERT INTO users (user_name, user_lastname, user_email, user_password) VALUES (?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error al registrar el usuario.' });
        }

        const userId = result.insertId; 

        db.query(
          'INSERT INTO accounts (user_id, balance) VALUES (?, ?)',
          [userId, 100], 
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Error al crear la cuenta del usuario.' });
            }

            res.status(200).json({ message: 'Usuario registrado con éxito y cuenta creada con saldo inicial de 100.' });
          }
        );
      }
    );
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE user_email = ?', [email], async (err, result) => {
    if (err) {
      console.error('Error al buscar usuario:', err);
      return res.status(500).json({ message: 'Error en el servidor.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Correo electrónico no encontrado.' });
    }

    const user = result[0];

    try {
      const match = await verifyPassword(password, user.user_password);
      if (match) {
        const token = generateToken({ id: user.id, email: user.user_email });
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

app.get('/getBalance', authenticateToken, (req, res) => {
  const userId = req.user.id; 

  db.query('SELECT user_balance, user_name, user_lastname FROM users WHERE id = ?', [userId], (err, result) => {
    if (err) {
      console.error('Error al obtener el saldo:', err);
      return res.status(500).json({ message: 'Error al obtener el saldo.' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const user = result[0];
    res.status(200).json({
      balance: user.user_balance,
      userId: userId,
      firstName: user.user_name,
      lastName: user.user_lastname
    });
  });
});

app.post('/transfer', authenticateToken, (req, res) => {
  const { fromUserId, toUserId, amount } = req.body;

  if (!fromUserId || !toUserId || !amount) {
    return res.status(400).json({ message: 'Datos incompletos.' });
  }

  db.query('SELECT * FROM users WHERE id = ?', [fromUserId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al verificar el usuario.' });
    }

    const sender = result[0];
    if (sender.user_balance < amount) {
      return res.status(400).json({ message: 'Saldo insuficiente.' });
    }

    db.query('UPDATE users SET user_balance = user_balance - ? WHERE id = ?', [amount, fromUserId], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al actualizar el saldo del remitente.' });
      }

      db.query('UPDATE users SET user_balance = user_balance + ? WHERE id = ?', [amount, toUserId], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error al actualizar el saldo del receptor.' });
        }

        res.status(200).json({ message: 'Transferencia realizada con éxito.' });
      });
    });
  });
});


app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});