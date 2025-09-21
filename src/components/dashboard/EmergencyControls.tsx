
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Siren, ShieldCheck, Phone } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

export function EmergencyControls() {
    const { toast } = useToast();

    const updateUserStatus = async (status: "Safe" | "Emergency") => {
        const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
        if (!userEmail) {
            toast({
                variant: "destructive",
                title: "Not Authenticated",
                description: "You must be logged in to update your status.",
            });
            return false;
        }

        try {
            const userDocRef = doc(db, "users", userEmail);
            const updateData: any = { 
                status: status,
                lastKnownLocation: status === "Emergency" ? "Unknown (SOS Triggered)" : "Safe",
            };
            if (status === "Emergency") {
                updateData.sosTimestamp = serverTimestamp();
            }
            await updateDoc(userDocRef, updateData);
            return true;
        } catch (error) {
            console.error("Error updating status:", error);
            toast({
                variant: "destructive",
                title: "Status Update Failed",
                description: "Could not update your status. Please try again.",
            });
            return false;
        }
    };

    const handleSafe = async () => {
        const success = await updateUserStatus("Safe");
        if (success) {
            toast({
                title: "Status Updated",
                description: "You have been marked as safe. Officials have been notified.",
                variant: "default",
            });
        }
    }

    const handleSOS = async () => {
        const success = await updateUserStatus("Emergency");
        if (success) {
            toast({
                title: "SOS Signal Sent!",
                description: "Your location and details have been sent to emergency services.",
                variant: "destructive",
            });
        }
    }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Emergency Controls</CardTitle>
        <CardDescription>Use these buttons to report your status or get help.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="lg" className="flex-1">
              <Siren className="mr-2 h-5 w-5" />
              Emergency SOS
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Emergency SOS</AlertDialogTitle>
              <AlertDialogDescription>
                This will immediately send your location and details to emergency officials. Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSOS} className="bg-destructive hover:bg-destructive/90">Confirm SOS</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button size="lg" className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleSafe}>
          <ShieldCheck className="mr-2 h-5 w-5" />
          I Am Safe
        </Button>

        <Button variant="destructive" size="lg" className="flex-1 bg-red-700 hover:bg-red-800" asChild>
          <Link href="/contacts">
            <Phone className="mr-2 h-5 w-5" />
            Contacts
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
