import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const MovementsScreen = () => {
  // Movimientos de simulación, luego con la base de datos haremos que cambie con ella
  const movements = [
    { id: '1', type: 'Venta de gomitas', amount: 564.50, date: '2024-11-01' },
    { id: '2', type: 'Inversión gomitas', amount: -243.50, date: '2024-11-05' },
    { id: '3', type: 'Venta chimangos', amount: 646.00, date: '2024-11-10' },
    { id: '4', type: 'Inversión chimangos', amount: -431.50, date: '2024-11-12' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.type}>{item.type}</Text>
      <Text
        style={[
          styles.amount,
          item.amount < 0 ? styles.negative : styles.positive,
        ]}
      >
        ${item.amount.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Movimientos</Text>
      <FlatList
        data={movements}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 14,
    color: '#555',
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positive: {
    color: '#4CAF50',
  },
  negative: {
    color: '#F44336',
  },
});

export default MovementsScreen;
