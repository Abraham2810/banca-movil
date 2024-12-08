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

// Ruta para registro de usuario
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
          [userId, 100], // Saldo inicial de 100
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

// Ruta para realizar una transferencia
app.post('/transfer', authenticateToken, (req, res) => {
  const { fromUserId, toUserId, amount } = req.body;

  if (!fromUserId || !toUserId || !amount) {
    return res.status(400).json({ message: 'Datos incompletos.' });
  }

  // Comenzamos una transacción para asegurar que ambas actualizaciones de saldo sean atómicas
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error al iniciar transacción:', err);
      return res.status(500).json({ message: 'Error al iniciar la transacción.' });
    }

    // Verificar el saldo del remitente
    db.query('SELECT user_balance FROM users WHERE id = ?', [fromUserId], (err, result) => {
      if (err) {
        console.error('Error al verificar saldo del remitente:', err);
        return db.rollback(() => {
          res.status(500).json({ message: 'Error al verificar saldo del remitente.' });
        });
      }
    
      if (result.length === 0) {
        return db.rollback(() => {
          res.status(404).json({ message: 'El remitente no existe.' });
        });
      }
    
      const sender = result[0];
    
      if (sender.user_balance < amount) {
        return db.rollback(() => {
          res.status(400).json({ message: 'Saldo insuficiente.' });
        });
      }

      // Actualizar saldo del remitente
      db.query('UPDATE users SET user_balance = user_balance - ? WHERE id = ?', [amount, fromUserId], (err) => {
        if (err) {
          console.error('Error al actualizar saldo del remitente:', err);
          return db.rollback(() => {
            res.status(500).json({ message: 'Error al actualizar saldo del remitente.' });
          });
        }
      
        db.query('UPDATE users SET user_balance = user_balance + ? WHERE id = ?', [amount, toUserId], (err) => {
          if (err) {
            console.error('Error al actualizar saldo del receptor:', err);
            return db.rollback(() => {
              res.status(500).json({ message: 'Error al actualizar saldo del receptor.' });
            });
          }

          // Registrar el movimiento en la tabla movements
          db.query(
            'INSERT INTO movements (from_user_id, to_user_id, amount) VALUES (?, ?, ?)',
            [fromUserId, toUserId, amount],
            (err) => {
              if (err) {
                console.error('Error al registrar el movimiento de transferencia:', err);
                return db.rollback(() => {
                  res.status(500).json({ message: 'Error al registrar el movimiento de transferencia.' });
                });
              }

              // Confirmar la transacción
              db.commit((err) => {
                if (err) {
                  console.error('Error al confirmar transacción:', err);
                  return db.rollback(() => {
                    res.status(500).json({ message: 'Error al confirmar la transacción.' });
                  });
                }

                res.status(200).json({ message: 'Transferencia realizada con éxito.' });
              });
            }
          );
        });
      });
    });
  });
});

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});
