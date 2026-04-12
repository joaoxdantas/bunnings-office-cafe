/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppProvider } from './context';
import MenuTab from './components/MenuTab';
import ProductionTab from './components/ProductionTab';
import AdminTab from './components/AdminTab';
import CompletedTab from './components/CompletedTab';
import HistoryTab from './components/HistoryTab';
import CashierTab from './components/CashierTab';
import { Coffee, ChefHat, Settings, ArrowLeft, ScanLine, History, MonitorSmartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

function MainApp() {
  const [view, setView] = useState<'home' | 'menu' | 'admin'>('home');
  const [customerName, setCustomerName] = useState('');
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [tempName, setTempName] = useState('');

  const handleOrderClick = () => {
    setTempName(customerName);
    setIsNameModalOpen(true);
  };

  const handleStartOrder = () => {
    if (tempName.trim()) {
      setCustomerName(tempName.trim());
      setIsNameModalOpen(false);
      setView('menu');
    }
  };

  if (view === 'home') {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex flex-col items-center justify-center relative">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-3 text-orange-600">
            <Coffee className="w-12 h-12" />
            <h1 className="text-4xl font-bold tracking-tight">Café Flow</h1>
          </div>
          
          <Button 
            onClick={handleOrderClick}
            className="bg-orange-600 hover:bg-orange-700 text-white text-2xl py-8 px-16 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Order
          </Button>
        </div>

        <Button 
          variant="ghost" 
          className="absolute bottom-6 text-slate-400 hover:text-slate-600"
          onClick={() => setView('admin')}
        >
          Admin
        </Button>

        <Dialog open={isNameModalOpen} onOpenChange={setIsNameModalOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Welcome! What's your name?</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="name" className="sr-only">Name</Label>
              <Input 
                id="name" 
                placeholder="Enter your name..." 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStartOrder()}
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNameModalOpen(false)}>Cancel</Button>
              <Button onClick={handleStartOrder} className="bg-orange-600 hover:bg-orange-700">Continue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (view === 'menu') {
    return (
      <div className="min-h-screen bg-[#FFFDF7] text-slate-900 font-sans pb-24">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setView('home')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 text-orange-600">
              <Coffee className="w-6 h-6" />
              <h1 className="text-xl font-bold tracking-tight">Café Flow</h1>
            </div>
          </div>
          <div className="font-medium text-slate-600">
            Hello, {customerName}
          </div>
        </header>

        <main className="max-w-5xl mx-auto p-4 sm:p-6">
          <MenuTab customerName={customerName} onOrderSent={() => setView('home')} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => setView('home')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2 text-orange-600">
          <Coffee className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight">Café Flow Admin</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 sm:p-6">
        <Tabs defaultValue="production" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="production" className="flex items-center gap-2">
              <ChefHat className="w-4 h-4" />
              <span>Production</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <ScanLine className="w-4 h-4" />
              <span>Scanning</span>
            </TabsTrigger>
            <TabsTrigger value="cashier" className="flex items-center gap-2">
              <MonitorSmartphone className="w-4 h-4" />
              <span>Cashier</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="production" className="focus-visible:outline-none focus-visible:ring-0">
            <ProductionTab />
          </TabsContent>
          <TabsContent value="completed" className="focus-visible:outline-none focus-visible:ring-0">
            <CompletedTab />
          </TabsContent>
          <TabsContent value="cashier" className="focus-visible:outline-none focus-visible:ring-0">
            <CashierTab />
          </TabsContent>
          <TabsContent value="admin" className="focus-visible:outline-none focus-visible:ring-0">
            <AdminTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

