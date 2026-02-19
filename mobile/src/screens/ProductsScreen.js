import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import apiClient from '../apiClient.js';
import ProductCard from '../components/ProductCard.js';

const ProductsScreen = ({ onOpenDetail }) => {
  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = async () => {
    try {
      const response = await apiClient.get('/products/me/favorites');
      setFavorites(response.data.items.map((item) => item._id));
    } catch {
      setFavorites([]);
    }
  };

  const fetchProducts = async (nextPage = page) => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.get('/products', {
        params: { page: nextPage, limit: 10 },
      });

      if (nextPage === 1) {
        setItems(response.data.items);
      } else {
        setItems((current) => [...current, ...response.data.items]);
      }

      setPage(nextPage);
      setTotalPages(response.data.totalPages || 1);
    } catch {
      if (nextPage === 1) {
        setItems([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
    fetchProducts(1);
  }, []);

  const handleToggleFavorite = async (productId) => {
    const isFavorite = favorites.includes(productId);

    setFavorites((current) =>
      isFavorite ? current.filter((id) => id !== productId) : [...current, productId]
    );

    try {
      if (isFavorite) {
        await apiClient.delete(`/products/${productId}/favorite`);
      } else {
        await apiClient.post(`/products/${productId}/favorite`);
      }
    } catch {
      setFavorites((current) =>
        isFavorite ? [...current, productId] : current.filter((id) => id !== productId)
      );
    }
  };

  const handleLoadMore = () => {
    if (!loading && page < totalPages) {
      fetchProducts(page + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFavorites();
    fetchProducts(1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Products</Text>
      {items.length === 0 && loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#e5e7eb" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => onOpenDetail(item)}
              onToggleFavorite={() => handleToggleFavorite(item._id)}
              isFavorite={favorites.includes(item._id)}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#e5e7eb" />
          }
          ListFooterComponent={
            loading && items.length > 0 ? (
              <View style={styles.footer}>
                <ActivityIndicator color="#e5e7eb" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: '#020617',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingVertical: 12,
  },
});

export default ProductsScreen;

