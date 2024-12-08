import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MovementsScreen = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener los movimientos del usuario desde la base de datos
  const getMovements = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        Alert.alert('Error', 'No se ha encontrado el token de autenticación.');
        return;
      }

      // Hacer la solicitud al backend para obtener los movimientos
      const response = await fetch('http://192.168.1.71:3000/getMovements', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMovements(data); // Asumiendo que la respuesta es un array de movimientos
      } else {
        Alert.alert('Error', data.message || 'Error al obtener los movimientos');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
      console.error('Error de conexión:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovements();
  }, []);

  // Función para renderizar cada item de la lista de movimientos
  const renderItem = ({ item }) => {
    // Convierte el monto a número, en caso de que sea un string
    let amount = parseFloat(item.amount);
  
    let formattedAmount = 'Monto inválido'; // Valor por defecto si amount no es válido
    if (!isNaN(amount)) {
      formattedAmount = amount.toFixed(2); // Formatea el monto a 2 decimales
    } else {
      console.log('Monto inválido:', item.amount); // Imprime el valor original en consola
    }
  
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.date}>{item.transaction_date}</Text>
        <Text style={styles.type}>{item.from_name} → {item.to_name}</Text>
        <Text
          style={[
            styles.amount,
            amount < 0 ? styles.negative : styles.positive, // Color según el monto
          ]}
        >
          ${formattedAmount} {/* Usamos el monto formateado */}
        </Text>
        <Text style={styles.status}>{item.status}</Text>
        {item.description && <Text style={styles.description}>{item.description}</Text>}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cargando movimientos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Movimientos</Text>
      <FlatList
        data={movements}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  positive: {
    color: 'green',
  },
  negative: {
    color: 'red',
  },
  status: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  description: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },
});

export default MovementsScreen;
