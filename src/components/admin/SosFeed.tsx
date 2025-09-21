
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, Timestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Siren, User, MapPin, Clock, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";

interface SosSignal {
  id: string;
  name: string;
  lastKnownLocation: string;
  sosTimestamp: Timestamp;
}

export function SosFeed() {
  const [sosSignals, setSosSignals] = useState<SosSignal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sosQuery = query(
      collection(db, "users"),
      where("status", "==", "Emergency")
    );

    const unsubscribe = onSnapshot(sosQuery, (snapshot) => {
      const signals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as SosSignal));
      
      // Sort on the client-side
      signals.sort((a, b) => {
        if (a.sosTimestamp && b.sosTimestamp) {
          return b.sosTimestamp.toMillis() - a.sosTimestamp.toMillis();
        }
        return 0;
      });

      setSosSignals(signals);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching SOS signals:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const formatTimestamp = (timestamp: Timestamp) => {
    if (!timestamp) return "Just now";
    return `${formatDistanceToNow(timestamp.toDate())} ago`;
  };

  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Siren className="h-5 w-5 text-destructive" />
            Incoming SOS
        </CardTitle>
        <CardDescription>Live feed of user-initiated SOS signals.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[244px] pr-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : sosSignals.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground text-sm">No active SOS signals.</p>
            </div>
          ) : (
            <div className="space-y-4">
                {sosSignals.map((sos, index) => (
                    <div key={sos.id}>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 font-bold">
                                <User className="h-4 w-4" />
                                <span>{sos.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{sos.lastKnownLocation}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{formatTimestamp(sos.sosTimestamp)}</span>
                            </div>
                        </div>
                        {index < sosSignals.length - 1 && <Separator className="my-4" />}
                    </div>
                ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
