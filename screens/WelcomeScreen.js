import React from 'react';
import {View, Text, Button, StyleSheet } from 'react-native';

export default function WelcomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido</Text>
            <Button
            title= "Login"
            onPress={() => navigation.navigate('Login')}
            />
            <Button
            title = "Registrarse"
            onPress = {() => navigation.navigate('Register')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
    },
});