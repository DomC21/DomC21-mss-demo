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
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Contractor Dashboard</h1>
          <p className="text-base text-muted-foreground">Welcome back, {currentContractor.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <Notifications
            notifications={notifications}
            onNotificationRead={handleNotificationRead}
            className="relative hover:bg-primary/5 rounded-full p-2 transition-all duration-200 border border-primary/10 hover:shadow-md"
            badgeClassName="bg-primary text-primary-foreground animate-pulse"
            iconClassName="h-5 w-5 text-primary"
            tooltipContent="View Notifications"
            tooltipSide="bottom"
          />
        </div>
      </div>

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Upcoming Jobs"
          value={upcomingJobs}
          icon={Truck}
          description={`${assignedOrders.length} total assignments`}
          className="bg-primary/5 border-primary/10"
        />
        <StatCard
          title="Total Distance"
          value={formatDistance(totalDistance)}
          icon={MapPin}
          description="Estimated travel distance"
          className="bg-accent/5 border-accent/10"
        />
        <StatCard
          title="Total Hours"
          value={formatDuration(totalHours)}
          icon={Timer}
          description="Scheduled work hours"
          className="bg-secondary/5 border-secondary/10"
      </div>

      {/* Notifications have been moved to the bell icon in the top right */}

      {/* Calendar View */}
      <Card className="shadow-card hover:shadow-card-hover transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight leading-tight">Your Schedule</CardTitle>
          <CardDescription>View and manage your upcoming assignments</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <CalendarView
            events={assignedOrders.map(order => ({
              id: order.id,
              title: `${order.serviceType} - ${order.customerName}`,
              start: new Date(order.requestedDateTime),
              end: moment(order.requestedDateTime).add(
                order.serviceType === 'moving' ? 6 : 
                order.serviceType === 'packing' ? 4 : 
                order.serviceType === 'cleaning' ? 3 : 2, 
                'hours'
              ).toDate(),
              status: order.status,
              customerName: order.customerName,
              address: order.address,
              serviceType: order.serviceType,
            }))}
            onEventClick={(event) => {
              console.log('Clicked event:', event);
            }}
            className="border-none rounded-none"
          />
        </CardContent>
      </Card>

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
        <Alert className="bg-warning/10 border-warning/20 shadow-sm hover:shadow-md transition-all duration-200">
          <AlertTitle className="text-warning-foreground/90 flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-4 w-4" />
            High Demand Alert
          </AlertTitle>
          <AlertDescription className="text-warning-foreground/80">
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
                <div className="bg-primary/5 hover:bg-primary/10 transition-all duration-200 rounded-lg p-6 border border-primary/10 shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-primary/90">Completed Jobs</div>
                      <div className="text-2xl font-bold text-primary mt-1">
                        {assignedOrders.filter(o => o.status === 'completed').length}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-accent/5 hover:bg-accent/10 transition-all duration-200 rounded-lg p-6 border border-accent/10 shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-accent/90">On-Time Rate</div>
                      <div className="text-2xl font-bold text-accent mt-1">
                        {totalCompleted > 0 ? `${Math.round((completedOnTime / totalCompleted) * 100)}%` : 'N/A'}
                      </div>
                    </div>
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
