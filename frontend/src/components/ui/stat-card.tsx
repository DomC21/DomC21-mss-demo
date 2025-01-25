import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('transition-all duration-200 hover:shadow-card-hover', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground/90">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground/80" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight leading-tight">{value}</div>
        {description && (
          <p className="text-sm text-muted-foreground/90 mt-2">
            {description}
          </p>
        )}
        {trend && (
          <div className={cn(
            'text-sm font-medium mt-3',
            trend.value > 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
          )}>
            {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
