import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const ProductCard = ({ product, onPress, onToggleFavorite, isFavorite }) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText}>No image</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {product.title}
          </Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
        </View>
        <Pressable
          hitSlop={12}
          style={[styles.favorite, isFavorite && styles.favoriteActive]}
          onPress={(event) => {
            event.stopPropagation();
            onToggleFavorite();
          }}
        >
          <Text style={styles.favoriteText}>{isFavorite ? '★' : '☆'}</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 12,
    backgroundColor: '#020617',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 10,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  placeholderText: {
    fontSize: 10,
    color: '#6b7280',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  price: {
    fontSize: 13,
    color: '#a5b4fc',
    marginTop: 2,
  },
  description: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  favorite: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4b5563',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteActive: {
    borderColor: '#f97316',
    backgroundColor: '#1f2937',
  },
  favoriteText: {
    fontSize: 18,
    color: '#facc15',
  },
});

export default ProductCard;

