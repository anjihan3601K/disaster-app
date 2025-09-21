
"use client";

import { AppHeader } from "@/components/shared/AppHeader";
import { EmergencyControls } from "@/components/dashboard/EmergencyControls";
import { VoiceSOS } from "@/components/dashboard/VoiceSOS";
import { PhotoReporter } from "@/components/dashboard/PhotoReporter";
import { SafePath } from "@/components/dashboard/SafePath";
import { CommunityHelp } from "@/components/dashboard/CommunityHelp";
import { SafetyIndex } from "@/components/dashboard/SafetyIndex";
import { AlertsFeed } from "@/components/dashboard/AlertsFeed";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {isClient ? (
          <div className="grid gap-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            <div className="lg:col-span-2 xl:col-span-3 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <EmergencyControls />
                <VoiceSOS />
              </div>
              <AlertsFeed />
            </div>
            <div className="lg:col-span-1 xl:col-span-1 space-y-6">
              <SafetyIndex />
              <PhotoReporter />
              <SafePath />
              <CommunityHelp />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}
      </main>
    </div>
  );
}
