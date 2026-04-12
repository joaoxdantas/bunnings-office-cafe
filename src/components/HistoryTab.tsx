import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, BarChart3, List } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HistoryTab() {
  const { orders, items, categories } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => b.createdAt - a.createdAt);

  const analyticsData = useMemo(() => {
    const data: Record<string, Record<string, number>> = {}; // date -> category -> count
    
    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString();
      if (!data[date]) data[date] = {};
      
      order.items.forEach(oi => {
        const itemDef = items.find(i => i.id === oi.itemId);
        if (itemDef) {
          const categoryDef = categories.find(c => c.id === itemDef.categoryId);
          const catName = categoryDef?.name || 'Unknown';
          data[date][catName] = (data[date][catName] || 0) + oi.quantity;
        }
      });
    });
    
    return data;
  }, [orders, items, categories]);

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Status', 'Items', 'Notes'];
    const csvRows = [headers.join(',')];

    filteredOrders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleString();
      const itemsStr = order.items.map(oi => {
        const itemDef = items.find(i => i.id === oi.itemId);
        return `${oi.quantity}x ${itemDef?.name || 'Unknown'}`;
      }).join('; ');
      const notesStr = order.items.map(oi => oi.options.notes).filter(Boolean).join('; ');

      const row = [
        order.id,
        `"${date}"`,
        `"${order.customerName}"`,
        order.status,
        `"${itemsStr}"`,
        `"${notesStr}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cafe_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-800">History & Analytics</h2>
        <Button onClick={handleExportCSV} className="bg-green-600 hover:bg-green-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="w-4 h-4" /> Orders List
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search by customer or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No orders found.</td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{new Date(order.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{order.id.slice(-6).toUpperCase()}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{order.customerName}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {order.items.map(oi => {
                            const itemDef = items.find(i => i.id === oi.itemId);
                            return `${oi.quantity}x ${itemDef?.name || 'Unknown'}`;
                          }).join(', ')}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={order.status === 'delivered' ? 'default' : order.status === 'completed' ? 'secondary' : 'outline'}>
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(analyticsData).map(([date, categoriesData]) => (
              <Card key={date}>
                <CardHeader>
                  <CardTitle className="text-lg">Sales for {date}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(categoriesData).map(([catName, count]) => (
                      <div key={catName} className="flex items-center justify-between">
                        <span className="text-slate-600 font-medium">{catName}</span>
                        <span className="font-bold text-slate-900">{count} items</span>
                      </div>
                    ))}
                    {Object.keys(categoriesData).length === 0 && (
                      <p className="text-slate-500 text-sm">No sales data for this date.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {Object.keys(analyticsData).length === 0 && (
              <p className="text-slate-500 col-span-2 text-center py-8">No analytics data available yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
