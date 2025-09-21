"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Handshake, HandHeart, MapPinned } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export function CommunityHelp() {
    const { toast } = useToast();

    const handleOfferHelp = () => {
        toast({ title: "Help Offered", description: "Your offer to help is now visible to nearby users." });
    };

    const handleNeedHelp = () => {
        toast({ title: "Request Sent", description: "Your request for help is now visible to nearby users." });
    };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Handshake className="h-5 w-5" />
            Community Help
        </CardTitle>
        <CardDescription>Offer or request help from your community.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleOfferHelp} className="h-16 flex-col">
                <HandHeart className="h-6 w-6 mb-1 text-green-500" />
                <span className="text-xs">I Can Help</span>
            </Button>
            <Button variant="outline" onClick={handleNeedHelp} className="h-16 flex-col">
                 <Handshake className="h-6 w-6 mb-1 text-blue-500" />
                 <span className="text-xs">I Need Help</span>
            </Button>
        </div>
        <div className="relative aspect-video w-full rounded-md overflow-hidden border">
             <Image src="https://picsum.photos/seed/map/400/225" alt="Map of help requests" fill style={{objectFit: 'cover'}} data-ai-hint="map satellite" />
             <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <Button variant="secondary">
                    <MapPinned className="mr-2 h-4 w-4" />
                    Open Map View
                </Button>
             </div>
        </div>
      </CardContent>
    </Card>
  );
}
