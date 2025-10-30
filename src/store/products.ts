import { create } from 'zustand';

export type Product = {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  category?: string;
  createdAt?: string;
};

export type FilterMode = 'all' | 'favorites';

type ProductsState = {
  products: Product[];
  likedIds: Set<number>;
  deletedIds: Set<number>;
  isLoading: boolean;
  error?: string;

  // ui state
  filter: FilterMode;
  searchQuery: string;
  currentPage: number;
  pageSize: number;

  // actions
  fetchProducts: () => Promise<void>;
  getById: (id: number) => Product | undefined;
  toggleLike: (id: number) => void;
  deleteProduct: (id: number) => void;
  setFilter: (filter: FilterMode) => void;
  setSearch: (query: string) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  createProduct: (input: Omit<Product, 'id'>) => number;
  updateProduct: (id: number, patch: Partial<Product>) => void;

  // derived helpers
  visibleProducts: () => Product[];
  totalVisible: () => number;
};

const LS_KEY = 'products_spa_state_v1';

type Persisted = {
  products: Product[];
  likedIds: number[];
  deletedIds: number[];
};

function loadPersisted(): Persisted | undefined {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as Persisted;
  } catch {
    return undefined;
  }
}

function savePersisted(p: Persisted) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(p));
  } catch {}
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: loadPersisted()?.products ?? [],
  likedIds: new Set(loadPersisted()?.likedIds ?? []),
  deletedIds: new Set(loadPersisted()?.deletedIds ?? []),
  isLoading: false,
  error: undefined,
  filter: 'all',
  searchQuery: '',
  currentPage: 1,
  pageSize: 12,

  async fetchProducts() {
    const state = get();
    if (state.products.length > 0) return; // уже есть (локально созданные/кеш)
    set({ isLoading: true, error: undefined });
    try {
      const res = await fetch('https://fakestoreapi.com/products');
      if (!res.ok) throw new Error('Failed to load');
      const list = (await res.json()) as any[];
      const products: Product[] = list.map((p) => ({
        id: Number(p.id),
        title: String(p.title),
        description: String(p.description),
        image: String(p.image),
        price: Number(p.price),
        category: p.category ? String(p.category) : undefined,
      }));
     
      const merged = [...products];
      set({ products: merged, isLoading: false });
      const { likedIds, deletedIds } = get();
      savePersisted({ products: merged, likedIds: [...likedIds], deletedIds: [...deletedIds] });
    } catch (e: any) {
      set({ isLoading: false, error: e?.message ?? 'Ошибка загрузки' });
    }
  },

  getById(id) {
    const { products } = get();
    return products.find((p) => p.id === id);
  },

  toggleLike(id) {
    const liked = new Set(get().likedIds);
    if (liked.has(id)) liked.delete(id); else liked.add(id);
    set({ likedIds: liked });
    const { products, deletedIds } = get();
    savePersisted({ products, likedIds: [...liked], deletedIds: [...deletedIds] });
  },

  deleteProduct(id) {
    const deletedIds = new Set(get().deletedIds);
    deletedIds.add(id);
    // удаляем из списка, но оставляем в persisted как удалённый
    const products = get().products.filter((p) => p.id !== id);
    set({ deletedIds, products });
    const { likedIds } = get();
    savePersisted({ products, likedIds: [...likedIds], deletedIds: [...deletedIds] });
  },

  setFilter(filter) {
    set({ filter, currentPage: 1 });
  },

  setSearch(query) {
    set({ searchQuery: query, currentPage: 1 });
  },

  setPage(page) {
    set({ currentPage: page });
  },

  setPageSize(size) {
    set({ pageSize: size, currentPage: 1 });
  },

  createProduct(input) {
    const products = get().products.slice();
    // генерируем временный id (отрицательные для локально созданных)
    const minId = products.reduce((acc, p) => Math.min(acc, p.id), 0);
    const id = minId <= 0 ? minId - 1 : -1;
    const newProduct: Product = { id, ...input, createdAt: new Date().toISOString() };
    products.unshift(newProduct);
    set({ products });
    const { likedIds, deletedIds } = get();
    savePersisted({ products, likedIds: [...likedIds], deletedIds: [...deletedIds] });
    return id;
  },

  updateProduct(id, patch) {
    const products = get().products.map((p) => (p.id === id ? { ...p, ...patch } : p));
    set({ products });
    const { likedIds, deletedIds } = get();
    savePersisted({ products, likedIds: [...likedIds], deletedIds: [...deletedIds] });
  },

  visibleProducts() {
    const { products, likedIds, deletedIds, filter, searchQuery } = get();
    const needle = searchQuery.trim().toLowerCase();
    return products
      .filter((p) => !deletedIds.has(p.id))
      .filter((p) => (filter === 'favorites' ? likedIds.has(p.id) : true))
      .filter((p) =>
        needle
          ? p.title.toLowerCase().includes(needle) || p.description.toLowerCase().includes(needle)
          : true
      );
  },

  totalVisible() {
    return get().visibleProducts().length;
  },
}));


