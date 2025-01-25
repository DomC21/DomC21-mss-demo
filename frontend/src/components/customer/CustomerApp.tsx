import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Star, CheckCircle, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockOrders } from '@/mocks/data';
import { formatCurrency, getOrderStatusColor } from '@/lib/utils';

// Mock current user's order (in a real app, this would come from authentication)
const currentOrder = mockOrders[0];

export function CustomerApp() {
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [activeTab, setActiveTab] = useState('current');
  // Suppress unused variable warnings since these will be used in future updates
  void activeTab;
  void setActiveTab;

  const getStatusStep = (status: string) => {
    const steps = ['pending', 'confirmed', 'in_progress', 'completed'];
    return steps.indexOf(status);
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Your movers are confirmed. Meet John, Mike, and Billy!';
      case 'in_progress':
        return 'The MSS team is on the way.';
      case 'completed':
        return 'Your move is completed. Please leave feedback!';
      default:
        return 'Your order is being processed.';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Status Notification */}
      {showNotification && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertTitle className="text-blue-800 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Order Status Update
          </AlertTitle>
          <AlertDescription className="text-blue-700">
            {getStatusMessage(currentOrder.status)}
          </AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => setShowNotification(false)}
          >
            ×
          </Button>
        </Alert>
      )}

      {/* Order Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Order #{currentOrder.id}
            <Badge className={getOrderStatusColor(currentOrder.status)}>
              {currentOrder.status.replace('_', ' ')}
            </Badge>
          </CardTitle>
          <CardDescription>
            {currentOrder.serviceType.charAt(0).toUpperCase() + currentOrder.serviceType.slice(1)} Service
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-8">
            {/* Progress Bar */}
            <div className="relative">
              <div className="flex justify-between mb-2">
                {['Order Received', 'Team Confirmed', 'In Progress', 'Completed'].map((step, index) => (
                  <div
                    key={step}
                    className="flex flex-col items-center relative z-10"
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                        index <= getStatusStep(currentOrder.status)
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </div>
                    <span className={cn(
                      "text-sm font-medium mt-2 transition-colors duration-200",
                      index <= getStatusStep(currentOrder.status)
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}>{step}</span>
                  </div>
                ))}
              </div>
              <div className="absolute top-5 left-0 w-full h-0.5 bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-in-out"
                  style={{
                    width: `${(getStatusStep(currentOrder.status) / 3) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="border-l-2 border-muted pl-6 space-y-6">
              {[
                { label: 'Order Received', time: '10:00 AM', status: 'completed', description: 'Your order has been received and is being processed.' },
                { label: 'Team Assignment', time: '10:30 AM', status: currentOrder.status === 'confirmed' ? 'completed' : 'pending', description: 'Our team is reviewing your request and assigning the best crew.' },
                { label: 'Team Confirmed', time: '11:00 AM', status: currentOrder.status === 'confirmed' ? 'completed' : 'pending', description: 'Your moving team has been confirmed.' },
                { label: 'In Progress', time: '2:00 PM', status: currentOrder.status === 'in_progress' ? 'active' : 'pending', description: 'Your moving team is on the way.' },
                { label: 'Completed', time: '5:00 PM', status: currentOrder.status === 'completed' ? 'completed' : 'pending', description: 'Moving service completed successfully.' },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[31px] mt-1">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2",
                      item.status === 'completed' ? "bg-primary border-primary" :
                      item.status === 'active' ? "bg-warning border-warning animate-pulse" :
                      "bg-background border-muted"
                    )} />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "font-medium",
                        item.status === 'completed' ? "text-primary" :
                        item.status === 'active' ? "text-warning" :
                        "text-muted-foreground"
                      )}>{item.label}</span>
                      <span className="text-sm text-muted-foreground">{item.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details and History */}
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current Order</TabsTrigger>
          <TabsTrigger value="history">Order History</TabsTrigger>
        </TabsList>
        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Service Date</label>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                    <Input
                      type="datetime-local"
                      defaultValue={currentOrder.requestedDateTime}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Service Type</label>
                  <div className="mt-1 text-lg">{currentOrder.serviceType}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Order Value</label>
                  <div className="mt-1 text-lg">{formatCurrency(currentOrder.estimatedValue)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={getOrderStatusColor(currentOrder.status)}>
                      {currentOrder.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Special Notes</label>
                <Textarea
                  defaultValue={currentOrder.specialNotes}
                  className="mt-1"
                  placeholder="Add any special requirements or notes..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Save Changes</Button>
                {currentOrder.status === 'completed' && (
                  <Button onClick={() => setShowFeedbackDialog(true)}>
                    Leave Feedback
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Past Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.slice(1, 4).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">Order #{order.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.requestedDateTime).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getOrderStatusColor(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                      <div className="text-sm mt-1">{formatCurrency(order.estimatedValue)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Feedback</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Rating</label>
              <div className="flex space-x-2 mt-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant="outline"
                    size="sm"
                    className="p-2"
                  >
                    <Star className="h-5 w-5" />
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Comments</label>
              <Textarea
                placeholder="Tell us about your experience..."
                className="mt-2"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowFeedbackDialog(false)}>
                Submit Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
