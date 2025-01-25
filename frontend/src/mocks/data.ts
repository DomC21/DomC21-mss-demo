import { addDays, format } from 'date-fns';

export type Order = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  preferredCommunication: 'email' | 'phone' | 'text';
  serviceType: 'moving' | 'packing' | 'storage' | 'cleaning';
  requestedDateTime: string;
  specialNotes?: string;
  estimatedValue: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  assignedTeam?: string[];
  distance?: number;      // Distance in miles
  duration?: number;      // Duration in hours
  priority?: 'low' | 'medium' | 'high';
  completedOnTime?: boolean;
};

export type Contractor = {
  id: string;
  name: string;
  availability: {
    date: string;
    slots: boolean[];
  }[];
  assignedJobs: string[];
  preferredRegions?: string[];
  availabilityNotes?: string;
  completedJobs?: number;
  onTimeRate?: number;
};

// Mock data generator
const generateMockOrders = (): Order[] => {
  const statuses: Order['status'][] = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
  const serviceTypes: Order['serviceType'][] = ['moving', 'packing', 'storage', 'cleaning'];
  
  return Array.from({ length: 10 }, (_, i) => ({
    id: `ORD-${String(i + 1).padStart(6, '0')}`,
    customerName: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    phone: `555-0${String(i + 1).padStart(3, '0')}`,
    address: `${1000 + i} Main St, City, State`,
    preferredCommunication: ['email', 'phone', 'text'][i % 3] as Order['preferredCommunication'],
    serviceType: serviceTypes[i % serviceTypes.length],
    requestedDateTime: format(addDays(new Date(), i), "yyyy-MM-dd'T'HH:mm"),
    specialNotes: i % 2 === 0 ? 'Handle with care' : undefined,
    estimatedValue: 1000 + (i * 500),
    status: statuses[i % statuses.length],
    assignedTeam: i % 3 === 0 ? ['John Doe', 'Jane Smith'] : undefined,
    distance: Math.floor(Math.random() * 30) + 5, // Random distance between 5-35 miles
    duration: Math.floor(Math.random() * 4) + 2,  // Random duration between 2-6 hours
    priority: (() => {
      const value = 1000 + (i * 500);
      if (value > 3000) return 'high';
      if (value > 2000) return 'medium';
      return 'low';
    })(),
    completedOnTime: Math.random() > 0.1, // 90% chance of being on time
  }));
};

export const mockOrders = generateMockOrders();

export const mockContractors: Contractor[] = [
  {
    id: 'CON-001',
    name: 'John Doe',
    availability: Array.from({ length: 7 }, (_, i) => ({
      date: format(addDays(new Date(), i), 'yyyy-MM-dd'),
      slots: Array.from({ length: 8 }, () => Math.random() > 0.3),
    })),
    assignedJobs: ['ORD-000001', 'ORD-000004'],
    preferredRegions: ['Northeast', 'Mid-Atlantic'],
    availabilityNotes: 'Available Monday-Friday, 9 AM - 5 PM. Prefer morning shifts.',
    completedJobs: 156,
    onTimeRate: 0.98,
  },
  {
    id: 'CON-002',
    name: 'Jane Smith',
    availability: Array.from({ length: 7 }, (_, i) => ({
      date: format(addDays(new Date(), i), 'yyyy-MM-dd'),
      slots: Array.from({ length: 8 }, () => Math.random() > 0.3),
    })),
    assignedJobs: ['ORD-000001', 'ORD-000007'],
  },
];

export const mockCapacityData = {
  currentCapacity: 15, // Set to 15% to trigger surge pricing
  totalOrders: mockOrders.length,
  highPriorityOrders: mockOrders.filter(o => o.estimatedValue > 2000).length,
  totalRevenue: mockOrders.reduce((acc, curr) => acc + curr.estimatedValue, 0),
  surgeMultiplier: 1.2, // 20% surge pricing
  discountMultiplier: 0.9, // 10% discount
  recommendedTeam: ['John Doe', 'Jane Smith'], // AI-suggested team
  recommendationReason: 'Based on location proximity and workload balance',
};

export const mockNotifications = [
  {
    id: '1',
    title: 'New Job Assignment',
    message: 'You have a new moving job scheduled for tomorrow at 9 AM.',
    type: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    action: {
      label: 'View Job',
      onClick: () => console.log('View job clicked'),
    },
  },
  {
    id: '2',
    title: 'Confirm Availability',
    message: 'Please confirm your availability for the upcoming week.',
    type: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: false,
    action: {
      label: 'Confirm',
      onClick: () => console.log('Confirm clicked'),
    },
  },
  {
    id: '3',
    title: 'Team Assignment',
    message: 'You have been assigned to work with Bob and Michelle.',
    type: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
  },
];
