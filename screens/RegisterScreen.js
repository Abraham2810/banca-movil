import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');

  const isFormValid = firstName && lastName && email && password && passwordConf;

  const handleRegister = () => {
    if (password !== passwordConf) {
      alert('Las contraseñas no coinciden');
      return;
    }
    console.log('User registered:', { firstName, lastName, email, password });
    navigation.navigate('Login');
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electronico"
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


      <Button title="Registrarse" onPress={handleRegister} disabled={!isFormValid} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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
