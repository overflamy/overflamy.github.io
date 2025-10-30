import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProductsStore } from '@/store/products';

const schema = z.object({
  title: z.string().min(3, 'Минимум 3 символа'),
  description: z.string().min(10, 'Минимум 10 символов'),
  image: z.string().url('Должна быть ссылка URL'),
  price: z.coerce.number().min(0, 'Цена не может быть отрицательной'),
  category: z.string().optional()
});
type FormValues = z.infer<typeof schema>;

export function EditProductPage() {
  const { id } = useParams();
  const pid = Number(id);
  const getById = useProductsStore((s) => s.getById);
  const update = useProductsStore((s) => s.updateProduct);
  const product = useMemo(() => (Number.isFinite(pid) ? getById(pid) : undefined), [getById, pid]);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: product ? {
      title: product.title,
      description: product.description,
      image: product.image,
      price: product.price,
      category: product.category ?? ''
    } : undefined
  });

  if (!product) {
    return (
      <section>
        <div className="page-header">
          <h1>Редактирование</h1>
          <Link to="/products" className="btn">Назад</Link>
        </div>
        <div className="empty">Продукт не найден</div>
      </section>
    );
  }

  const onSubmit = (data: FormValues) => {
    update(product.id, { ...data });
    navigate(`/products/${product.id}`);
  };

  return (
    <section>
      <div className="page-header">
        <h1>Редактирование продукта</h1>
        <Link to={`/products/${product.id}`} className="btn">К деталям</Link>
      </div>
      <form className="card" onSubmit={handleSubmit(onSubmit)} style={{ padding: 16, display: 'grid', gap: 12 }}>
        <label>
          <div>Название</div>
          <input className="input" placeholder="Название" {...register('title')} />
          {errors.title && <div className="empty" style={{ padding: 6 }}>{errors.title.message}</div>}
        </label>
        <label>
          <div>Описание</div>
          <textarea className="input" placeholder="Описание" rows={5} {...register('description')} />
          {errors.description && <div className="empty" style={{ padding: 6 }}>{errors.description.message}</div>}
        </label>
        <label>
          <div>Ссылка на изображение</div>
          <input className="input" placeholder="https://..." {...register('image')} />
          {errors.image && <div className="empty" style={{ padding: 6 }}>{errors.image.message}</div>}
        </label>
        <label>
          <div>Цена</div>
          <input className="input" type="number" step="0.01" {...register('price')} />
          {errors.price && <div className="empty" style={{ padding: 6 }}>{errors.price.message}</div>}
        </label>
        <label>
          <div>Категория</div>
          <input className="input" placeholder="Категория" {...register('category')} />
        </label>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="btn" type="submit">Сохранить</button>
          <button className="btn secondary" type="button" onClick={() => navigate(-1)}>Отмена</button>
        </div>
      </form>
    </section>
  );
}


