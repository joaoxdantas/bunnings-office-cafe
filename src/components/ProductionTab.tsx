import React, { useState } from 'react';
import { useAppContext } from '../context';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, PlayCircle, FileText } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MenuItem } from '../types';

export default function ProductionTab() {
  const { orders, items, updateOrderStatus } = useAppContext();
  const [recipeItem, setRecipeItem] = useState<MenuItem | null>(null);

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing')
    .sort((a, b) => a.createdAt - b.createdAt);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderIcon = (iconName: string) => {
    if (iconName?.startsWith('data:image') || iconName?.startsWith('http')) {
      return <img src={iconName} alt="Item" className="w-full h-full object-cover rounded-xl" />;
    }
    const Icon = (Icons as any)[iconName] || Icons.Coffee;
    return <Icon className="w-12 h-12 text-white" />;
  };

  const getMilkColor = (milkName: string) => {
    const milk = milks.find(m => m.name === milkName);
    return milk?.color || '#3B82F6';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-800">Production Queue</h2>
        <Badge variant="secondary" className="text-sm">
          {pendingOrders.length} {pendingOrders.length === 1 ? 'order' : 'orders'} in queue
        </Badge>
      </div>

      {pendingOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">All clear!</h3>
          <p className="text-slate-500">There are no orders in the production queue right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {pendingOrders.map(order => (
            <Card key={order.id} className={`border-l-4 ${order.status === 'preparing' ? 'border-l-orange-500' : 'border-l-slate-300'} bg-[#FFFDF7]`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-slate-500 font-normal">Order #{order.id.slice(-4).toUpperCase()}</CardTitle>
                    <p className="mt-1 text-2xl font-bold text-slate-900 uppercase tracking-tight">{order.customerName}</p>
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTime(order.createdAt)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((orderItem, idx) => {
                  const itemDef = items.find(i => i.id === orderItem.itemId);
                  return (
                    <div key={orderItem.id} className="relative flex bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm h-28">
                      {/* Top Right Orange Tag */}
                      <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                        #{orderItem.quantity}
                      </div>

                      {/* Left Black Section */}
                      <div className="w-24 bg-black flex items-center justify-center flex-shrink-0">
                        {itemDef && renderIcon(itemDef.icon)}
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 p-4 flex items-center justify-between">
                        {/* Item Name & Number */}
                        <div className="flex flex-col justify-center min-w-[120px]">
                          <span className="text-slate-400 text-sm font-medium">
                            {String(idx).padStart(2, '0')}
                          </span>
                          <span className="text-orange-500 font-bold text-2xl leading-tight">
                            {itemDef?.name || 'Unknown'}
                          </span>
                        </div>

                        {/* Options Pills */}
                        <div className="flex flex-col gap-2 flex-1 px-8">
                          <div className="flex items-center gap-2 flex-wrap">
                            {itemDef?.hasMilk && orderItem.options.milk && (
                              <div 
                                className="px-3 py-1.5 rounded-md font-bold text-sm flex items-center gap-4 min-w-[180px]"
                                style={{ backgroundColor: getMilkColor(orderItem.options.milk), color: '#fff' }}
                              >
                                <span className="opacity-90 font-medium">Milk</span>
                                <span>{orderItem.options.milk.toUpperCase()}</span>
                              </div>
                            )}
                            {itemDef?.hasSugar && (
                              <div className="border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-bold text-sm flex items-center justify-between min-w-[180px] bg-white">
                                <span className="opacity-80 font-medium">Sugar</span>
                                <span>{orderItem.options.sugar}</span>
                              </div>
                            )}
                            {itemDef?.hasSugar && orderItem.options.sweetener && orderItem.options.sweetener > 0 ? (
                              <div className="border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-bold text-sm flex items-center justify-between min-w-[180px] bg-white">
                                <span className="opacity-80 font-medium">Sweetener</span>
                                <span>{orderItem.options.sweetener}</span>
                              </div>
                            ) : null}
                            {itemDef?.hasSyrup && orderItem.options.syrup && orderItem.options.syrup !== 'None' && (
                              <div className="border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-bold text-sm flex items-center justify-between min-w-[180px] bg-white">
                                <span className="opacity-80 font-medium">Syrup</span>
                                <span>{orderItem.options.syrup}</span>
                              </div>
                            )}
                            {itemDef?.hasSauce && orderItem.options.sauce && orderItem.options.sauce !== 'None' && (
                              <div className="border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-bold text-sm flex items-center justify-between min-w-[180px] bg-white">
                                <span className="opacity-80 font-medium">Sauce</span>
                                <span>{orderItem.options.sauce}</span>
                              </div>
                            )}
                            {orderItem.options.notes && (
                              <div className="border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-bold text-sm flex items-center gap-2 max-w-[150px] truncate bg-white">
                                <span className="opacity-80 font-medium">Notes</span>
                                <span className="truncate">{orderItem.options.notes}</span>
                              </div>
                            )}
                            {itemDef?.recipe && (
                              <Button 
                                variant="secondary" 
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold h-8"
                                onClick={() => setRecipeItem(itemDef)}
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                Recipe
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
              <CardFooter className="pt-0 justify-end gap-2">
                {order.status === 'pending' ? (
                  <Button 
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                    className="bg-orange-100 text-orange-700 hover:bg-orange-200"
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start Preparing
                  </Button>
                ) : (
                  <Button 
                    onClick={() => updateOrderStatus(order.id, order.preScanned ? 'delivered' : 'completed')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Complete Order
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Recipe Dialog */}
      <Dialog open={!!recipeItem} onOpenChange={(open) => !open && setRecipeItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recipe: {recipeItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-slate-700 whitespace-pre-wrap">
            {recipeItem?.recipe || 'No recipe provided.'}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
