import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReceiveTransferScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(''); // El ID del usuario que recibirá la transferencia
  const [amount, setAmount] = useState('');
  const [senderId, setSenderId] = useState('');
  const [senderName, setSenderName] = useState('');

  const handleReceiveTransfer = async () => {
    if (!userId || !amount || !senderId || !senderName) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }

    if (parseFloat(amount) <= 0) {
      Alert.alert('Error', 'El monto debe ser mayor a 0.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'No se encontró el token de autenticación.');
        return;
      }

      const response = await fetch('http://192.168.1.3:3000/transfer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUserId: senderId,
          toUserId: userId, // El ID ingresado manualmente
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Éxito', `Transferencia recibida de ${senderName} por $${amount}.`);
        setUserId('');
        setAmount('');
        setSenderId('');
        setSenderName('');
      } else {
        Alert.alert('Error', data.message || 'No se pudo completar la transferencia.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
      console.error('Error al procesar transferencia:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recibir Transferencia</Text>

      <TextInput
        style={styles.input}
        placeholder="ID del destinatario (su ID)"
        value={userId}
        onChangeText={setUserId}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="ID del remitente"
        value={senderId}
        onChangeText={setSenderId}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Nombre del remitente"
        value={senderName}
        onChangeText={setSenderName}
      />

      <TextInput
        style={styles.input}
        placeholder="Monto a recibir"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Button title="Recibir Transferencia" onPress={handleReceiveTransfer} />

      <View style={{ marginTop: 20 }}>
        <Button title="Volver al Menú" onPress={() => navigation.goBack()} />
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});

export default ReceiveTransferScreen;