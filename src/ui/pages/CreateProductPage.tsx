import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useProductsStore } from '@/store/products';

const schema = z.object({
  title: z.string().min(3, 'Минимум 3 символа'),
  description: z.string().min(10, 'Минимум 10 символов'),
  image: z.string().url('Должна быть ссылка URL'),
  price: z.coerce.number().min(0, 'Цена не может быть отрицательной'),
  category: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export function CreateProductPage() {
  const navigate = useNavigate();
  const createProduct = useProductsStore((s) => s.createProduct);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      image: 'https://via.placeholder.com/300x300.png?text=Product',
      price: 0
    }
  });

  const onSubmit = (data: FormValues) => {
    const id = createProduct({
      title: data.title,
      description: data.description,
      image: data.image,
      price: data.price,
      category: data.category
    });
    navigate(`/products/${id}`);
  };

  return (
    <section>
      <div className="page-header">
        <h1>Создание продукта</h1>
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
          <div>Категория (необязательно)</div>
          <input className="input" placeholder="Категория" {...register('category')} />
        </label>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="btn" type="submit" disabled={isSubmitting}>Сохранить</button>
          <button className="btn secondary" type="button" onClick={() => navigate('/products')}>Отмена</button>
        </div>
      </form>
    </section>
  );
}


