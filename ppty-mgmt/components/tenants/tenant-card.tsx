import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { User, Home, Calendar } from "lucide-react";

interface TenantCardProps {
  tenant: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    leaseStart: Date;
    leaseEnd: Date;
    rentAmount: number;
    status: string;
    unit: {
      unitNumber: string;
      property: {
        name: string;
      };
    };
  };
}

export function TenantCard({ tenant }: TenantCardProps) {
  const isLeaseEnding = new Date(tenant.leaseEnd) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <Link href={`/tenants/${tenant.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">{tenant.firstName} {tenant.lastName}</p>
              <p className="text-sm text-muted-foreground">{tenant.email}</p>
            </div>
          </div>
          <Badge variant={tenant.status === "ACTIVE" ? "default" : "secondary"}>
            {tenant.status}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Home className="mr-1 h-4 w-4" />
                {tenant.unit.property.name} - Unit {tenant.unit.unitNumber}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                {isLeaseEnding ? (
                  <span className="text-red-500">
                    Lease ends {formatDistanceToNow(new Date(tenant.leaseEnd), { addSuffix: true })}
                  </span>
                ) : (
                  <span>
                    Lease ends {formatDistanceToNow(new Date(tenant.leaseEnd), { addSuffix: true })}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Monthly Rent</p>
              <p className="text-2xl font-bold">${tenant.rentAmount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
