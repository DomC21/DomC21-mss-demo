import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PricingAlert } from '@/components/dynamic/PricingAlert';
import { ResourceSuggestion } from '@/components/dynamic/ResourceSuggestion';
import { DollarSign, Users, Package, AlertTriangle } from 'lucide-react';
import { mockOrders, mockCapacityData, mockContractors } from '@/mocks/data';
import { cn, formatCurrency, getOrderStatusColor } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AdminDashboard() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: '',
    end: '',
  });

  type SortableFields = 'id' | 'customerName' | 'serviceType' | 'requestedDateTime' | 'estimatedValue' | 'status';
  
  const [sortConfig, setSortConfig] = useState<{
    key: SortableFields | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc',
  });

  const handleSort = (key: SortableFields) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  let filteredOrders = mockOrders.filter(order => {
    // Status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    
    // Service filter
    if (serviceFilter !== 'all' && order.serviceType !== serviceFilter) return false;
    
    // Search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        order.id.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower) ||
        order.address.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      const orderDate = new Date(order.requestedDateTime);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      if (orderDate < startDate || orderDate > endDate) return false;
    }

    return true;
  });

  // Apply sorting
  if (sortConfig.key) {
    filteredOrders = [...filteredOrders].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];
      
      if (sortConfig.key === 'estimatedValue') {
        return sortConfig.direction === 'asc' 
          ? (a.estimatedValue - b.estimatedValue)
          : (b.estimatedValue - a.estimatedValue);
      }
      
      if (sortConfig.key === 'requestedDateTime') {
        return sortConfig.direction === 'asc'
          ? new Date(a.requestedDateTime).getTime() - new Date(b.requestedDateTime).getTime()
          : new Date(b.requestedDateTime).getTime() - new Date(a.requestedDateTime).getTime();
      }
      
      // String comparison for other fields
      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }

  interface RevenueData {
    date: string;
    amount: number;
  }

  const dailyRevenue = mockOrders.reduce((acc: RevenueData[], order) => {
    const date = order.requestedDateTime.split('T')[0];
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.amount += order.estimatedValue;
    } else {
      acc.push({ date, amount: order.estimatedValue });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="container section-spacing">
      {/* Quick Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="col-span-full">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Dashboard Overview</h2>
        </div>
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-200 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold text-primary/90">Total Orders</CardTitle>
            <div className="rounded-full bg-primary/10 p-2">
              <Package className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight leading-tight text-primary">{mockOrders.length}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                {mockOrders.filter(o => o.status === 'pending').length} pending
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-200 bg-gradient-to-br from-accent/5 to-transparent dark:from-accent/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-accent/90">Total Revenue</CardTitle>
            <div className="rounded-full bg-accent/10 p-2">
              <DollarSign className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-accent">{formatCurrency(mockCapacityData.totalRevenue)}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20">
                Avg. {formatCurrency(mockCapacityData.totalRevenue / mockOrders.length)} per order
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-200 bg-gradient-to-br from-secondary/5 to-transparent dark:from-secondary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-secondary/90">Capacity Utilization</CardTitle>
            <div className="rounded-full bg-secondary/10 p-2">
              <Users className="h-4 w-4 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-secondary">{mockCapacityData.currentCapacity}%</div>
            <Progress value={mockCapacityData.currentCapacity} className="mt-2" />
          </CardContent>
        </Card>
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-200 bg-gradient-to-br from-destructive/5 to-transparent dark:from-destructive/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-destructive/90">High Priority</CardTitle>
            <div className="rounded-full bg-destructive/10 p-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-destructive">{mockCapacityData.highPriorityOrders}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="destructive" className="bg-destructive/10 hover:bg-destructive/20">
                Requires immediate attention
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="shadow-card hover:shadow-card-hover transition-all duration-200">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold tracking-tight leading-tight">Revenue Overview</CardTitle>
          <CardDescription className="text-base text-muted-foreground/90">Track your daily revenue trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label: string) => `Date: ${label}`}
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Pricing Alert */}
      <PricingAlert />

      {/* AI Resource Suggestion */}
      <ResourceSuggestion />

      {/* Orders Table */}
      <Card className="shadow-card hover:shadow-card-hover transition-all duration-200">
        <CardHeader className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold tracking-tight leading-tight">Recent Orders</CardTitle>
              <CardDescription className="mt-2">
                Showing {filteredOrders.length} of {mockOrders.length} orders
                {(statusFilter !== 'all' || serviceFilter !== 'all' || searchTerm || (dateRange.start && dateRange.end)) && (
                  <span className="text-muted-foreground/80"> (filtered)</span>
                )}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search orders by ID, customer, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="flex items-center gap-4">
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-40 h-10"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-40 h-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="moving">Moving</SelectItem>
                <SelectItem value="packing">Packing</SelectItem>
                <SelectItem value="storage">Storage</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('id')}
                >
                  Order ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('customerName')}
                >
                  Customer {sortConfig.key === 'customerName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('serviceType')}
                >
                  Service {sortConfig.key === 'serviceType' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('requestedDateTime')}
                >
                  Date {sortConfig.key === 'requestedDateTime' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('estimatedValue')}
                >
                  Value {sortConfig.key === 'estimatedValue' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:text-primary transition-colors"
                  onClick={() => handleSort('status')}
                >
                  Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Package className="h-8 w-8 mb-4" />
                      <p className="text-sm">No orders found</p>
                      {(statusFilter !== 'all' || serviceFilter !== 'all' || searchTerm || (dateRange.start && dateRange.end)) && (
                        <p className="text-xs mt-1">Try adjusting your filters</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell className="capitalize">{order.serviceType}</TableCell>
                  <TableCell>{new Date(order.requestedDateTime).toLocaleDateString()}</TableCell>
                  <TableCell>{formatCurrency(order.estimatedValue)}</TableCell>
                  <TableCell>
                    <Badge className={getOrderStatusColor(order.status)}>
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Staff Schedule */}
      <Card className="shadow-card hover:shadow-card-hover transition-all duration-200">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold tracking-tight leading-tight">Staff Schedule</CardTitle>
          <CardDescription className="text-base text-muted-foreground/90">Weekly availability and assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockContractors.map((contractor) => (
              <div key={contractor.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold tracking-tight">{contractor.name}</h4>
                  <Badge variant="outline" className="font-medium">
                    {contractor.assignedJobs.length} assignments
                  </Badge>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {contractor.availability.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                      </div>
                      <div className={cn(
                        "h-2.5 rounded transition-colors",
                        day.slots.filter(Boolean).length / day.slots.length > 0.5
                          ? 'bg-accent hover:bg-accent/90'
                          : 'bg-yellow-500/80 hover:bg-yellow-500/70'
                      )} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
