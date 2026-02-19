const ProductCard = ({ product, onClick, onToggleFavorite, isFavorite }) => {
  const handleToggle = (event) => {
    event.stopPropagation();
    onToggleFavorite();
  };

  return (
    <article className="product-card" onClick={onClick}>
      <div className="product-image-wrapper">
        {product.image ? (
          <img src={product.image} alt={product.title} className="product-image" />
        ) : (
          <div className="product-image placeholder">No image</div>
        )}
        <button
          type="button"
          className={`favorite-badge ${isFavorite ? 'favorite-badge-active' : ''}`}
          onClick={handleToggle}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <span>&#10084;</span>
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>
      </div>
    </article>
  );
};

export default ProductCard;

