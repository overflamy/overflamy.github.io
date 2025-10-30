import { MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product, useProductsStore } from '@/store/products';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const navigate = useNavigate();
  const toggleLike = useProductsStore((s) => s.toggleLike);
  const deleteProduct = useProductsStore((s) => s.deleteProduct);
  const liked = useProductsStore((s) => s.likedIds.has(product.id));

  const onCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const stop = (e: MouseEvent) => e.stopPropagation();

  return (
    <div className="card" onClick={onCardClick} role="button">
      <img className="thumb" src={product.image} alt={product.title} loading="lazy" />
      <div className="card-body">
        <div className="row" style={{ marginBottom: 8 }}>
          <h3 className="title" title={product.title}>{product.title}</h3>
          <div className="price">{product.price.toFixed(2)} ₽</div>
        </div>
        <div className="desc">{product.description}</div>
        <div className="row" style={{ marginTop: 10 }}>
          <div>
            <button
              className={`icon-btn ${liked ? 'liked' : ''}`}
              aria-label="like"
              title={liked ? 'Убрать из избранного' : 'В избранное'}
              onClick={(e) => { stop(e); toggleLike(product.id); }}
            >
              ♥
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to={`/products/${product.id}/edit`} className="icon-btn" onClick={stop} title="Редактировать">✎</Link>
            <button className="icon-btn" aria-label="delete" title="Удалить" onClick={(e) => { stop(e); deleteProduct(product.id); }}>🗑</button>
          </div>
        </div>
      </div>
    </div>
  );
}


