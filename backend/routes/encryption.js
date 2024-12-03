const bcrypt = require('bcrypt');

async function encryptPassword(password) {
  try {
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
    throw error;
  }
}

async function verifyPassword(plainPassword, hashedPassword) {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (error) {
    console.error('Error al verificar la contraseña:', error);
    throw error;
  }
}

module.exports = { encryptPassword, verifyPassword };
