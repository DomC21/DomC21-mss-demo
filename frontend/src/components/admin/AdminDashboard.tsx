import { useState } from 'react';
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

  const filteredOrders = mockOrders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (serviceFilter !== 'all' && order.serviceType !== serviceFilter) return false;
    return true;
  });

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
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-semibold text-muted-foreground/90">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight leading-tight">{mockOrders.length}</div>
            <p className="text-sm text-muted-foreground/90 mt-2">
              {mockOrders.filter(o => o.status === 'pending').length} pending
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{formatCurrency(mockCapacityData.totalRevenue)}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Avg. {formatCurrency(mockCapacityData.totalRevenue / mockOrders.length)} per order
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-muted-foreground">Capacity Utilization</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{mockCapacityData.currentCapacity}%</div>
            <Progress value={mockCapacityData.currentCapacity} className="mt-2" />
          </CardContent>
        </Card>
        <Card className="shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold text-muted-foreground">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{mockCapacityData.highPriorityOrders}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Requires immediate attention
            </p>
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
          <CardTitle className="text-2xl font-semibold tracking-tight leading-tight">Recent Orders</CardTitle>
          <div className="flex flex-wrap gap-4">
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
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
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
              ))}
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
