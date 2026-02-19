import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient.js";
import ProductCard from "../components/ProductCard.jsx";
import { useAuth } from "../state/AuthContext.jsx";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isReady } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);

    try {
      const response = await apiClient.get("/products/me/favorites");
      setFavorites(response.data.items);
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isReady && isAuthenticated) {
      fetchFavorites();
    }
  }, [isReady, isAuthenticated]);

  const handleToggleFavorite = async (productId) => {
    setFavorites((current) => current.filter((item) => item._id !== productId));

    try {
      await apiClient.delete(`/products/${productId}/favorite`);
    } catch {
      fetchFavorites();
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <h1>Favorites</h1>
      </header>
      {loading ? (
        <p>Loading favorites…</p>
      ) : favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <div className="product-grid">
          {favorites.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onClick={() => navigate(`/products/${product._id}`)}
              onToggleFavorite={() => handleToggleFavorite(product._id)}
              isFavorite
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FavoritesPage;
