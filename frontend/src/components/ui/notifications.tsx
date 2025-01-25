import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationsProps {
  notifications: Notification[];
  onNotificationRead?: (id: string) => void;
  className?: string;
  iconClassName?: string;
  badgeClassName?: string;
  tooltipContent?: string;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
}

export function Notifications({ 
  notifications, 
  onNotificationRead, 
  className,
  iconClassName,
  badgeClassName,
  tooltipContent,
  tooltipSide = 'bottom'
}: NotificationsProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const getNotificationStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-primary-green/10 border-primary-green/20 hover:bg-primary-green/20';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100/50';
      default:
        return 'bg-primary/10 border-primary/20 hover:bg-primary/20';
    }
  };

  return (
    <div className={className}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-primary-blue/10"
                >
                  <Bell className={cn("h-5 w-5", iconClassName)} />
                  {unreadCount > 0 && (
                    <span className={cn("absolute -top-1 -right-1 h-4 w-4 rounded-full text-[10px] font-medium flex items-center justify-center", badgeClassName || "bg-primary text-white")}>
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side={tooltipSide}>
                {tooltipContent || "View Notifications"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
            <div className="space-y-4 pr-4">
              {notifications.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No notifications
                </p>
              ) : (
                notifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div
                      className={cn(
                        'rounded-lg border p-4',
                        getNotificationStyles(notification.type),
                        !notification.read && 'border-l-4'
                      )}
                      onClick={() => {
                        if (!notification.read && onNotificationRead) {
                          onNotificationRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.timestamp.toLocaleString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      {notification.action && (
                        <div className="mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              notification.action?.onClick();
                            }}
                          >
                            {notification.action.label}
                          </Button>
                        </div>
                      )}
                    </div>
                    {index < notifications.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
