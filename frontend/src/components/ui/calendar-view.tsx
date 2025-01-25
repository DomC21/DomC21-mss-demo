import { useState } from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
  customerName: string;
  address: string;
  serviceType: string;
}

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
}

export function CalendarView({ events, onEventClick, className }: CalendarViewProps) {
  const [view, setView] = useState('week');

  const eventStyleGetter = (event: CalendarEvent) => {
    const style: React.CSSProperties = {
      backgroundColor: getEventColor(event.status),
      borderRadius: '6px',
      opacity: 0.9,
      color: 'hsl(var(--background))',
      border: '0',
      display: 'block',
      transition: 'all 200ms',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      padding: '4px 8px',
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      fontWeight: 500,
    };
    return { style };
  };

  const getEventColor = (status: string) => {
    const colors = {
      pending: 'hsl(var(--warning))',
      confirmed: 'hsl(var(--primary))',
      in_progress: 'hsl(var(--secondary))',
      completed: 'hsl(var(--accent))',
      cancelled: 'hsl(var(--destructive))',
    };
    return colors[status as keyof typeof colors] || 'hsl(var(--muted))';
  };

  const getEventDuration = (serviceType: string) => {
    switch (serviceType) {
      case 'moving':
        return 6; // 6 hours for moving
      case 'packing':
        return 4; // 4 hours for packing
      case 'cleaning':
        return 3; // 3 hours for cleaning
      case 'storage':
        return 2; // 2 hours for storage
      default:
        return 4; // Default duration
    }
  };

  return (
    <Card className={cn('min-h-[600px] shadow-card hover:shadow-card-hover transition-all duration-200', className)}>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold tracking-tight leading-tight">Schedule</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView('month')}
              className={cn(
                "font-medium",
                view === 'month' && "bg-primary/10 text-primary border-primary/50"
              )}
            >
              Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView('week')}
              className={cn(
                "font-medium",
                view === 'week' && "bg-primary/10 text-primary border-primary/50"
              )}
            >
              Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView('day')}
              className={cn(
                "font-medium",
                view === 'day' && "bg-primary/10 text-primary border-primary/50"
              )}
            >
              Day
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Calendar
          localizer={localizer}
          events={events.map(event => ({
            ...event,
            end: moment(event.start).add(getEventDuration(event.serviceType), 'hours').toDate()
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          defaultView={Views.WEEK}
          view={view as 'month' | 'week' | 'day' | 'agenda'}
          onView={(newView) => setView(newView)}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => onEventClick?.(event as CalendarEvent)}
          formats={{
            timeGutterFormat: 'ha',
            eventTimeRangeFormat: ({ start, end }) =>
              `${moment(start).format('ha')} - ${moment(end).format('ha')}`,
            eventTimeRangeEndFormat: ({ start, end }) =>
              `${moment(end).format('ha')}`,
          }}
          tooltipAccessor={(event) => {
            const e = event as CalendarEvent;
            return `
              ${e.customerName}
              ${e.address}
              ${e.serviceType.charAt(0).toUpperCase() + e.serviceType.slice(1)}
              Duration: ${getEventDuration(e.serviceType)} hours
            `;
          }}
        />
      </CardContent>
    </Card>
  );
}
