import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GenerateQRScreen = ({ route, navigation }) => {
  const { userId } = route.params;

  const [amount, setAmount] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [recipientName, setRecipientName] = useState('');

  const handleGenerateQR = () => {
    if (!amount || !recipientId || !recipientName) {
      Alert.alert('Error', 'Por favor, ingrese todos los campos.');
      return;
    }

    if (parseFloat(amount) <= 0) {
      Alert.alert('Error', 'El monto debe ser mayor a 0.');
      return;
    }

    Alert.alert('QR generado', 'Escanee este código QR para realizar la transferencia.');
  };

  const handleDirectTransfer = async () => {
    if (!amount || !recipientId || !recipientName) {
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

      const response = await fetch('http://192.168.1.71:3000/transfer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUserId: userId, 
          toUserId: recipientId,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert(
          'Éxito',
          `Transferencia exitosa a ${recipientName} por $${amount}.`
        );
        setAmount('');
        setRecipientId('');
        setRecipientName('');
      } else {
        Alert.alert('Error', data.message || 'No se pudo completar la transferencia.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
      console.error('Error al procesar transferencia directa:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generar Código QR de Transferencia</Text>

      <TextInput
        style={styles.input}
        placeholder="Monto a transferir"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        style={styles.input}
        placeholder="ID del destinatario"
        value={recipientId}
        onChangeText={setRecipientId}
      />

      <TextInput
        style={styles.input}
        placeholder="Nombre completo del destinatario"
        value={recipientName}
        onChangeText={setRecipientName}
      />

      <View style={styles.buttonContainer}>
        <Button title="Generar QR" onPress={handleGenerateQR} color="#6A0DAD" />
      </View>

      <View style={[styles.buttonContainer, { marginTop: 20 }]}>
        <Button
          title="Transferir sin QR"
          onPress={handleDirectTransfer}
          color="#6A0DAD"
        />
      </View>

      <View style={{ marginTop: 30 }}>
        {userId && amount && recipientId && recipientName && (
          <QRCode
            value={JSON.stringify({
              amount: parseFloat(amount),
              fromUserId: userId,
              toUserId: recipientId,
              toUserName: recipientName,
            })}
            size={250}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '100%',
    padding: 10,
    borderColor: '#888888',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default GenerateQRScreen;