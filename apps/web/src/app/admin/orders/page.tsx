'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { RoleGuard } from '@/components/auth/role-guard';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  Plus,
  Calendar,
  RotateCcw,
  Filter,
  Search,
  Eye,
  Printer,
  MoreVertical,
  X,
  User,
  Clock,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LayoutList,
  CheckSquare,
  XCircle
} from 'lucide-react';
import apiClient from '@/services/apiClient';
import { cn } from '@/lib/utils';

type OrderItem = {
  item_id: string;
  item_name: string;
  quantity: number;
  price_at_billing: number;
};

type Order = {
  order_id: string;
  table_id: string;
  order_phase: number;
  status: 'open' | 'sent_to_kitchen' | 'billed' | 'cancelled' | 'completed';
  items: OrderItem[];
  created_at?: string;
  waiter_name?: string;
  guests?: number;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await apiClient.get<Order[]>('/orders');
      
      const ordersData = response.data || [];
      
      setOrders(ordersData);
      if (ordersData.length > 0 && !selectedOrder) {
        setSelectedOrder(ordersData[0]); // Select first order by default to show panel
      }
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Failed to load orders.');
    } finally {
      setIsLoading(false);
    }
  }

  const statusBadge = (status: Order['status']) => {
    switch (status) {
      case 'open':
      case 'sent_to_kitchen':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Running</Badge>;
      case 'completed':
      case 'billed':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + (item.quantity * (item.price_at_billing || 100)), 0);
  };

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders;
    if (activeTab === 'running') return orders.filter(o => o.status === 'open' || o.status === 'sent_to_kitchen');
    if (activeTab === 'completed') return orders.filter(o => o.status === 'completed' || o.status === 'billed');
    if (activeTab === 'cancelled') return orders.filter(o => o.status === 'cancelled');
    return orders;
  }, [orders, activeTab]);

  return (
    <RoleGuard allowedRoles={['superadmin', 'admin', 'manager', 'staff']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Top Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Orders</h1>
              <p className="text-sm text-muted-foreground">
                View and manage all restaurant orders
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white border rounded-md px-3 py-2 text-sm text-muted-foreground shadow-sm">
                <Calendar className="w-4 h-4" />
                <span>15 May 2025</span>
              </div>
              <div className="relative cursor-pointer">
                <Bell className="w-6 h-6 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                  3
                </span>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                <Plus className="w-4 h-4" />
                New Order
              </Button>
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          {/* Main Content Area */}
          <Card className="bg-white shadow-sm border-0 ring-1 ring-border rounded-xl overflow-hidden">
            <div className="p-1 border-b">
               {/* Custom Tabs to match design */}
              <div className="flex items-center gap-6 px-4">
                <button 
                  onClick={() => setActiveTab('all')}
                  className={cn("flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors", activeTab === 'all' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
                >
                  <LayoutList className="w-4 h-4" /> All Orders
                </button>
                <button 
                  onClick={() => setActiveTab('running')}
                  className={cn("flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors", activeTab === 'running' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
                >
                  <Clock className="w-4 h-4" /> Running Orders
                </button>
                <button 
                  onClick={() => setActiveTab('completed')}
                  className={cn("flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors", activeTab === 'completed' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
                >
                  <CheckSquare className="w-4 h-4" /> Completed Orders
                </button>
                <button 
                  onClick={() => setActiveTab('cancelled')}
                  className={cn("flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors", activeTab === 'cancelled' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
                >
                  <XCircle className="w-4 h-4" /> Cancelled Orders
                </button>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="p-4 border-b bg-slate-50/50 flex flex-wrap items-center gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground uppercase">Date</label>
                <div className="flex items-center gap-2 bg-white border rounded-md px-3 py-2 text-sm shadow-sm w-[150px] justify-between">
                  <span className="truncate">15 May 2025</span>
                  <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground uppercase">Time Bracket (Custom)</label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Select Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">05:00 AM - 03:33 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground uppercase">Table</label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[120px] bg-white">
                    <SelectValue placeholder="Table" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tables</SelectItem>
                    <SelectItem value="t1">Table 1</SelectItem>
                    <SelectItem value="t2">Table 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground uppercase">Waiter</label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px] bg-white">
                    <SelectValue placeholder="Waiter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Waiters</SelectItem>
                    <SelectItem value="john">John Paul</SelectItem>
                    <SelectItem value="rahul">Rahul</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground uppercase">Order Status</label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px] bg-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[200px] mt-5 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search by Order ID / Table" className="pl-9 bg-white" />
              </div>

              <div className="mt-5 flex items-center gap-2">
                <Button variant="outline" className="text-primary border-primary/20 hover:bg-primary/5 gap-2">
                  <RotateCcw className="w-4 h-4" /> Reset
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                  <Filter className="w-4 h-4" /> Apply Filter
                </Button>
              </div>
            </div>

            {/* Split View Content */}
            <div className="flex flex-col xl:flex-row min-h-[600px] bg-slate-50/30">
              
              {/* Left Side - Table */}
              <div className={cn("p-6 flex-1 transition-all", selectedOrder ? "xl:border-r" : "")}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Orders List</h2>
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Total Orders: {filteredOrders.length}</span>
                </div>

                <div className="bg-white border rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold text-slate-600">Order ID</TableHead>
                        <TableHead className="font-semibold text-slate-600">Table No.</TableHead>
                        <TableHead className="font-semibold text-slate-600">Waiter</TableHead>
                        <TableHead className="font-semibold text-slate-600">Status</TableHead>
                        <TableHead className="font-semibold text-slate-600">Order Time</TableHead>
                        <TableHead className="font-semibold text-slate-600">Items</TableHead>
                        <TableHead className="font-semibold text-slate-600">Amount (₹)</TableHead>
                        <TableHead className="font-semibold text-slate-600 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                            Loading orders...
                          </TableCell>
                        </TableRow>
                      ) : filteredOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                            No orders found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.map((order) => {
                          const isSelected = selectedOrder?.order_id === order.order_id;
                          return (
                            <TableRow 
                              key={order.order_id} 
                              className={cn(
                                "cursor-pointer transition-colors",
                                isSelected ? "bg-primary/5" : "hover:bg-slate-50"
                              )}
                              onClick={() => setSelectedOrder(order)}
                            >
                              <TableCell className="font-medium text-primary uppercase">{order.order_id.substring(0,9)}</TableCell>
                              <TableCell className="font-medium">Table {order.table_id}</TableCell>
                              <TableCell>{order.waiter_name}</TableCell>
                              <TableCell>{statusBadge(order.status)}</TableCell>
                              <TableCell>
                                <div className="flex flex-col text-sm">
                                  <span>15 May 2025</span>
                                  <span className="text-muted-foreground text-xs">02:45 PM</span>
                                </div>
                              </TableCell>
                              <TableCell>{order.items.length} Items</TableCell>
                              <TableCell className="font-semibold">₹ {calculateTotal(order.items).toFixed(2)}</TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center gap-1">
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 rounded-md border border-transparent hover:border-primary/20">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md border border-transparent hover:border-blue-200">
                                    <Printer className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-md">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                  
                  {/* Pagination footer */}
                  <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                    <div>Showing 1 to {Math.min(10, filteredOrders.length)} of {filteredOrders.length} orders</div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="w-8 h-8 rounded-md" disabled><ChevronLeft className="w-4 h-4" /></Button>
                        <Button variant="outline" size="icon" className="w-8 h-8 rounded-md border-primary text-primary bg-primary/5">1</Button>
                        <Button variant="outline" size="icon" className="w-8 h-8 rounded-md">2</Button>
                        <Button variant="outline" size="icon" className="w-8 h-8 rounded-md"><ChevronRight className="w-4 h-4" /></Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Rows per page:</span>
                        <Select defaultValue="10">
                          <SelectTrigger className="w-[70px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Details Panel */}
              {selectedOrder && (
                <div className="w-full xl:w-[450px] bg-white border-l p-0 flex flex-col min-h-full shrink-0 animate-in slide-in-from-right-8 duration-300">
                  <div className="p-5 border-b flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-lg">Order Details</h3>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700" onClick={() => setSelectedOrder(null)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <div className="p-6 flex-1 overflow-y-auto">
                    {/* Header Info */}
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-bold text-primary text-lg uppercase">{selectedOrder.order_id.substring(0,9)}</span>
                      {statusBadge(selectedOrder.status)}
                    </div>
                    
                    {/* Meta Box */}
                    <div className="bg-slate-50 border rounded-xl p-4 space-y-3 mb-6">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                        <div className="flex items-center gap-2 text-slate-500"><LayoutList className="w-4 h-4" /> Table No.</div>
                        <div className="font-medium text-right">Table {selectedOrder.table_id}</div>
                        
                        <div className="flex items-center gap-2 text-slate-500"><User className="w-4 h-4" /> Waiter</div>
                        <div className="font-medium text-right">{selectedOrder.waiter_name}</div>
                        
                        <div className="flex items-center gap-2 text-slate-500"><Clock className="w-4 h-4" /> Order Time</div>
                        <div className="font-medium text-right">15 May 2025, 02:45 PM</div>
                        
                        <div className="flex items-center gap-2 text-slate-500"><User className="w-4 h-4" /> Guests</div>
                        <div className="font-medium text-right">{selectedOrder.guests}</div>
                        
                        <div className="flex items-center gap-2 text-slate-500"><CreditCard className="w-4 h-4" /> Payment Status</div>
                        <div className="text-right">
                           <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 font-normal">Unpaid</Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* Items List */}
                    <h4 className="font-semibold text-sm mb-3">Order Items ({selectedOrder.items.length})</h4>
                    <div className="space-y-3 mb-6">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <div className="flex-1 font-medium">{item.item_name || `Item ${item.item_id}`}</div>
                          <div className="text-slate-500 w-24 text-right">{item.quantity} x ₹ {Number(item.price_at_billing || 100).toFixed(2)}</div>
                          <div className="font-medium w-24 text-right">₹ {(item.quantity * (item.price_at_billing || 100)).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-dashed border-slate-300 pt-4 space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Sub Total</span>
                        <span className="font-medium">₹ {calculateTotal(selectedOrder.items).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Discount</span>
                        <span className="font-medium text-red-500">- ₹ 0.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">CGST (2.5%)</span>
                        <span className="font-medium">₹ {(calculateTotal(selectedOrder.items) * 0.025).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">SGST (2.5%)</span>
                        <span className="font-medium">₹ {(calculateTotal(selectedOrder.items) * 0.025).toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 mt-2 border-t">
                        <span className="font-bold text-lg">Total Amount</span>
                        <span className="font-bold text-xl text-primary">
                          ₹ {(calculateTotal(selectedOrder.items) * 1.05).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions Footer */}
                  <div className="p-5 border-t bg-slate-50/50 flex gap-3">
                    <Button variant="outline" className="flex-1 text-primary border-primary/30 hover:bg-primary/5 bg-primary/5">
                      <Printer className="w-4 h-4 mr-2" /> Print KOT
                    </Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-white">
                      <CreditCard className="w-4 h-4 mr-2" /> Generate Bill
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}
