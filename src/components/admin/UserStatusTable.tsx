
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, UserCog, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  status: string;
  phone: string;
  lastKnownLocation: string;
  email: string;
  address: string;
}

export function UserStatusTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData: User[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(usersData);
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  const handleMarkAsSafe = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        status: "Safe"
      });
      toast({
        title: "User Status Updated",
        description: "The user has been successfully marked as safe.",
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update the user's status. Please try again.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Safe":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Safe</Badge>;
      case "Emergency":
        return <Badge variant="destructive">Emergency</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Users className="h-5 w-5"/>
          User Status Overview
        </CardTitle>
        <CardDescription>Manage and view the status of all registered users in the affected area.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : users.length === 0 ? (
           <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">No users have registered yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.phone || user.email}</TableCell>
                  <TableCell>{user.address || 'Not specified'}</TableCell>
                  <TableCell className="text-right">
                      {user.status === "Emergency" && (
                          <Button variant="outline" size="sm" onClick={() => handleMarkAsSafe(user.id)}>
                              <Check className="mr-2 h-4 w-4" />
                              Mark as Safe
                          </Button>
                      )}
                       {user.status !== "Emergency" && (
                          <Button variant="ghost" size="sm" disabled>
                              <UserCog className="h-4 w-4" />
                          </Button>
                      )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
