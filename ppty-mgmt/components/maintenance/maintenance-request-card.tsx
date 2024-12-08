import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Wrench, Home, AlertCircle } from "lucide-react";

interface MaintenanceRequestCardProps {
  request: {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    createdAt: Date;
    property: {
      name: string;
    };
    tenant: {
      firstName: string;
      lastName: string;
    };
  };
}

export function MaintenanceRequestCard({ request }: MaintenanceRequestCardProps) {
  const priorityColors = {
    LOW: "bg-blue-500",
    MEDIUM: "bg-yellow-500",
    HIGH: "bg-orange-500",
    URGENT: "bg-red-500",
  };

  return (
    <Link href={`/maintenance/${request.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${
              request.status === "COMPLETED" ? "bg-green-100" : "bg-orange-100"
            }`}>
              <Wrench className={`h-4 w-4 ${
                request.status === "COMPLETED" ? "text-green-600" : "text-orange-600"
              }`} />
            </div>
            <div>
              <p className="font-medium">{request.title}</p>
              <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                {request.description}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Badge className={priorityColors[request.priority as keyof typeof priorityColors]}>
              {request.priority}
            </Badge>
            <Badge variant={request.status === "COMPLETED" ? "default" : "secondary"}>
              {request.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Home className="mr-1 h-4 w-4" />
                {request.property.name}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <AlertCircle className="mr-1 h-4 w-4" />
                Reported by: {request.tenant.firstName} {request.tenant.lastName}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
