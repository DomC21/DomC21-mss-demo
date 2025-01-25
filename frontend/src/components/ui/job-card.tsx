import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, ChevronDown, ChevronUp, Users, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobCardProps {
  id: string;
  customerName: string;
  address: string;
  dateTime: string;
  serviceType: 'moving' | 'packing' | 'storage' | 'cleaning';
  value: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  team?: string[];
  notes?: string;
  onConfirm?: () => void;
  onRequestHelp?: () => void;
  className?: string;
}

export function JobCard({
  id,
  customerName,
  address,
  dateTime,
  serviceType,
  value,
  status,
  team,
  notes,
  onConfirm,
  onRequestHelp,
  className,
}: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-primary/10 text-primary border-primary/20',
      in_progress: 'bg-secondary/10 text-secondary border-secondary/20',
      completed: 'bg-primary-green/10 text-primary-green border-primary-green/20',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-muted text-muted-foreground border-input';
  };

  const isPriorityJob = false; // TODO: Add priority handling in future update

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-card-hover',
      isPriorityJob && 'border-l-4 border-l-red-500',
      className
    )}>
      <CardHeader 
        className="cursor-pointer relative" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isPriorityJob && (
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-t-red-500 border-l-[20px] border-l-transparent transform rotate-45" />
        )}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold tracking-tight leading-tight">{customerName}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground/90">Order #{id}</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={getStatusColor(status)}>
              {status.replace('_', ' ')}
            </Badge>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground/80" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground/80" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-primary/90" />
              <span className="text-sm text-foreground/90">{address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary/90" />
              <span className="text-sm text-foreground/90">
                {new Date(dateTime).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-primary/90" />
              <span className="text-sm font-medium text-foreground/90">
                {formatCurrency(value)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-primary/90" />
              <span className="text-sm text-foreground/90 capitalize">
                {serviceType}
              </span>
            </div>
            {team && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm">{team.join(', ')}</span>
              </div>
            )}
          </div>

          {isExpanded && (
            <div className="pt-4 space-y-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                {team && team.length > 0 && (
                  <div className="col-span-2 bg-primary/5 rounded-lg p-4 border border-primary/10">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-primary/90" />
                      <p className="text-sm font-medium text-primary">Team Members</p>
                    </div>
                    <p className="text-sm text-primary/90 mt-2">{team.join(', ')}</p>
                  </div>
                )}
                {notes && (
                  <div className="col-span-2 bg-muted/30 rounded-lg p-4 border border-input/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-foreground/80" />
                      <p className="text-sm font-medium text-foreground/90">Special Notes</p>
                    </div>
                    <p className="text-sm text-muted-foreground/90 mt-2">{notes}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-4">
                {onRequestHelp && (
                  <Button
                    variant="outline"
                    onClick={onRequestHelp}
                    className="font-medium shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Request Help
                  </Button>
                )}
                {onConfirm && (
                  <Button
                    onClick={onConfirm}
                    className="font-medium shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Confirm Availability
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
