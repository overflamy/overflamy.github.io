import { Link, NavLink, Route, Routes, Navigate } from 'react-router-dom';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CreateProductPage } from './pages/CreateProductPage';
import { EditProductPage } from './pages/EditProductPage';

export function App() {
  return (
    <div className="app">
      <header className="container header">
        <Link to="/products" className="logo">Товары</Link>
        <nav className="nav">
          <NavLink to="/products" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Список</NavLink>
          <NavLink to="/create-product" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Создать</NavLink>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/products/:id/edit" element={<EditProductPage />} />
          <Route path="/create-product" element={<CreateProductPage />} />
          <Route path="*" element={<div>Не найдено</div>} />
        </Routes>
      </main>
    </div>
  );
}


