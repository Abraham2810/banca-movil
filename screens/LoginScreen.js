import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TextInput } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isFormValid = email && password;
  
  const handleLogin = () => {
    if (!email || !password){
      Alert.alert('Error', 'Introduzca un correo electronico y una contraseña.');
    }else {
      navigation.navigate('Menu');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Iniciar Sesión </Text>
      <TextInput
      style={styles.input}
      placeholder="Correo Electronico"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
      />
      <TextInput
      style={styles.input}
      placeholder="Contraseña"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
      />
      <Button title="Iniciar Sesión" onPress={handleLogin} disabled={!isFormValid} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40, 
    borderColor: '#ccc',
    borderWidth: 1, 
    marginBottom: 15,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  button:{
    padding: 50,
  },
});

export default LoginScreen;