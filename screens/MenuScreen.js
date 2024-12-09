import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MenuScreen = ({ navigation }) => {
  const [accountBalance, setAccountBalance] = useState(null);
  const [userInfo, setUserInfo] = useState({
    userId: null,
    firstName: '',
    lastName: '',
  });

  const getBalance = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'No se ha encontrado el token de autenticación.');
        return;
      }

      const response = await fetch('http://192.168.1.71:3000/getBalance', {
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

        setUserInfo({
          userId: data.userId,
          firstName: data.firstName,
          lastName: data.lastName,
        });
      } else {
        Alert.alert('Error', data.message || 'Error al obtener el saldo');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
      console.error('Error de conexión:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', getBalance);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú de inicio</Text>

      <View style={styles.box}>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>ID de usuario: {userInfo.userId}</Text>
          <Text style={styles.userInfoText}>
            Nombre: {userInfo.firstName} {userInfo.lastName}
          </Text>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Saldo actual:</Text>
          <Text style={styles.balanceAmount}>
            {accountBalance !== null ? `$${accountBalance}` : 'Cargando...'}
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('GenerateQR', { userId: userInfo.userId })}
          >
            <Text style={styles.buttonText}>Transferir</Text>
          </TouchableOpacity>

          <View style={styles.buttonSpacing} />

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('ReciveTransfer')}
          >
            <Text style={styles.buttonText}>Recibir Transferencia</Text>
          </TouchableOpacity>

          <View style={styles.buttonSpacing} />

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('History')}
          >
            <Text style={styles.buttonText}>Historial de movimientos</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#CBD7D7',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute',
    top: 10,
    left: 10,
  },
  box: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 50,
  },
  userInfoContainer: {
    justifyContent: 'center',
    marginBottom: 30,
    alignItems: 'center',
  },
  userInfoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  balanceAmount: {
    fontSize: 20,
    color: '#6F028A',
  },
  buttonGroup: {
    marginTop: 10,
  },
  button: {
    backgroundColor: '#6F028A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSpacing: {
    height: 10,
  },
  logoutButton: {
    backgroundColor: '#FF0000',
  },
  bottomSection: {
    justifyContent: 'flex-end',
  },
});

export default MenuScreen;