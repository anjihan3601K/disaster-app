"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, AlertTriangle, Info, CheckCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";

interface Alert {
  id: string;
  severity: "High" | "Moderate" | "Low" | "Info";
  title: string;
  content: string;
  timestamp: Timestamp;
}

const severityInfo = {
  High: { icon: <AlertTriangle className="h-5 w-5 text-destructive" />, badge: "destructive" as const },
  Moderate: { icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />, badge: "secondary" as const },
  Low: { icon: <Info className="h-5 w-5 text-blue-500" />, badge: "default" as const },
  Info: { icon: <CheckCircle className="h-5 w-5 text-green-500" />, badge: "outline" as const },
};

export function AlertsFeed() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const alertsQuery = query(collection(db, "alerts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(alertsQuery, (snapshot) => {
      const alertsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Alert));
      setAlerts(alertsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching alerts:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatTimestamp = (timestamp: Timestamp) => {
    if (!timestamp) return "Just now";
    return `${formatDistanceToNow(timestamp.toDate())} ago`;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Official Alerts
        </CardTitle>
        <CardDescription>Live updates and alerts from emergency officials.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 pr-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : alerts.length === 0 ? (
             <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground">No alerts at the moment.</p>
            </div>
          ) : (
            <div className="space-y-6">
                {alerts.map((alert, index) => (
                    <div key={alert.id}>
                        <div className="flex gap-4">
                            <div className="mt-1">{severityInfo[alert.severity as keyof typeof severityInfo].icon}</div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold font-headline">{alert.title}</h4>
                                    <span className="text-xs text-muted-foreground">{formatTimestamp(alert.timestamp)}</span>
                                </div>
                                <p className="text-sm text-foreground/80">{alert.content}</p>
                                <Badge variant={severityInfo[alert.severity as keyof typeof severityInfo].badge}>{alert.severity}</Badge>
                            </div>
                        </div>
                        {index < alerts.length - 1 && <Separator className="mt-6" />}
                    </div>
                ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
