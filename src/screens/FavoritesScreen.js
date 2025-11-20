import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

export default function FavoritesScreen() {
  const favorites = useSelector(state => state.favorites);

  if (favorites.length === 0) {
    return <View style={styles.center}><Text>No favorites yet!</Text></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList 
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.thumb} />
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: 'white', padding: 10, borderRadius: 8 },
  thumb: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  title: { fontSize: 16, fontWeight: 'bold' }
});