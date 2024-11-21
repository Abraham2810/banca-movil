import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function TransferQRScreen() {
  const [recipientName, setRecipientName] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [qrData, setQrData] = useState(null);

  const isFormValid = recipientName && recipientId && amount;

  const handleGenerateQR = () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Por favor, completa todos los campos antes de generar el QR.');
      return;
    }
    const data = {
      recipientName,
      recipientId,
      amount,
    };

    setQrData(JSON.stringify(data));
    Alert.alert('QR generado', 'Escanea este código para realizar la transferencia.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transferir dinero</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del destinatario"
        value={recipientName}
        onChangeText={setRecipientName}
      />
      <TextInput
        style={styles.input}
        placeholder="Número de identificación"
        value={recipientId}
        onChangeText={setRecipientId}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Monto a transferir"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Button title="Generar código" onPress={handleGenerateQR} disabled={!isFormValid} />
      {qrData && (
        <View style={styles.qrContainer}>
          <Text style={styles.qrLabel}>Escanea este código para transferir:</Text>
          <QRCode value={qrData} size={200} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
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
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  qrLabel: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
});
