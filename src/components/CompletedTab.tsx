import React from 'react';
import { useAppContext } from '../context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Trash2, Check } from 'lucide-react';
import Barcode from 'react-barcode';

export default function CompletedTab() {
  const { orders, items, updateOrderStatus } = useAppContext();

  const completedOrders = orders.filter(o => o.status === 'completed' && !o.preScanned)
    .sort((a, b) => b.createdAt - a.createdAt); // Newest first

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handlePurgeAll = () => {
    completedOrders.forEach(order => {
      updateOrderStatus(order.id, 'delivered');
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-slate-800">Completed Orders (Scanning)</h2>
          <Badge variant="secondary" className="text-sm">
            {completedOrders.length} {completedOrders.length === 1 ? 'order' : 'orders'} completed
          </Badge>
        </div>
        {completedOrders.length > 0 && (
          <Button onClick={handlePurgeAll} variant="destructive" className="bg-red-500 hover:bg-red-600">
            <Trash2 className="w-4 h-4 mr-2" />
            Purge All
          </Button>
        )}
      </div>

      {completedOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No completed orders yet.</h3>
          <p className="text-slate-500">Orders will appear here once they are marked as completed in production.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {completedOrders.map(order => (
            <Card key={order.id} className="border-l-4 border-l-green-500 bg-white flex flex-col">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-slate-500 font-normal">Order #{order.id.slice(-4).toUpperCase()}</CardTitle>
                    <p className="mt-1 text-3xl font-bold text-slate-900 uppercase tracking-tight">{order.customerName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center text-sm text-slate-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(order.createdAt)}
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Conclude
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-6 flex-1">
                {order.items.map((orderItem, idx) => {
                  const itemDef = items.find(i => i.id === orderItem.itemId);
                  return (
                    <div key={orderItem.id} className="flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-slate-800">
                            {orderItem.quantity}x {itemDef?.name || 'Unknown'}
                          </h4>
                          <div className="text-sm text-slate-600 mt-1 flex flex-wrap gap-2">
                            {itemDef?.hasMilk && orderItem.options.milk && orderItem.options.milk !== 'Full Cream' && (
                              <Badge variant="outline" className="bg-slate-50">{orderItem.options.milk}</Badge>
                            )}
                            {itemDef?.hasSugar && orderItem.options.sugar && orderItem.options.sugar > 0 ? (
                              <Badge variant="outline" className="bg-slate-50">Sugar: {orderItem.options.sugar}</Badge>
                            ) : null}
                            {itemDef?.hasSugar && orderItem.options.sweetener && orderItem.options.sweetener > 0 ? (
                              <Badge variant="outline" className="bg-slate-50">Sweetener: {orderItem.options.sweetener}</Badge>
                            ) : null}
                            {itemDef?.hasSyrup && orderItem.options.syrup && orderItem.options.syrup !== 'None' && (
                              <Badge variant="outline" className="bg-slate-50">Syrup: {orderItem.options.syrup}</Badge>
                            )}
                            {itemDef?.hasSauce && orderItem.options.sauce && orderItem.options.sauce !== 'None' && (
                              <Badge variant="outline" className="bg-slate-50">Sauce: {orderItem.options.sauce}</Badge>
                            )}
                            {orderItem.options.notes && (
                              <Badge variant="outline" className="bg-slate-50">Note: {orderItem.options.notes}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Large Barcode for Scanning */}
                      {itemDef?.barcode && (
                        <div className="bg-slate-50 p-4 rounded-lg flex justify-center border border-slate-200">
                          <Barcode 
                            value={itemDef.barcode} 
                            width={2.5} 
                            height={80} 
                            displayValue={true} 
                            margin={0}
                            background="transparent"
                          />
                        </div>
                      )}
                      
                      {/* Separator between items */}
                      {idx < order.items.length - 1 && <div className="h-px bg-slate-100 w-full mt-4" />}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
