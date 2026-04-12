import React, { useState } from 'react';
import { useAppContext } from '../context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import * as Icons from 'lucide-react';
import { MenuItem, OrderItem } from '../types';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageSquareHeart } from 'lucide-react';

interface MenuTabProps {
  customerName: string;
  onOrderSent: () => void;
}

export default function MenuTab({ customerName, onOrderSent }: MenuTabProps) {
  const { categories, items, milks, syrups, sauces, addOrder } = useAppContext();
  
  const [cart, setCart] = useState<Omit<OrderItem, 'id'>[]>([]);
  
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sugar, setSugar] = useState(0);
  const [sweetener, setSweetener] = useState(0);
  const [milk, setMilk] = useState(milks[0]?.name || 'Full Cream');
  const [syrup, setSyrup] = useState('None');
  const [sauce, setSauce] = useState('None');
  const [notes, setNotes] = useState('');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSuccessSplashVisible, setIsSuccessSplashVisible] = useState(false);
  const [showComicBalloon, setShowComicBalloon] = useState(false);

  const handleOpenItem = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setSugar(0);
    setSweetener(0);
    setMilk(milks[0]?.name || 'Full Cream');
    setSyrup('None');
    setSauce('None');
    setNotes('');
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;
    
    setCart([...cart, {
      itemId: selectedItem.id,
      quantity,
      options: { sugar, sweetener, milk, syrup, sauce, notes }
    }]);
    
    setSelectedItem(null);
    setShowComicBalloon(true);
    setTimeout(() => setShowComicBalloon(false), 2000);
  };

  const handleRemoveFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleSendOrder = () => {
    if (cart.length === 0) return;
    addOrder(customerName, cart);
    setCart([]);
    setIsCartOpen(false);
    
    // Show confetti and splash
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f97316', '#3b82f6', '#10b981', '#f59e0b']
    });
    
    setIsSuccessSplashVisible(true);
    
    setTimeout(() => {
      setIsSuccessSplashVisible(false);
      onOrderSent();
    }, 3000);
  };

  const renderIcon = (item: MenuItem) => {
    if (item.icon?.startsWith('data:image') || item.icon?.startsWith('http')) {
      return <img src={item.icon} alt={item.name} className="w-full h-full object-cover rounded-xl" />;
    }
    const Icon = (Icons as any)[item.icon] || Icons.Coffee;
    return <Icon className="w-10 h-10 text-white" />;
  };

  if (isSuccessSplashVisible) {
    return (
      <div className="fixed inset-0 bg-[#FFFDF7] z-50 flex flex-col items-center justify-center">
        <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <CheckCircle2 className="w-16 h-16 text-green-600" />
        </div>
        <h2 className="text-5xl font-bold text-slate-900 mb-4 text-center">Thank You!</h2>
        <p className="text-2xl text-slate-600 text-center">Your order has been sent to the kitchen.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-12">
        {categories.map(category => {
          const categoryItems = items.filter(i => i.categoryId === category.id && i.available);
          if (categoryItems.length === 0) return null;
          
          return (
            <div key={category.id} className="p-6 rounded-3xl" style={{ backgroundColor: category.color || '#f1f5f9' }}>
              <h2 className="text-2xl font-semibold mb-6 text-slate-800">{category.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryItems.map(item => (
                  <Card 
                    key={item.id} 
                    className="cursor-pointer hover:border-orange-400 transition-colors bg-white/80 backdrop-blur-sm border-white/50 overflow-hidden shadow-sm hover:shadow-md"
                    onClick={() => handleOpenItem(item)}
                  >
                    <div className="flex p-4 gap-4">
                      <div className="w-20 h-24 bg-black rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {renderIcon(item)}
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="font-bold text-slate-900 text-lg leading-tight">{item.name}</h3>
                        {item.subtitle && (
                          <p className="text-slate-500 text-sm mt-1">{item.subtitle}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
          <Button 
            size="lg" 
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-xl rounded-full px-6 py-6 flex items-center gap-3"
            onClick={() => setIsCartOpen(true)}
          >
            <Icons.ShoppingCart className="w-5 h-5" />
            <span className="font-bold">{cart.length} items</span>
            <span className="bg-white/20 px-2 py-1 rounded-md text-sm">View Order</span>
          </Button>
        </div>
      )}

      {/* Comic Balloon */}
      {showComicBalloon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white px-8 py-6 rounded-3xl shadow-2xl border-4 border-orange-400 animate-bounce relative transform scale-150">
            <div className="flex items-center gap-3">
              <MessageSquareHeart className="w-8 h-8 text-orange-500" />
              <span className="font-bold text-orange-600 text-2xl">Good choice!</span>
            </div>
            <div className="absolute -bottom-4 right-1/2 translate-x-1/2 w-8 h-8 bg-white border-b-4 border-r-4 border-orange-400 transform rotate-45"></div>
            <Icons.Star className="absolute -top-4 -left-4 w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
            <Icons.Star className="absolute -bottom-4 -right-4 w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse delay-75" />
            <Icons.Star className="absolute top-1/2 -right-6 w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse delay-150" />
          </div>
        </div>
      )}

      {/* Item Customization Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-[400px] max-h-[90vh] overflow-y-auto bg-[#FFFDF7] border-orange-400 border-2 p-6 rounded-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedItem?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex gap-4 items-center">
                <div className="w-24 h-28 bg-black rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {renderIcon(selectedItem)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-2xl leading-tight">{selectedItem.name}</h3>
                  {selectedItem.subtitle && (
                    <p className="text-slate-500 text-sm mt-1">{selectedItem.subtitle}</p>
                  )}
                </div>
              </div>

              {/* Milk */}
              {selectedItem.hasMilk && (
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">Milk</Label>
                  <Select value={milk} onValueChange={setMilk}>
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {milks.map(m => (
                        <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Sugar */}
              {selectedItem.hasSugar && (
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">Sugar & Sweetener</Label>
                  <div className="flex flex-col gap-3 bg-white border border-slate-200 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">Sugar Pumps</span>
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-lg" onClick={() => setSugar(Math.max(0, sugar - 1))}>
                          <Icons.Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-bold text-lg w-6 text-center">{sugar}</span>
                        <Button variant="ghost" className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-lg" onClick={() => setSugar(sugar + 1)}>
                          <Icons.Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">Sweetener (Equal)</span>
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-lg" onClick={() => setSweetener(Math.max(0, sweetener - 1))}>
                          <Icons.Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-bold text-lg w-6 text-center">{sweetener}</span>
                        <Button variant="ghost" className="w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-lg" onClick={() => setSweetener(sweetener + 1)}>
                          <Icons.Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Syrup */}
              {selectedItem.hasSyrup && (
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">Syrup</Label>
                  <Select value={syrup} onValueChange={setSyrup}>
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      {syrups.map(s => (
                        <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Sauce */}
              {selectedItem.hasSauce && (
                <div className="space-y-2">
                  <Label className="text-slate-700 font-semibold">Sauce</Label>
                  <Select value={sauce} onValueChange={setSauce}>
                    <SelectTrigger className="bg-white border-slate-200">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      {sauces.map(s => (
                        <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-semibold">Notes</Label>
                <Input 
                  placeholder="Ex: Extra hot..." 
                  className="bg-white border-slate-200"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              {/* Quantity */}
              <div className="mt-2">
                <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-2">
                  <Button variant="ghost" className="w-12 h-12 rounded-lg" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Icons.Minus className="w-5 h-5" />
                  </Button>
                  <span className="font-bold text-xl w-12 text-center">{quantity}</span>
                  <Button variant="ghost" className="w-12 h-12 rounded-lg" onClick={() => setQuantity(quantity + 1)}>
                    <Icons.Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleAddToCart} 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg rounded-xl mt-2"
              >
                Add to Order
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cart Dialog */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Your Order</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4 mt-4">
            <div className="space-y-4">
              {cart.map((cartItem, idx) => {
                const itemDef = items.find(i => i.id === cartItem.itemId);
                return (
                  <div key={idx} className="flex justify-between items-start text-sm bg-slate-50 p-3 rounded-lg">
                    <div>
                      <div className="font-bold text-base">
                        {cartItem.quantity}x {itemDef?.name}
                      </div>
                      <div className="text-slate-500 mt-1 space-y-0.5">
                        {itemDef?.hasMilk && cartItem.options.milk && cartItem.options.milk !== 'Full Cream' && <div>Milk: {cartItem.options.milk}</div>}
                        {itemDef?.hasSugar && cartItem.options.sugar && cartItem.options.sugar > 0 ? <div>Sugar: {cartItem.options.sugar}</div> : null}
                        {itemDef?.hasSugar && cartItem.options.sweetener && cartItem.options.sweetener > 0 ? <div>Sweetener: {cartItem.options.sweetener}</div> : null}
                        {itemDef?.hasSyrup && cartItem.options.syrup && cartItem.options.syrup !== 'None' && <div>Syrup: {cartItem.options.syrup}</div>}
                        {itemDef?.hasSauce && cartItem.options.sauce && cartItem.options.sauce !== 'None' && <div>Sauce: {cartItem.options.sauce}</div>}
                        {cartItem.options.notes && <div className="italic">"{cartItem.options.notes}"</div>}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:bg-red-50" onClick={() => handleRemoveFromCart(idx)}>
                      <Icons.Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsCartOpen(false)}>Continue Shopping</Button>
            <Button onClick={handleSendOrder} className="bg-orange-600 hover:bg-orange-700">
              Send Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
