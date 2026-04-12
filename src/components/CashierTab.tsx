import React, { useState } from 'react';
import { useAppContext } from '../context';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import * as Icons from 'lucide-react';
import { MenuItem, OrderItem } from '../types';
import Barcode from 'react-barcode';

export default function CashierTab() {
  const { categories, items, addOrder } = useAppContext();
  
  const [cart, setCart] = useState<Omit<OrderItem, 'id'>[]>([]);
  const [customerName, setCustomerName] = useState('');

  const handleAddItem = (item: MenuItem) => {
    setCart([...cart, {
      itemId: item.id,
      quantity: 1,
      options: { 
        sugar: 0, 
        sweetener: 0, 
        milk: 'Full Cream', 
        syrup: 'None', 
        sauce: 'None', 
        notes: '' 
      }
    }]);
  };

  const handleRemoveItem = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleSendOrder = () => {
    if (cart.length === 0) return;
    // preScanned = true so it skips the scanning tab
    addOrder(customerName || 'Walk-in', cart, true);
    setCart([]);
    setCustomerName('');
  };

  const renderIcon = (item: MenuItem) => {
    if (item.icon?.startsWith('data:image') || item.icon?.startsWith('http')) {
      return <img src={item.icon} alt={item.name} className="w-full h-full object-cover rounded-xl" />;
    }
    const Icon = (Icons as any)[item.icon] || Icons.Coffee;
    return <Icon className="w-8 h-8 text-slate-400" />;
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-12rem)]">
      {/* Left: Menu */}
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-slate-800">Menu</h2>
        <ScrollArea className="flex-1 bg-white rounded-xl border border-slate-200 p-4">
          <div className="space-y-6">
            {categories.map(category => {
              const categoryItems = items.filter(i => i.categoryId === category.id && i.available);
              if (categoryItems.length === 0) return null;
              
              return (
                <div key={category.id}>
                  <h3 className="font-medium text-slate-500 mb-3 uppercase tracking-wider text-sm">{category.name}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {categoryItems.map(item => (
                      <Button
                        key={item.id}
                        variant="outline"
                        className="h-auto py-3 px-4 flex flex-col items-center gap-2 justify-center bg-slate-50 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                        onClick={() => handleAddItem(item)}
                      >
                        <div className="w-12 h-12 flex items-center justify-center">
                          {renderIcon(item)}
                        </div>
                        <span className="font-semibold text-sm text-center whitespace-normal">{item.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Right: Order Card */}
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-slate-800">Current Order</h2>
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <Label htmlFor="customerName">Customer Name (Optional)</Label>
              <Input 
                id="customerName" 
                placeholder="Ex: John Doe" 
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
                <Icons.ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
                <p>No items in order yet.</p>
                <p className="text-sm">Select items from the menu to add them.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {cart.map((cartItem, idx) => {
                  const itemDef = items.find(i => i.id === cartItem.itemId);
                  return (
                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex-1">
                        <div className="font-bold text-lg text-slate-800">{itemDef?.name}</div>
                        {itemDef?.barcode && (
                          <div className="mt-2 scale-75 origin-left">
                            <Barcode 
                              value={itemDef.barcode} 
                              width={1.5} 
                              height={40} 
                              displayValue={true} 
                              fontSize={14}
                              margin={0}
                            />
                          </div>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:bg-red-100 hover:text-red-600"
                        onClick={() => handleRemoveItem(idx)}
                      >
                        <Icons.Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-slate-50 border-t border-slate-100 p-4">
            <Button 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg font-bold"
              disabled={cart.length === 0}
              onClick={handleSendOrder}
            >
              <Icons.Send className="w-5 h-5 mr-2" />
              Send to Preparation
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
