import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MapPin, Clock, Users, AlertTriangle, CheckCircle2, Truck, Timer } from 'lucide-react';
import { mockOrders, mockContractors, mockNotifications } from '@/mocks/data';
import { formatDistance, formatDuration, calculateMetrics } from '@/lib/utils';
import { JobCard } from '@/components/ui/job-card';
import { StatCard } from '@/components/ui/stat-card';
import { CalendarView } from '@/components/ui/calendar-view';
import { Notifications } from '@/components/ui/notifications';
import moment from 'moment';

// Mock current contractor (in a real app, this would come from authentication)
const currentContractor = mockContractors[0];

export function ContractorDashboard() {
  const assignedOrders = mockOrders.filter(order => 
    currentContractor.assignedJobs.includes(order.id)
  );

  // Removed unused functions

  // Calculate overview stats
  const upcomingJobs = assignedOrders.filter(order => 
    ['pending', 'confirmed'].includes(order.status)
  ).length;
  
  const metrics = calculateMetrics(assignedOrders);
  const { totalDistance, totalHours, completedOnTime, totalCompleted } = metrics;

  const [notifications, setNotifications] = useState(mockNotifications.map(n => ({
    ...n,
    type: (n.type === 'info' || n.type === 'success' || n.type === 'warning' ? n.type : 'info') as 'info' | 'success' | 'warning'
  })));

  const handleNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const [profileForm, setProfileForm] = useState({
    regions: currentContractor.preferredRegions?.join(', ') || '',
    availability: currentContractor.availabilityNotes || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleProfileChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with Notifications */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Contractor Dashboard</h1>
        <Notifications
          notifications={notifications}
          onNotificationRead={handleNotificationRead}
          className="ml-auto"
        />
      </div>

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Upcoming Jobs"
          value={upcomingJobs}
          icon={Truck}
          description={`${assignedOrders.length} total assignments`}
        />
        <StatCard
          title="Total Distance"
          value={formatDistance(totalDistance)}
          icon={MapPin}
          description="Estimated travel distance"
        />
        <StatCard
          title="Total Hours"
          value={formatDuration(totalHours)}
          icon={Timer}
          description="Scheduled work hours"
        />
      </div>

      {/* Notifications have been moved to the bell icon in the top right */}

      {/* Calendar View */}
      <CalendarView
        events={assignedOrders.map(order => ({
          id: order.id,
          title: `${order.serviceType} - ${order.customerName}`,
          start: new Date(order.requestedDateTime),
          end: moment(order.requestedDateTime).add(4, 'hours').toDate(), // Assuming 4-hour jobs
          status: order.status,
          customerName: order.customerName,
          address: order.address,
          serviceType: order.serviceType,
        }))}
        onEventClick={(event) => {
          console.log('Clicked event:', event);
        }}
      />

      {/* Assigned Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Assigned Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignedOrders.map((order) => (
              <JobCard
                key={order.id}
                id={order.id}
                customerName={order.customerName}
                address={order.address}
                dateTime={order.requestedDateTime}
                serviceType={order.serviceType}
                value={order.estimatedValue}
                status={order.status}
                notes={order.specialNotes}
                team={order.assignedTeam}
                onConfirm={() => console.log('Confirmed availability for:', order.id)}
                onRequestHelp={() => console.log('Requested help for:', order.id)}
                className="border-t first:border-t-0"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* High Demand Alert */}
      {mockContractors[0].availability.some(day => 
        day.slots.filter(Boolean).length / day.slots.length < 0.3
      ) && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTitle className="text-yellow-800 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            High Demand Alert
          </AlertTitle>
          <AlertDescription className="text-yellow-700">
            Some days next week are showing high demand. Please update your availability if possible.
          </AlertDescription>
        </Alert>
      )}

      {/* Contractor Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Contractor Profile
          </CardTitle>
          <CardDescription>Manage your preferences and availability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="space-y-2">
              <Label htmlFor="regions">Preferred Regions</Label>
              <div className="relative">
                <Input
                  id="regions"
                  placeholder="e.g. Northeast, Southwest"
                  value={profileForm.regions}
                  onChange={handleProfileChange('regions')}
                  className="transition-shadow focus:shadow-md"
                />
                <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Enter regions where you prefer to work, separated by commas
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">General Availability</Label>
              <div className="relative">
                <Textarea
                  id="availability"
                  placeholder="Describe your general availability here..."
                  className="min-h-[100px] transition-shadow focus:shadow-md pr-10"
                  value={profileForm.availability}
                  onChange={handleProfileChange('availability')}
                />
                <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Performance Metrics</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 hover:bg-blue-100/80 transition-colors rounded-lg p-4">
                  <div className="text-sm font-medium text-blue-700">Completed Jobs</div>
                  <div className="text-2xl font-bold text-blue-900 mt-1">
                    {assignedOrders.filter(o => o.status === 'completed').length}
                  </div>
                </div>
                <div className="bg-green-50 hover:bg-green-100/80 transition-colors rounded-lg p-4">
                  <div className="text-sm font-medium text-green-700">On-Time Rate</div>
                  <div className="text-2xl font-bold text-green-900 mt-1">
                    {totalCompleted > 0 ? `${Math.round((completedOnTime / totalCompleted) * 100)}%` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="flex items-center gap-4">
                {saveSuccess && (
                  <p className="text-sm text-green-600">Changes saved successfully!</p>
                )}
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
