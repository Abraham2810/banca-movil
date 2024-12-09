import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const isFormValid = email.trim() && password.trim();

  const handleLogin = async () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Por favor, ingrese su correo electrónico y contraseña.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.71:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', data.message);
        await AsyncStorage.setItem('userToken', data.token);
        navigation.navigate('Menu');
      } else {
        Alert.alert('Error', data.message || 'Error desconocido.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
      console.error('Error de conexión:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        borderColor= "#888888"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        borderColor="#888888"
      />
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: loading
              ? '#B0BEC5'
              : isFormValid
              ? '#6F028A'
              : '#B0BEC5',
          },
        ]}
        onPress={handleLogin}
        disabled={!isFormValid || loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Iniciar Sesión'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#CBD7D7',
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
  button: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 50,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LoginScreen;