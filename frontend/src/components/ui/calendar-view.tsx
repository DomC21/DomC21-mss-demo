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
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
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

  return (
    <Card className={cn('min-h-[600px] shadow-card hover:shadow-card-hover transition-all duration-200', className)}>
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold tracking-tight leading-tight">Schedule</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Calendar
          localizer={localizer}
          events={events}
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
          }}
          tooltipAccessor={(event) => `
            ${(event as CalendarEvent).customerName}
            ${(event as CalendarEvent).address}
            ${(event as CalendarEvent).serviceType}
          `}
        />
      </CardContent>
    </Card>
  );
}
