
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ShieldCheck, LogIn } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const adminDocRef = doc(db, "admins", values.email);
      const adminDoc = await getDoc(adminDocRef);

      if (adminDoc.exists()) {
        // This is a potential admin, check password (placeholder)
        if (values.password === "Sai@2006") {
           if (typeof window !== 'undefined') {
                localStorage.setItem('userEmail', values.email);
            }
          router.push("/admin/dashboard");
        } else {
          toast({ variant: "destructive", title: "Invalid Credentials", description: "Please check your password and try again." });
        }
        return;
      }
      
      // If not an admin, check if they are a regular user
      const userDocRef = doc(db, "users", values.email);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        // In a real app, passwords should be hashed. For this demo, we compare plain text.
        if (userData.password === values.password) {
            if (typeof window !== 'undefined') {
                localStorage.setItem('userEmail', values.email);
            }
            router.push("/dashboard");
        } else {
             toast({ variant: "destructive", title: "Invalid Credentials", description: "Please check your password and try again." });
        }
      } else {
        // User not found in admins or users
        toast({
          variant: "destructive",
          title: "Account Not Found",
          description: "No account found with this email. Please sign up.",
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast({ variant: "destructive", title: "Login Failed", description: "An unexpected error occurred. Please try again." });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full shadow-xl">
        <CardHeader className="text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
          <CardTitle className="text-2xl font-headline">AlertNet</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isClient ? (
            <>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="m@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      <LogIn className="mr-2 h-4 w-4" /> Login
                    </Button>
                  </div>
                </form>
              </Form>
              <Separator className="my-6" />
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline text-primary" prefetch={false}>
                  Sign up
                </Link>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center p-8">
                <LogIn className="h-6 w-6 animate-spin" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
