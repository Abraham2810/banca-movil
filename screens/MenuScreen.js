import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const MenuScreen = ({ navigation }) => {

    const [accountBalance, setAccountBalance] = useState(20.24);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Menú de inicio</Text>

            <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>Saldo actual:</Text>
            <Text style={styles.balanceAmount}>${accountBalance.toFixed(2)}</Text>
            </View>

            <Button
            title="Transferir dinero"
            onPress={() => alert('Work in progress')}
            />
            <Button
            title="Historial de movimientos"
            onPress={() => alert('Work in progress')}
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
      button: {
        marginVertical: 10,
      },
});

export default MenuScreen;