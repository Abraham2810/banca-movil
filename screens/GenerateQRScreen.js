import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function GenerateQRScreen({ navigation }) {
  const [recipientName, setRecipientName] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const isFormValid = recipientName && recipientId && amount;

  const handleNavigateToConfirm = () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Por favor, completa todos los campos antes de continuar.');
      return;
    }
    navigation.navigate('ConfirmTransfer', {
      recipientName,
      recipientId,
      amount,
    });
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
      <Button title="Continuar" onPress={handleNavigateToConfirm} disabled={!isFormValid} />
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
});
