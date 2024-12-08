import { Suspense } from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Users, 
  DollarSign, 
  Wrench,
  PlusCircle,
  MoreVertical,
  Edit,
  Trash,
  ArrowLeft
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Property {
  id: string;
  name: string;
  address: string;
  price: number;
  status: string;
  images: string[];
  units: Unit[];
  maintenanceReqs: MaintenanceReq[];
}

interface Unit {
  status: string;
  tenant?: {
    rentAmount: number;
    firstName: string;
    lastName: string;
  };
}

interface MaintenanceReq {
  id: string;
  status: string;
  title: string;
  property: {
    name: string;
  };
  tenant: {
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  createdAt: Date;
  tenant: {
    firstName: string;
    lastName: string;
  };
}

async function getStatsData(userId: string) {
  try {
    const properties = await db.property.findMany({
      where: { userId },
      include: {
        units: {
          include: {
            tenant: true,
          },
        },
        maintenanceReqs: true,
      },
    });

    const totalProperties = properties.length;
    const totalUnits = properties.reduce((acc: number, property: Property) => 
      acc + property.units.length, 0
    );
    const occupiedUnits = properties.reduce((acc: number, property: Property) => 
      acc + property.units.filter(unit => unit.status === "OCCUPIED").length, 0
    );

    const occupancyRate = totalUnits > 0 
      ? Math.round((occupiedUnits / totalUnits) * 100) 
      : 0;

    const activeRequests = properties.reduce((acc: number, property: Property) => 
      acc + property.maintenanceReqs.filter(req => 
        req.status !== "COMPLETED"
      ).length, 0
    );

    const monthlyRevenue = properties.reduce((acc: number, property: Property) => 
      acc + property.units.reduce((unitAcc: number, unit: Unit) => 
        unitAcc + (unit.tenant?.rentAmount || 0), 0
      ), 0
    );

    return {
      properties,
      totalProperties,
      totalUnits,
      occupiedUnits,
      occupancyRate,
      activeRequests,
      monthlyRevenue,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      properties: [],
      totalProperties: 0,
      totalUnits: 0,
      occupiedUnits: 0,
      occupancyRate: 0,
      activeRequests: 0,
      monthlyRevenue: 0,
    };
  }
}

async function getRecentActivity(userId: string) {
  try {
    const maintenance = await db.maintenanceReq.findMany({
      where: {
        property: { userId },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        property: true,
        tenant: true,
      },
    });

    const payments = await db.payment.findMany({
      where: {
        tenant: {
          unit: {
            property: { userId },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        tenant: true,
      },
    });

    const activities = [
      ...maintenance.map((req: MaintenanceReq) => ({
        id: req.id,
        type: 'MAINTENANCE' as const,
        title: req.title,
        description: `${req.tenant.firstName} ${req.tenant.lastName} - ${req.property.name}`,
        timestamp: req.createdAt,
        status: req.status,
      })),
      ...payments.map((payment: Payment) => ({
        id: payment.id,
        type: 'PAYMENT' as const,
        title: `Rent Payment - $${payment.amount}`,
        description: `${payment.tenant.firstName} ${payment.tenant.lastName}`,
        timestamp: payment.createdAt,
        status: payment.status,
      })),
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
     .slice(0, 10);

    return activities;
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-[200px] bg-muted/10 rounded-lg border border-dashed">
      <h3 className="font-semibold text-lg">No properties yet</h3>
      <p className="text-muted-foreground text-sm mt-1">Add your first property to get started</p>
      <Link href="/properties/add" className="mt-4">
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </Link>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  try {
    const stats = await getStatsData(userId);
    const recentActivity = await getRecentActivity(userId);

    if (stats.totalProperties === 0) {
      return <EmptyState />;
    }

    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-4 mt-4">
              <Link href="/properties">
                <Button variant="secondary" className="text-muted-foreground text-bold">
                  Properties
                </Button>
              </Link>
            </div>
          </div>
          <Link href="/properties/add">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </Link>
        </div>

        <Suspense fallback={<LoadingState />}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Properties
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProperties}</div>
                <div className="text-xs text-muted-foreground">
                  {stats.occupancyRate}% Occupancy Rate
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Occupied Units
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.occupiedUnits}</div>
                <div className="text-xs text-muted-foreground">
                  of {stats.totalUnits} total units
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats.monthlyRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Projected monthly income
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Requests
                </CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeRequests}</div>
                <div className="text-xs text-muted-foreground">
                  Pending maintenance
                </div>
              </CardContent>
            </Card>
          </div>
        </Suspense>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading activity...</div>}>
                <div className="space-y-8">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center">
                        <div className={`
                          rounded-full p-2 w-8 h-8 flex items-center justify-center
                          ${activity.type === 'MAINTENANCE' ? 'bg-orange-100' : 'bg-green-100'}
                        `}>
                          {activity.type === 'MAINTENANCE' ? 
                            <Wrench className="h-4 w-4 text-orange-600" /> : 
                            <DollarSign className="h-4 w-4 text-green-600" />
                          }
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                        </div>
                        <div className="ml-auto font-medium">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No recent activity</p>
                  )}
                </div>
              </Suspense>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Occupancy Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Total Units</p>
                    <p className="text-2xl font-bold">{stats.totalUnits}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Occupied</p>
                    <p className="text-2xl font-bold text-green-600">{stats.occupiedUnits}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Vacant</p>
                    <p className="text-2xl font-bold text-red-600">
                      {stats.totalUnits - stats.occupiedUnits}
                    </p>
                  </div>
                </div>

                <div className="relative pt-4">
                  <div className="bg-muted rounded-full h-2 w-full">
                    <div 
                      className="bg-primary rounded-full h-2" 
                      style={{ width: `${stats.occupancyRate}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground mt-2 block">
                    {stats.occupancyRate}% Occupancy Rate
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="flex-1 p-8 pt-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              There was an error loading your dashboard. This might be because the database
              hasn't been properly initialized. Please ensure you've run all migrations.
            </p>
            <pre className="mt-4 p-4 bg-muted rounded-lg text-sm overflow-auto">
              npx prisma generate{'\n'}
              npx prisma db push
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  }
}