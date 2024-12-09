import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = () => {
  const [loading, setLoading] = useState(true);
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Error', 'No se encontró el token de autenticación.');
          return;
        }

        const response = await fetch('http://192.168.1.71:3000/movements', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setMovements(data.movements); // Asegúrate de que el backend devuelva una propiedad "movements"
        } else {
          Alert.alert('Error', data.message || 'No se pudo obtener el historial de movimientos.');
        }
      } catch (error) {
        console.error('Error al obtener los movimientos:', error);
        Alert.alert('Error', 'Hubo un problema al conectarse con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.movementItem}>
      <Text style={styles.movementText}>
        De: {item.from_user_id || 'N/A'} - A: {item.to_user_id || 'N/A'}
      </Text>
      <Text style={styles.movementText}>Monto: ${item.amount}</Text>
      <Text style={styles.movementText}>Fecha: {new Date(item.transaction_date).toLocaleString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando historial de movimientos...</Text>
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
        ListEmptyComponent={<Text style={styles.emptyText}>No hay movimientos registrados.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  movementItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  movementText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HistoryScreen;
