import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, MenuItem, Order, OrderItem, OptionItem } from './types';

interface AppState {
  categories: Category[];
  items: MenuItem[];
  orders: Order[];
  milks: OptionItem[];
  syrups: OptionItem[];
  sauces: OptionItem[];
  addCategory: (name: string, color?: string) => void;
  updateCategory: (id: string, name: string, color?: string) => void;
  deleteCategory: (id: string) => void;
  addItem: (item: Omit<MenuItem, 'id'>) => void;
  updateItem: (id: string, item: Partial<MenuItem>) => void;
  deleteItem: (id: string) => void;
  addOrder: (customerName: string, items: Omit<OrderItem, 'id'>[], preScanned?: boolean) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  addMilk: (name: string, color: string) => void;
  updateMilk: (id: string, name: string, color: string) => void;
  deleteMilk: (id: string) => void;
  addSyrup: (name: string, color: string) => void;
  updateSyrup: (id: string, name: string, color: string) => void;
  deleteSyrup: (id: string) => void;
  addSauce: (name: string, color: string) => void;
  updateSauce: (id: string, name: string, color: string) => void;
  deleteSauce: (id: string) => void;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Coffee', color: '#fef3c7' }, // amber-100
  { id: '2', name: 'Tea', color: '#dcfce7' }, // green-100
  { id: '3', name: 'Sweets', color: '#fce7f3' }, // pink-100
];

const defaultItems: MenuItem[] = [
  {
    id: '1',
    categoryId: '1',
    name: 'Espresso',
    subtitle: '1 shots',
    icon: 'Coffee',
    barcode: '7891234567890',
    prepTime: 2,
    available: true,
    recipe: '1 shot of espresso (30ml)',
    hasMilk: true,
    hasSugar: true,
    hasSyrup: true,
    hasSauce: true,
  },
  {
    id: '2',
    categoryId: '1',
    name: 'Cappuccino',
    subtitle: '1 shots',
    icon: 'CupSoda',
    barcode: '7891234567891',
    prepTime: 5,
    available: true,
    recipe: '1 shot of espresso, steamed milk, milk foam',
    hasMilk: true,
    hasSugar: true,
    hasSyrup: true,
    hasSauce: true,
  },
  {
    id: '3',
    categoryId: '2',
    name: 'Green Tea',
    subtitle: '1 bag',
    icon: 'Leaf',
    barcode: '7891234567892',
    prepTime: 3,
    available: true,
    recipe: 'Green tea bag, 200ml hot water',
    hasMilk: false,
    hasSugar: true,
    hasSyrup: true,
    hasSauce: false,
  },
];

const defaultMilks: OptionItem[] = [
  { id: 'm1', name: 'Full Cream', color: '#3b82f6' },
  { id: 'm2', name: 'Skim', color: '#60a5fa' },
  { id: 'm3', name: 'Almond', color: '#d97706' },
  { id: 'm4', name: 'Oat', color: '#f59e0b' },
  { id: 'm5', name: 'Soy', color: '#10b981' }
];

const defaultSyrups: OptionItem[] = [
  { id: 'sy1', name: 'Vanilla', color: '#fef08a' },
  { id: 'sy2', name: 'Caramel', color: '#d97706' },
  { id: 'sy3', name: 'Hazelnut', color: '#78350f' }
];

const defaultSauces: OptionItem[] = [
  { id: 'sa1', name: 'Chocolate', color: '#451a03' },
  { id: 'sa2', name: 'Caramel', color: '#d97706' }
];

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [items, setItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('items');
    return saved ? JSON.parse(saved) : defaultItems;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [milks, setMilks] = useState<OptionItem[]>(() => {
    const saved = localStorage.getItem('milks');
    // Migrate old string array to objects if needed
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0 && typeof parsed[0] === 'string') {
        return parsed.map((m: string, i: number) => ({ id: `m${i}`, name: m, color: '#3b82f6' }));
      }
      return parsed;
    }
    return defaultMilks;
  });

  const [syrups, setSyrups] = useState<OptionItem[]>(() => {
    const saved = localStorage.getItem('syrups');
    return saved ? JSON.parse(saved) : defaultSyrups;
  });

  const [sauces, setSauces] = useState<OptionItem[]>(() => {
    const saved = localStorage.getItem('sauces');
    return saved ? JSON.parse(saved) : defaultSauces;
  });

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('milks', JSON.stringify(milks));
  }, [milks]);

  useEffect(() => {
    localStorage.setItem('syrups', JSON.stringify(syrups));
  }, [syrups]);

  useEffect(() => {
    localStorage.setItem('sauces', JSON.stringify(sauces));
  }, [sauces]);

  const addCategory = (name: string, color?: string) => {
    setCategories([...categories, { id: Date.now().toString(), name, color: color || '#f1f5f9' }]);
  };

  const updateCategory = (id: string, name: string, color?: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, name, color } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const addItem = (item: Omit<MenuItem, 'id'>) => {
    setItems([...items, { ...item, id: Date.now().toString() }]);
  };

  const updateItem = (id: string, updatedItem: Partial<MenuItem>) => {
    setItems(items.map(i => (i.id === id ? { ...i, ...updatedItem } : i)));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const addOrder = (customerName: string, orderItems: Omit<OrderItem, 'id'>[], preScanned?: boolean) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      customerName,
      items: orderItems.map(i => ({ ...i, id: Math.random().toString(36).substring(7) })),
      status: 'pending',
      createdAt: Date.now(),
      preScanned
    };
    setOrders([...orders, newOrder]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map(o => (o.id === id ? { ...o, status } : o)));
  };

  const addMilk = (name: string, color: string) => {
    setMilks([...milks, { id: Date.now().toString(), name, color }]);
  };

  const updateMilk = (id: string, name: string, color: string) => {
    setMilks(milks.map(m => m.id === id ? { ...m, name, color } : m));
  };

  const deleteMilk = (id: string) => {
    setMilks(milks.filter(m => m.id !== id));
  };

  const addSyrup = (name: string, color: string) => {
    setSyrups([...syrups, { id: Date.now().toString(), name, color }]);
  };

  const updateSyrup = (id: string, name: string, color: string) => {
    setSyrups(syrups.map(s => s.id === id ? { ...s, name, color } : s));
  };

  const deleteSyrup = (id: string) => {
    setSyrups(syrups.filter(s => s.id !== id));
  };

  const addSauce = (name: string, color: string) => {
    setSauces([...sauces, { id: Date.now().toString(), name, color }]);
  };

  const updateSauce = (id: string, name: string, color: string) => {
    setSauces(sauces.map(s => s.id === id ? { ...s, name, color } : s));
  };

  const deleteSauce = (id: string) => {
    setSauces(sauces.filter(s => s.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        categories,
        items,
        orders,
        milks,
        syrups,
        sauces,
        addCategory,
        updateCategory,
        deleteCategory,
        addItem,
        updateItem,
        deleteItem,
        addOrder,
        updateOrderStatus,
        addMilk,
        updateMilk,
        deleteMilk,
        addSyrup,
        updateSyrup,
        deleteSyrup,
        addSauce,
        updateSauce,
        deleteSauce,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
