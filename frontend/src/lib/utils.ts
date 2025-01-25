import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Order {
  distance?: number;
  duration?: number;
  status?: string;
  completedOnTime?: boolean;
  priority?: string;
}

export function calculateMetrics(orders: Order[]) {
  return {
    totalDistance: orders.reduce((acc, order) => acc + (order.distance || 0), 0),
    totalHours: orders.reduce((acc, order) => acc + (order.duration || 0), 0),
    completedOnTime: orders.filter(o => o.status === 'completed' && o.completedOnTime).length,
    totalCompleted: orders.filter(o => o.status === 'completed').length,
    highPriorityCount: orders.filter(o => o.priority === 'high').length,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function getOrderStatusColor(status: string): string {
  const statusColors = {
    pending: 'bg-warning',
    confirmed: 'bg-primary',
    in_progress: 'bg-accent',
    completed: 'bg-success',
    cancelled: 'bg-destructive',
  };
  return statusColors[status as keyof typeof statusColors] || 'bg-muted';
}

export function getPriorityColor(priority: string): string {
  const colors = {
    low: 'bg-primary/10 text-primary border-primary/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    high: 'bg-destructive/10 text-destructive border-destructive/20',
  };
  return colors[priority as keyof typeof colors] || colors.low;
}

export function formatDuration(hours: number): string {
  return `${hours}h`;
}

export function formatDistance(miles: number): string {
  return `${miles} miles`;
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
}
