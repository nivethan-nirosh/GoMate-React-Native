import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../redux/store';
import { Feather } from '@expo/vector-icons';

export default function DetailsScreen({ route }) {
  const { item } = route.params;
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites);
  const isFav = favorites.some(fav => fav.id === item.id);

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>{item.price}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      
      <View style={{ marginTop: 20 }}>
        <Button 
          title={isFav ? "Remove from Favorites" : "Add to Favorites"} 
          onPress={() => dispatch(toggleFavorite(item))}
          color={isFav ? "red" : "blue"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  image: { width: '100%', height: 200, borderRadius: 10 },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  price: { fontSize: 18, color: '#666', marginVertical: 5 },
  desc: { fontSize: 16, marginTop: 10 }
});