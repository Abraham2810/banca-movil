import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MenuScreen = ({ navigation }) => {
  const [accountBalance, setAccountBalance] = useState(null);

  const getBalance = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        Alert.alert('Error', 'No se ha encontrado el token de autenticación.');
        return;
      }

      const response = await fetch('http://192.168.1.68:3000/getBalance', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        const balance = parseFloat(data.balance); 

        if (!isNaN(balance)) {
          setAccountBalance(balance.toFixed(2));  
        } else {
          Alert.alert('Error', 'Saldo no es un número válido');
        }
      } else {
        Alert.alert('Error', data.message || 'Error al obtener el saldo');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
      console.error('Error de conexión:', error);
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú de inicio</Text>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Saldo actual:</Text>
        <Text style={styles.balanceAmount}>
          {accountBalance !== null ? `$${accountBalance}` : 'Cargando...'}
        </Text>
      </View>

      <Button
        title="Transferir"
        onPress={() => navigation.navigate('GenerateQR')}
      />
      <Button
        title="Historial de movimientos"
        onPress={() => navigation.navigate('Movements')}
      />
      <Button
        title="Cerrar sesión"
        color="#c00"
        onPress={() => navigation.navigate('Welcome')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  balanceContainer: {
    justifyContent: 'center',
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  balanceText: {
    fontSize: 18,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default MenuScreen;