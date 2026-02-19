import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient.js";
import ProductCard from "../components/ProductCard.jsx";
import PaginationControls from "../components/PaginationControls.jsx";
import { useAuth } from "../state/AuthContext.jsx";

const ProductsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isReady } = useAuth();
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = async () => {
    try {
      const response = await apiClient.get("/products/me/favorites");
      setFavorites(response.data.items.map((item) => item._id));
    } catch {
      setFavorites([]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const response = await apiClient.get("/products", {
        params: { search, page, limit: 6 },
      });

      setProducts(response.data.items);
      setTotalPages(response.data.totalPages || 1);
    } catch {
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, page]);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      fetchFavorites();
    }
  }, [isReady, isAuthenticated]);

  const handleToggleFavorite = async (productId) => {
    if (!isAuthenticated) {
      return;
    }

    const isFavorite = favorites.includes(productId);

    setFavorites((current) =>
      isFavorite
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );

    try {
      if (isFavorite) {
        await apiClient.delete(`/products/${productId}/favorite`);
      } else {
        await apiClient.post(`/products/${productId}/favorite`);
      }
    } catch {
      setFavorites((current) =>
        isFavorite
          ? [...current, productId]
          : current.filter((id) => id !== productId),
      );
    }
  };

  const handleSearchChange = (event) => {
    setPage(1);
    setSearch(event.target.value);
  };

  return (
    <section className="page">
      <header className="page-header">
        <h1>Products</h1>
        <input
          type="search"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search products…"
          className="search-input"
        />
      </header>
      {loading ? (
        <p>Loading products…</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onClick={() => navigate(`/products/${product._id}`)}
                onToggleFavorite={() => handleToggleFavorite(product._id)}
                isFavorite={favorites.includes(product._id)}
              />
            ))}
          </div>
          <PaginationControls
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
};

export default ProductsPage;
