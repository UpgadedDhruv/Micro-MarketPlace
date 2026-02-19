import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import apiClient from '../apiClient.js';

const ProductDetailScreen = ({ product, onBack }) => {
  const [fullProduct, setFullProduct] = useState(product);
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  const productId = product._id;

  const fetchProduct = async () => {
    setLoading(true);

    try {
      const [productResponse, favoritesResponse] = await Promise.all([
        apiClient.get(`/products/${productId}`),
        apiClient.get('/products/me/favorites'),
      ]);

      setFullProduct(productResponse.data);
      const favoriteIds = favoritesResponse.data.items.map((item) => item._id);
      setFavorite(favoriteIds.includes(productId));
    } catch {
      setFullProduct(product);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const handleToggleFavorite = async () => {
    const wasFavorite = favorite;
    setFavorite(!wasFavorite);

    try {
      if (wasFavorite) {
        await apiClient.delete(`/products/${productId}/favorite`);
      } else {
        await apiClient.post(`/products/${productId}/favorite`);
      }
    } catch {
      setFavorite(wasFavorite);
    }
  };

  if (!fullProduct) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Product not found.</Text>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#e5e7eb" />
        </View>
      ) : (
        <>
          <View style={styles.imageWrapper}>
            {fullProduct.image ? (
              <Image source={{ uri: fullProduct.image }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.placeholder]}>
                <Text style={styles.placeholderText}>No image</Text>
              </View>
            )}
          </View>
          <Text style={styles.title}>{fullProduct.title}</Text>
          <Text style={styles.price}>${fullProduct.price.toFixed(2)}</Text>
          <Text style={styles.description}>{fullProduct.description}</Text>
          <Pressable
            style={[styles.favoriteButton, favorite && styles.favoriteButtonActive]}
            onPress={handleToggleFavorite}
          >
            <Text style={styles.favoriteButtonText}>
              {favorite ? 'Remove from favorites' : 'Add to favorites'}
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: '#fecaca',
    marginTop: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#0f172a',
    marginBottom: 12,
  },
  backButtonText: {
    color: '#e5e7eb',
    fontSize: 13,
  },
  imageWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 220,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  placeholderText: {
    color: '#6b7280',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e5e7eb',
  },
  price: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '600',
    color: '#a5b4fc',
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: '#9ca3af',
  },
  favoriteButton: {
    marginTop: 16,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#4b5563',
  },
  favoriteButtonActive: {
    backgroundColor: '#4f46e5',
  },
  favoriteButtonText: {
    color: '#f9fafb',
    fontWeight: '600',
  },
});

export default ProductDetailScreen;

