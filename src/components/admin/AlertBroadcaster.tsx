
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Send, Megaphone, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { generateAlertSuggestion } from "@/ai/flows/generate-alert-suggestion";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  severity: z.string().min(1, { message: "Severity is required." }),
  message: z.string().min(20, { message: "Message must be at least 20 characters." }),
});

export function AlertBroadcaster() {
  const { toast } = useToast();
  const [isBroadcasting, setIsBroadcasting] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      severity: "Moderate",
      message: "",
    },
  });

  const handleGenerateSuggestion = async () => {
    setIsGenerating(true);
    const severity = form.getValues("severity");
    // For simplicity, we'll use a disaster type. This could be an input field.
    const disasterType = "Wildfire"; 

    try {
      const suggestion = await generateAlertSuggestion({
        disasterType,
        severity,
      });
      form.setValue("title", suggestion.title, { shouldValidate: true });
      form.setValue("message", suggestion.message, { shouldValidate: true });
      toast({
        title: "AI Suggestion Generated",
        description: "Review and edit the suggested alert before broadcasting.",
      });
    } catch (error) {
      console.error("Error generating alert suggestion:", error);
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: "Could not generate a suggestion. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsBroadcasting(true);
    try {
      await addDoc(collection(db, "alerts"), {
        ...values,
        timestamp: serverTimestamp(),
      });
      toast({
        title: "Alert Broadcasted",
        description: `"${values.title}" has been sent to all users.`,
      });
      form.reset();
    } catch (error) {
      console.error("Error broadcasting alert:", error);
      toast({
        variant: "destructive",
        title: "Broadcast Failed",
        description: "Could not send the alert. Please try again.",
      });
    } finally {
        setIsBroadcasting(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Broadcast New Alert
        </CardTitle>
        <CardDescription>
          Compose and send a new alert to all users. This action is immediate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alert Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Evacuation Order Issued" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select severity" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Info">Info</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <Button type="button" variant="outline" onClick={handleGenerateSuggestion} disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {isGenerating ? 'Generating...' : 'Generate with AI'}
                </Button>
            </div>
             <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alert Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide clear instructions and details about the situation..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" size="lg" disabled={isBroadcasting}>
              {isBroadcasting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {isBroadcasting ? 'Broadcasting...' : 'Broadcast Alert'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
