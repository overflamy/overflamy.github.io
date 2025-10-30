import { useProductsStore, FilterMode } from '@/store/products';

export function FiltersBar() {
  const filter = useProductsStore((s) => s.filter);
  const setFilter = useProductsStore((s) => s.setFilter);
  const search = useProductsStore((s) => s.searchQuery);
  const setSearch = useProductsStore((s) => s.setSearch);

  return (
    <div className="toolbar">
      <input
        className="input"
        placeholder="Поиск без кнопки..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ minWidth: 260 }}
      />
      <select
        className="select"
        value={filter}
        onChange={(e) => setFilter(e.target.value as FilterMode)}
      >
        <option value="all">Все</option>
        <option value="favorites">Избранное</option>
      </select>
    </div>
  );
}


