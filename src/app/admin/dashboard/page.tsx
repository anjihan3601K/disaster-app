"use client";

import { AppHeader } from "@/components/shared/AppHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SosFeed } from "@/components/admin/SosFeed";
import { UserStatusTable } from "@/components/admin/UserStatusTable";
import { AlertBroadcaster } from "@/components/admin/AlertBroadcaster";
import { ReportsFeed } from "@/components/admin/ReportsFeed";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Users, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart as RechartsBarChart } from 'recharts';


const analyticsData = [
  { name: 'Safe', count: 1258, fill: 'hsl(var(--primary))' },
  { name: 'Emergency', count: 132, fill: 'hsl(var(--destructive))' },
  { name: 'Unknown', count: 450, fill: 'hsl(var(--muted-foreground))' },
];


export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="broadcast">Broadcast Alert</TabsTrigger>
            <TabsTrigger value="reports">User Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <div className="grid gap-6 md:gap-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,840</div>
                        <p className="text-xs text-muted-foreground">+21 since last hour</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active SOS Signals</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">132</div>
                         <p className="text-xs text-muted-foreground">+5 in last 15 minutes</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Users Marked Safe</CardTitle>
                        <Users className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">1,258</div>
                         <p className="text-xs text-muted-foreground">+112 in last hour</p>
                    </CardContent>
                </Card>
              </div>
               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>User Status Overview</CardTitle>
                             <CardDescription>A real-time summary of user-reported statuses.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px] w-full">
                            <ResponsiveContainer>
                                <RechartsBarChart data={analyticsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
                                    <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                        background: "hsl(var(--background))",
                                        border: "1px solid hsl(var(--border))",
                                        color: "hsl(var(--foreground))",
                                        }}
                                    />
                                    <Bar dataKey="count" />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <div className="lg:col-span-2"><SosFeed /></div>
               </div>
              <UserStatusTable />
            </div>
          </TabsContent>
          <TabsContent value="broadcast">
            <AlertBroadcaster />
          </TabsContent>
          <TabsContent value="reports">
            <ReportsFeed />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
