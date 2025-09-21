"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSafePath, GetSafePathOutput } from "@/ai/flows/dynamic-safe-path-guidance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Map, Route, Clock, AlertTriangle, Loader2, Pin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import('@/components/dashboard/DynamicMap'), {
  ssr: false,
  loading: () => <div className="aspect-video w-full bg-muted rounded-md flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin"/></div>
});

const formSchema = z.object({
  currentLocation: z.string().min(1, { message: "Location is required." }),
  disasterType: z.string().min(1, { message: "Disaster type is required." }),
  disasterSeverity: z.string().min(1, { message: "Severity is required." }),
});

// Helper function to parse coordinates from string
const parseCoords = (location: string): [number, number] | null => {
    const parts = location.replace(/°/g, '').split(',');
    if (parts.length !== 2) return null;
    const lat = parseFloat(parts[0].replace('N', '').replace('S', '-').trim());
    const lng = parseFloat(parts[1].replace('E', '').replace('W', '-').trim());
    if (isNaN(lat) || isNaN(lng)) return null;
    return [lat, lng];
}

export function SafePath() {
  const [result, setResult] = useState<GetSafePathOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentLocation: "12.9716° N, 77.5946° E", // Bangalore
      disasterType: "Flood",
      disasterSeverity: "High",
    },
  });

  const startCoords = parseCoords(form.getValues("currentLocation"));
  const endCoords = result?.destinationCoords ? [result.destinationCoords.lat, result.destinationCoords.lng] as [number, number] : null;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    if (!parseCoords(values.currentLocation)) {
        toast({ title: "Invalid Coordinates", description: "Please enter coordinates in the format '12.97° N, 77.59° E'", variant: "destructive" });
        setIsLoading(false);
        return;
    }
    try {
      const res = await getSafePath(values);
      setResult(res);
    } catch (error) {
      console.error("Error getting safe path:", error);
      toast({ title: "AI Error", description: "Could not generate a safe path.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Map className="h-5 w-5"/>
            Safe Path Guidance
        </CardTitle>
        <CardDescription>AI-powered dynamic evacuation routes to the nearest help center.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 12.97° N, 77.59° E" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="disasterType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Disaster</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Earthquake">Earthquake</SelectItem>
                        <SelectItem value="Flood">Flood</SelectItem>
                        <SelectItem value="Wildfire">Wildfire</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="disasterSeverity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select severity" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Route className="mr-2 h-4 w-4" />}
              {isLoading ? 'Generating...' : 'Find Safe Path'}
            </Button>
          </form>
        </Form>
        {isLoading && (
          <div className="mt-6 space-y-4 animate-pulse">
            <div className="p-4 bg-secondary/50 rounded-lg space-y-3">
              <div className="h-5 w-3/4 bg-muted rounded-md"></div>
              <div className="h-4 w-1/2 bg-muted rounded-md"></div>
              <div className="h-4 w-3/5 bg-muted rounded-md"></div>
              <div className="h-4 w-2/4 bg-muted rounded-md"></div>
            </div>
            <div className="aspect-video w-full bg-muted rounded-md"></div>
          </div>
        )}
        {result && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-secondary/50 rounded-lg space-y-3 text-sm">
                <h4 className="font-bold font-headline text-base">Recommended Evacuation Route:</h4>
                <div className="flex items-start gap-3">
                    <Pin className="h-5 w-5 text-primary mt-0.5" />
                    <p><span className="font-semibold">Destination:</span> {result.destination}</p>
                </div>
                <div className="flex items-start gap-3">
                    <Route className="h-5 w-5 text-primary mt-0.5" />
                    <p><span className="font-semibold">Path:</span> {result.safePath}</p>
                </div>
                 <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <p><span className="font-semibold">Est. Time:</span> {result.estimatedTime}</p>
                </div>
                 <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    <p><span className="font-semibold">Risk Level:</span> {result.riskLevel}</p>
                </div>
            </div>
             {startCoords && endCoords && (
                <div className="aspect-video w-full rounded-md overflow-hidden border">
                   <DynamicMap start={startCoords} end={endCoords} pathString={result.safePath} />
                </div>
             )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
