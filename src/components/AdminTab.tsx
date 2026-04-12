import React, { useState } from 'react';
import { useAppContext } from '../context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { MenuItem } from '../types';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HistoryTab from './HistoryTab';

export default function AdminTab() {
  const { 
    categories, items, milks, syrups, sauces,
    addCategory, updateCategory, deleteCategory, 
    addItem, updateItem, deleteItem,
    addMilk, updateMilk, deleteMilk,
    addSyrup, updateSyrup, deleteSyrup,
    addSauce, updateSauce, deleteSauce
  } = useAppContext();
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#f1f5f9');

  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [optionType, setOptionType] = useState<'milk' | 'syrup' | 'sauce'>('milk');
  const [editingOption, setEditingOption] = useState<any | null>(null);
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionColor, setNewOptionColor] = useState('#ffffff');

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  const [itemForm, setItemForm] = useState<Partial<MenuItem>>({
    name: '',
    subtitle: '',
    categoryId: '',
    icon: 'Coffee',
    barcode: '',
    prepTime: 3,
    available: true,
    recipe: '',
    hasMilk: true,
    hasSugar: true,
    hasSyrup: true,
    hasSauce: true
  });

  const handleOpenCategoryModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setNewCategoryName(category.name);
      setNewCategoryColor(category.color || '#f1f5f9');
    } else {
      setEditingCategory(null);
      setNewCategoryName('');
      setNewCategoryColor('#f1f5f9');
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (newCategoryName.trim()) {
      if (editingCategory) {
        updateCategory(editingCategory.id, newCategoryName, newCategoryColor);
      } else {
        addCategory(newCategoryName, newCategoryColor);
      }
      setIsCategoryModalOpen(false);
    }
  };

  const handleOpenOptionModal = (type: 'milk' | 'syrup' | 'sauce', option?: any) => {
    setOptionType(type);
    if (option) {
      setEditingOption(option);
      setNewOptionName(option.name);
      setNewOptionColor(option.color);
    } else {
      setEditingOption(null);
      setNewOptionName('');
      setNewOptionColor('#ffffff');
    }
    setIsOptionModalOpen(true);
  };

  const handleSaveOption = () => {
    if (newOptionName.trim()) {
      if (optionType === 'milk') {
        if (editingOption) updateMilk(editingOption.id, newOptionName, newOptionColor);
        else addMilk(newOptionName, newOptionColor);
      } else if (optionType === 'syrup') {
        if (editingOption) updateSyrup(editingOption.id, newOptionName, newOptionColor);
        else addSyrup(newOptionName, newOptionColor);
      } else if (optionType === 'sauce') {
        if (editingOption) updateSauce(editingOption.id, newOptionName, newOptionColor);
        else addSauce(newOptionName, newOptionColor);
      }
      setIsOptionModalOpen(false);
    }
  };

  const handleOpenItemModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setItemForm(item);
    } else {
      setEditingItem(null);
      setItemForm({
        name: '',
        subtitle: '',
        categoryId: categories[0]?.id || '',
        icon: 'Coffee',
        barcode: '',
        prepTime: 3,
        available: true,
        recipe: '',
        hasMilk: true,
        hasSugar: true,
        hasSyrup: true,
        hasSauce: true
      });
    }
    setIsItemModalOpen(true);
  };

  const getAutoIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('tea')) return 'Leaf';
    if (lower.includes('water')) return 'GlassWater';
    if (lower.includes('beer')) return 'Beer';
    if (lower.includes('wine')) return 'Wine';
    if (lower.includes('juice') || lower.includes('soda')) return 'CupSoda';
    if (lower.includes('milk')) return 'Milk';
    if (lower.includes('cake') || lower.includes('cookie') || lower.includes('food')) return 'Croissant';
    return 'Coffee';
  };

  const handleSaveItem = () => {
    if (!itemForm.name || !itemForm.categoryId) return;
    
    let finalIcon = itemForm.icon;
    if (!finalIcon || (!finalIcon.startsWith('data:image') && !finalIcon.startsWith('http'))) {
      finalIcon = getAutoIcon(itemForm.name);
    }

    const finalItem = {
      ...itemForm,
      icon: finalIcon
    };
    
    if (editingItem) {
      updateItem(editingItem.id, finalItem);
    } else {
      addItem(finalItem as Omit<MenuItem, 'id'>);
    }
    setIsItemModalOpen(false);
  };

  return (
    <Tabs defaultValue="menu" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="menu">Menu Management</TabsTrigger>
        <TabsTrigger value="history">History & Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="menu" className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categories Management */}
          <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Categories</CardTitle>
              <Button variant="outline" size="icon" onClick={() => handleOpenCategoryModal()}>
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mt-4">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center justify-between p-2 rounded border border-slate-100" style={{ backgroundColor: category.color || '#f1f5f9' }}>
                    <span className="font-medium">{category.name}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 bg-white/50 hover:bg-white" onClick={() => handleOpenCategoryModal(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 bg-white/50 hover:bg-white" onClick={() => deleteCategory(category.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No categories added.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Milks */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm text-slate-600">Milks</h4>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => handleOpenOptionModal('milk')}>
                      <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {milks.map(milk => (
                      <div key={milk.id} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: milk.color }}></div>
                          <span className="font-medium text-sm">{milk.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-500" onClick={() => handleOpenOptionModal('milk', milk)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => deleteMilk(milk.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Syrups */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm text-slate-600">Syrups</h4>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => handleOpenOptionModal('syrup')}>
                      <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {syrups.map(syrup => (
                      <div key={syrup.id} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: syrup.color }}></div>
                          <span className="font-medium text-sm">{syrup.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-500" onClick={() => handleOpenOptionModal('syrup', syrup)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => deleteSyrup(syrup.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sauces */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm text-slate-600">Sauces</h4>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => handleOpenOptionModal('sauce')}>
                      <Plus className="w-3 h-3 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {sauces.map(sauce => (
                      <div key={sauce.id} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sauce.color }}></div>
                          <span className="font-medium text-sm">{sauce.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-500" onClick={() => handleOpenOptionModal('sauce', sauce)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => deleteSauce(sauce.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items Management */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Menu Items</CardTitle>
            <Button className="bg-slate-900 text-white" onClick={() => handleOpenItemModal()}>
              <Plus className="h-4 w-4 mr-2" /> New Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-4">
              {items.map(item => {
                const category = categories.find(c => c.id === item.categoryId);
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900">{item.name}</h4>
                        {!item.available && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Unavailable</span>}
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-4 mt-1">
                        <span>Category: {category?.name || 'Unknown'}</span>
                        <span>Time: {item.prepTime} min</span>
                        <span>Code: {item.barcode || '-'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`available-${item.id}`} className="text-xs text-slate-500">Available</Label>
                        <Switch 
                          id={`available-${item.id}`}
                          checked={item.available} 
                          onCheckedChange={(checked) => updateItem(item.id, { available: checked })}
                        />
                      </div>
                      <Button variant="outline" size="icon" onClick={() => handleOpenItemModal(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600" onClick={() => deleteItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              {items.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-8">No items in the menu.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input 
                id="categoryName" 
                value={newCategoryName} 
                onChange={e => setNewCategoryName(e.target.value)} 
                placeholder="Ex: Cold Drinks"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categoryColor">Background Color</Label>
              <div className="flex gap-2">
                <Input 
                  id="categoryColor" 
                  type="color"
                  value={newCategoryColor} 
                  onChange={e => setNewCategoryColor(e.target.value)} 
                  className="w-16 h-10 p-1"
                />
                <Input 
                  value={newCategoryColor} 
                  onChange={e => setNewCategoryColor(e.target.value)} 
                  placeholder="#HexColor"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveCategory}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Option Modal */}
      <Dialog open={isOptionModalOpen} onOpenChange={setIsOptionModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{editingOption ? `Edit ${optionType}` : `New ${optionType}`}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="optionName">Name</Label>
              <Input 
                id="optionName" 
                value={newOptionName} 
                onChange={e => setNewOptionName(e.target.value)} 
                placeholder={`Ex: ${optionType === 'milk' ? 'Oat' : optionType === 'syrup' ? 'Vanilla' : 'Caramel'}`}
              />
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                <Input 
                  type="color" 
                  value={newOptionColor} 
                  onChange={e => setNewOptionColor(e.target.value)} 
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input 
                  value={newOptionColor} 
                  onChange={e => setNewOptionColor(e.target.value)} 
                  placeholder="#HexColor"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOptionModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveOption}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Modal */}
      <Dialog open={isItemModalOpen} onOpenChange={setIsItemModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Item' : 'New Item'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input 
                  id="itemName" 
                  value={itemForm.name} 
                  onChange={e => setItemForm({...itemForm, name: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="itemSubtitle">Subtitle</Label>
                <Input 
                  id="itemSubtitle" 
                  value={itemForm.subtitle || ''} 
                  onChange={e => setItemForm({...itemForm, subtitle: e.target.value})} 
                  placeholder="Ex: 1 shots"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="itemCategory">Category</Label>
                <Select 
                  value={itemForm.categoryId} 
                  onValueChange={val => setItemForm({...itemForm, categoryId: val})}
                >
                  <SelectTrigger id="itemCategory">
                    <SelectValue placeholder="Select">
                      {categories.find(c => c.id === itemForm.categoryId)?.name || "Select"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="itemTime">Prep Time (min)</Label>
                <Input 
                  id="itemTime" 
                  type="number" 
                  min="1"
                  value={itemForm.prepTime} 
                  onChange={e => setItemForm({...itemForm, prepTime: parseInt(e.target.value) || 0})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="itemBarcode">Barcode</Label>
                <Input 
                  id="itemBarcode" 
                  value={itemForm.barcode} 
                  onChange={e => setItemForm({...itemForm, barcode: e.target.value})} 
                  placeholder="Ex: 7891234567890"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="itemImage">Image (Upload or URL)</Label>
              <div className="flex items-center gap-3">
                {itemForm.icon && (itemForm.icon.startsWith('data:image') || itemForm.icon.startsWith('http')) ? (
                  <img src={itemForm.icon} alt="Preview" className="w-10 h-10 object-cover rounded-md border border-slate-200 flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center flex-shrink-0">
                    {React.createElement((Icons as any)[getAutoIcon(itemForm.name || '')] || Icons.Coffee, { className: "w-5 h-5 text-slate-400" })}
                  </div>
                )}
                <Input
                  id="itemImage"
                  type="file"
                  accept="image/*"
                  className="flex-1 cursor-pointer"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setItemForm({...itemForm, icon: reader.result as string});
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <Input
                  placeholder="Or paste image URL..."
                  value={itemForm.icon?.startsWith('http') ? itemForm.icon : ''}
                  onChange={e => setItemForm({...itemForm, icon: e.target.value})}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="itemRecipe">Recipe / Instructions</Label>
              <Textarea 
                id="itemRecipe" 
                value={itemForm.recipe} 
                onChange={e => setItemForm({...itemForm, recipe: e.target.value})} 
                placeholder="Ex: 1 shot of espresso, 150ml milk..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="itemHasMilk" 
                  checked={itemForm.hasMilk} 
                  onCheckedChange={checked => setItemForm({...itemForm, hasMilk: checked as boolean})}
                />
                <Label htmlFor="itemHasMilk">Has Milk Option</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="itemHasSugar" 
                  checked={itemForm.hasSugar} 
                  onCheckedChange={checked => setItemForm({...itemForm, hasSugar: checked as boolean})}
                />
                <Label htmlFor="itemHasSugar">Has Sugar Option</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="itemHasSyrup" 
                  checked={itemForm.hasSyrup} 
                  onCheckedChange={checked => setItemForm({...itemForm, hasSyrup: checked as boolean})}
                />
                <Label htmlFor="itemHasSyrup">Has Syrup Option</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="itemHasSauce" 
                  checked={itemForm.hasSauce} 
                  onCheckedChange={checked => setItemForm({...itemForm, hasSauce: checked as boolean})}
                />
                <Label htmlFor="itemHasSauce">Has Sauce Option</Label>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Switch 
                id="itemAvailable" 
                checked={itemForm.available} 
                onCheckedChange={checked => setItemForm({...itemForm, available: checked})}
              />
              <Label htmlFor="itemAvailable">Item available for sale</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsItemModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveItem}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </TabsContent>

      <TabsContent value="history">
        <HistoryTab />
      </TabsContent>
    </Tabs>
  );
}
