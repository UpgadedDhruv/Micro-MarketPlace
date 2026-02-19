import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { AuthProvider } from './src/AuthContext.js';
import LoginScreen from './src/screens/LoginScreen.js';
import ProductsScreen from './src/screens/ProductsScreen.js';
import ProductDetailScreen from './src/screens/ProductDetailScreen.js';

const AppContent = () => {
  const [screen, setScreen] = useState('login');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleLoggedIn = () => {
    setScreen('products');
  };

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setScreen('detail');
  };

  const handleBackToList = () => {
    setScreen('products');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.root}>
        {screen === 'login' && <LoginScreen onLoggedIn={handleLoggedIn} />}
        {screen === 'products' && <ProductsScreen onOpenDetail={handleOpenDetail} />}
        {screen === 'detail' && selectedProduct && (
          <ProductDetailScreen product={selectedProduct} onBack={handleBackToList} />
        )}
      </View>
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617',
  },
  root: {
    flex: 1,
    backgroundColor: '#020617',
  },
});

export default App;

