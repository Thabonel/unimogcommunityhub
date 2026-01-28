import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, ExternalLink, Package } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AmazonProduct, buildAmazonAffiliateLink, extractASINFromUrl } from '@/utils/amazonAffiliate';
import { AMAZON_REGIONS } from '@/services/amazonAffiliateService';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

const CATEGORIES = [
  { value: 'recovery_gear', label: 'Recovery Gear' },
  { value: 'camping_expedition', label: 'Camping & Expedition' },
  { value: 'tools_maintenance', label: 'Tools & Maintenance' },
  { value: 'parts_upgrades', label: 'Parts & Upgrades' },
  { value: 'books_manuals', label: 'Books & Manuals' },
  { value: 'apparel_merchandise', label: 'Apparel & Merchandise' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'outdoor_gear', label: 'Outdoor Gear' },
];

export function AmazonProductsManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AmazonProduct | null>(null);
  const [asinInput, setAsinInput] = useState('');
  const [detectedCurrency, setDetectedCurrency] = useState<string>('USD');
  const queryClient = useQueryClient();

  const detectCurrencyFromUrl = (urlOrAsin: string): string => {
    const url = urlOrAsin.toLowerCase();
    if (url.includes('amazon.com.au')) return 'AUD';
    if (url.includes('amazon.de')) return 'EUR';
    if (url.includes('amazon.fr')) return 'EUR';
    if (url.includes('amazon.it')) return 'EUR';
    if (url.includes('amazon.es')) return 'EUR';
    if (url.includes('amazon.co.uk')) return 'GBP';
    return 'USD';
  };

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['amazon-products-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('affiliate_products')
        .select('*')
        .eq('affiliate_provider', 'amazon')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AmazonProduct[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (product: Partial<AmazonProduct>) => {
      const { data, error } = await supabase
        .from('affiliate_products')
        .insert([{ ...product, affiliate_provider: 'amazon' }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amazon-products-admin'] });
      queryClient.invalidateQueries({ queryKey: ['amazon-products'] });
      toast({ title: 'Amazon product created successfully' });
      setDialogOpen(false);
      setEditingProduct(null);
      setAsinInput('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating product',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...product }: Partial<AmazonProduct> & { id: string }) => {
      const { data, error } = await supabase
        .from('affiliate_products')
        .update(product)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amazon-products-admin'] });
      queryClient.invalidateQueries({ queryKey: ['amazon-products'] });
      toast({ title: 'Amazon product updated successfully' });
      setDialogOpen(false);
      setEditingProduct(null);
      setAsinInput('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating product',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('affiliate_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amazon-products-admin'] });
      queryClient.invalidateQueries({ queryKey: ['amazon-products'] });
      toast({ title: 'Amazon product deleted successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting product',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (reorderedProducts: Array<{ id: string; sort_order: number }>) => {
      const updates = reorderedProducts.map(({ id, sort_order }) =>
        supabase
          .from('affiliate_products')
          .update({ sort_order })
          .eq('id', id)
      );

      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error);
      if (errors.length > 0) throw errors[0].error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amazon-products-admin'] });
      queryClient.invalidateQueries({ queryKey: ['amazon-products'] });
      toast({ title: 'Product order updated successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating product order',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = products.findIndex(p => p.id === active.id);
    const newIndex = products.findIndex(p => p.id === over.id);

    const reordered = [...products];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);

    const updates = reordered.map((product, index) => ({
      id: product.id,
      sort_order: index,
    }));

    queryClient.setQueryData(['amazon-products-admin'], reordered);
    reorderMutation.mutate(updates);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let asin = formData.get('asin') as string;
    const asinExtracted = extractASINFromUrl(asin);
    if (asinExtracted) {
      asin = asinExtracted;
    }

    const amazonUrl = `https://www.amazon.com/dp/${asin}`;
    const tags = (formData.get('tags') as string || '')
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const product = {
      asin: asin.trim(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      currency: formData.get('currency') as string || 'USD',
      category: formData.get('category') as string,
      image_url: formData.get('image_url') as string,
      affiliate_url: amazonUrl,
      is_active: formData.get('is_active') === 'on',
      sort_order: parseInt(formData.get('sort_order') as string || '0'),
      tags,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, ...product });
    } else {
      createMutation.mutate(product);
    }
  };

  const activeCount = products.filter(p => p.is_active).length;

  const SortableRow = ({ product }: { product: AmazonProduct }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: product.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <TableRow ref={setNodeRef} style={style} key={product.id}>
        <TableCell>
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing touch-none p-1 hover:bg-gray-100 rounded"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-12 h-12 object-cover rounded"
              />
            )}
            <div className="font-medium max-w-xs truncate">{product.title}</div>
          </div>
        </TableCell>
        <TableCell>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
            {product.asin}
          </code>
        </TableCell>
        <TableCell>
          {CATEGORIES.find(c => c.value === product.category)?.label}
        </TableCell>
        <TableCell>
          {product.currency} {product.price?.toFixed(2)}
        </TableCell>
        <TableCell>
          <Badge variant={product.is_active ? 'default' : 'secondary'}>
            {product.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(buildAmazonAffiliateLink(product.asin), '_blank')}
              title="View on Amazon (with affiliate tag)"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingProduct(product);
                setAsinInput(product.asin);
                setDetectedCurrency(product.currency || 'USD');
                setDialogOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm('Are you sure you want to delete this Amazon product?')) {
                  deleteMutation.mutate(product.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Amazon Products Management</h2>
        <p className="text-muted-foreground">
          Manage Amazon affiliate products using your Associates ID: wheelsandwins-22
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-[#FF9900]" />
              <span className="text-2xl font-bold">{products.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inactive Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-400">{products.length - activeCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Amazon Products</CardTitle>
              <CardDescription>
                Add products by ASIN or Amazon URL. Affiliate links are automatically generated.
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingProduct(null);
                  setAsinInput('');
                  setDetectedCurrency('USD');
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent
                className="max-w-2xl max-h-[90vh] overflow-y-auto"
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Edit Amazon Product' : 'Add Amazon Product'}
                  </DialogTitle>
                  <DialogDescription>
                    Enter the ASIN or paste an Amazon product URL. Affiliate link will be generated automatically.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="asin">ASIN or Amazon URL</Label>
                    <Input
                      id="asin"
                      name="asin"
                      defaultValue={editingProduct?.asin}
                      value={asinInput}
                      onChange={(e) => {
                        const value = e.target.value;
                        setAsinInput(value);
                        const currency = detectCurrencyFromUrl(value);
                        setDetectedCurrency(currency);
                      }}
                      required
                      placeholder="B00EXAMPLE or https://amazon.com.au/dp/B00EXAMPLE"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the 10-character ASIN code or paste the full Amazon product URL. Currency auto-detects from domain.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Product Title</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={editingProduct?.title}
                      required
                      placeholder="e.g., Unimog Portal Axle Seal Kit"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={editingProduct?.description}
                      rows={3}
                      placeholder="Product description (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" defaultValue={editingProduct?.category} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        defaultValue={editingProduct?.price}
                        required
                        placeholder="99.99"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select name="currency" value={detectedCurrency} onValueChange={setDetectedCurrency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Auto-detected from Amazon URL. Override if needed.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      name="image_url"
                      type="url"
                      defaultValue={editingProduct?.image_url}
                      placeholder="https://m.media-amazon.com/images/I/..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Right-click on Amazon product image and copy image address
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      name="tags"
                      defaultValue={editingProduct?.tags?.join(', ')}
                      placeholder="unimog, parts, maintenance"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sort_order">Sort Order</Label>
                      <Input
                        id="sort_order"
                        name="sort_order"
                        type="number"
                        defaultValue={editingProduct?.sort_order || 0}
                        placeholder="0"
                      />
                    </div>

                    <div className="flex items-end">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_active"
                          name="is_active"
                          defaultChecked={editingProduct?.is_active ?? true}
                        />
                        <Label htmlFor="is_active">Active</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false);
                        setEditingProduct(null);
                        setAsinInput('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No Amazon products yet. Add your first product to get started.
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>ASIN</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <SortableContext items={products.map(p => p.id)} strategy={verticalListSortingStrategy}>
                  <TableBody>
                    {products.map((product) => (
                      <SortableRow key={product.id} product={product} />
                    ))}
                  </TableBody>
                </SortableContext>
              </Table>
            </DndContext>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
