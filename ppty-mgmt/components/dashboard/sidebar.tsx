"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  Wrench,
  FileText,
  MessageSquare,
  CreditCard,
  Settings,
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Properties",
    icon: Building2,
    href: "/properties",
  },
  {
    label: "Tenants",
    icon: Users,
    href: "/tenants",
  },
  {
    label: "Maintenance",
    icon: Wrench,
    href: "/maintenance",
  },
  {
    label: "Documents",
    icon: FileText,
    href: "/documents",
  },
  {
    label: "Messages",
    icon: MessageSquare,
    href: "/messages",
  },
  {
    label: "Payments",
    icon: CreditCard,
    href: "/payments",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">PropertyHub</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-2 text-slate-500 text-sm font-medium pl-3 py-2 rounded-lg hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all",
                pathname === route.href && "text-slate-700 bg-slate-100 dark:text-slate-200 dark:bg-slate-800"
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
