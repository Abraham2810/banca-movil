import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import TopBackground from '../assets/TopBackground';

export default function WelcomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.svgContainer}>
                <TopBackground />
            </View>
            <Text style={styles.title}>Bienvenido</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.buttonText}>Registrarse</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 1,
    },
    svgContainer: {
        position: 'absolute',
        top: 0,
        width: '100%',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 40,
        color: '#FFFFFF', 
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#8C0CAC',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 40,
        marginBottom: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});