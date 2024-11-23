import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function ConfirmTransferScreen({ route, navigation }) {
  const { recipientName, recipientId, amount } = route.params;

  const [qrData, setQrData] = useState(null);
  const generateQR = () => {
    const data = {
      recipientName,
      recipientId,
      amount,
    };
    setQrData(JSON.stringify(data));
    Alert.alert('QR generado', 'Escanea este código para realizar la transferencia.');
  };

  const handleBackToGenerate = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar Transferencia</Text>
      <Text>Nombre del destinatario: {recipientName}</Text>
      <Text>ID del destinatario: {recipientId}</Text>
      <Text>Monto a transferir: ${amount}</Text>

      <Button title="Generar QR" onPress={generateQR} />

      {qrData && (
        <View style={styles.qrContainer}>
          <Text style={styles.qrLabel}>Escanea este código para transferir:</Text>
          <QRCode value={qrData} size={200} />
        </View>
      )}

      <Button title="Volver" onPress={handleBackToGenerate} />
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
