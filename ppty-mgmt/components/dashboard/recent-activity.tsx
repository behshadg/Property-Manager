"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: 'PAYMENT' | 'MAINTENANCE' | 'LEASE' | 'MESSAGE';
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    name: string;
    image?: string;
  };
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'PAYMENT':
        return '💰';
      case 'MAINTENANCE':
        return '🔧';
      case 'LEASE':
        return '📝';
      case 'MESSAGE':
        return '💬';
      default:
        return '📌';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  {activity.user && (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={activity.user.image} />
                      <AvatarFallback>
                        {activity.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}