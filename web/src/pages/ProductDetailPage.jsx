import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient.js';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    setLoading(true);

    try {
      const response = await apiClient.get(`/products/${id}`);
      setProduct(response.data);
    } catch {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await apiClient.get('/products/me/favorites');
      setFavorites(response.data.items.map((item) => item._id));
    } catch {
      setFavorites([]);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchFavorites();
  }, [id]);

  const isFavorite = product ? favorites.includes(product._id) : false;

  const handleToggleFavorite = async () => {
    if (!product) {
      return;
    }

    const productId = product._id;
    const wasFavorite = favorites.includes(productId);

    setFavorites((current) =>
      wasFavorite ? current.filter((favId) => favId !== productId) : [...current, productId]
    );

    try {
      if (wasFavorite) {
        await apiClient.delete(`/products/${productId}/favorite`);
      } else {
        await apiClient.post(`/products/${productId}/favorite`);
      }
    } catch {
      setFavorites((current) =>
        wasFavorite ? [...current, productId] : current.filter((favId) => favId !== productId)
      );
    }
  };

  if (loading) {
    return (
      <section className="page">
        <p>Loading product…</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="page">
        <p>Product not found.</p>
        <button type="button" className="secondary-button" onClick={() => navigate(-1)}>
          Go back
        </button>
      </section>
    );
  }

  return (
    <section className="page">
      <button type="button" className="secondary-button" onClick={() => navigate(-1)}>
        Back
      </button>
      <div className="product-detail">
        <div className="product-detail-image">
          {product.image ? (
            <img src={product.image} alt={product.title} />
          ) : (
            <div className="product-image placeholder">No image</div>
          )}
        </div>
        <div className="product-detail-info">
          <h1>{product.title}</h1>
          <p className="product-detail-price">${product.price.toFixed(2)}</p>
          <p className="product-detail-description">{product.description}</p>
          <button
            type="button"
            className={`primary-button favorite-toggle ${isFavorite ? 'favorite-toggle-active' : ''}`}
            onClick={handleToggleFavorite}
          >
            {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;

