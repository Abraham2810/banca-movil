import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const isFormValid = firstName.trim() && lastName.trim() && email.trim() && password.trim() && passwordConf.trim();
  const handleRegister = async () => {
    if (password !== passwordConf) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    try {
      const response = await fetch('http://172.17.212.42:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', data.message);
        navigation.navigate('Welcome');
      } else {
        Alert.alert('Error', data.message || 'Error desconocido.');
      }
    } catch (error) {
      console.error('Error en la conexión:', error);
      Alert.alert('Error', 'Hubo un problema al registrar el usuario.');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre(s)"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellidos"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        value={passwordConf}
        onChangeText={setPasswordConf}
        secureTextEntry={true}
      />
      <Button
        title="Registrarse"
        onPress={handleRegister}
        disabled={!isFormValid}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 10,
  },
});