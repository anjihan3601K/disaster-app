
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ShieldCheck, Bell, User } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-rose-50 to-orange-50">
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="flex flex-col items-center space-y-8">
          <div className="bg-red-500 p-4 rounded-2xl shadow-lg">
            <AlertTriangle className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-5xl font-bold font-headline text-gray-800">
            AlertNet
          </h1>

          <p className="max-w-2xl text-lg text-gray-600">
            Your lifeline during emergencies. Stay connected, stay safe, and help your
            community during disasters.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg">
              <Link href="/login">Citizen Login</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white hover:bg-gray-100 px-8 py-6 text-lg">
              <Link href="/login">
                <User className="mr-2 h-5 w-5" />
                Sign in as Admin
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 max-w-5xl">
            <FeatureCard
              icon={<AlertTriangle className="h-8 w-8 text-red-500" />}
              title="Emergency SOS"
              description="Instantly alert officials with your location and status during emergencies."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-8 w-8 text-green-500" />}
              title="Safety Updates"
              description="Let your loved ones and officials know you're safe with one tap."
            />
            <FeatureCard
              icon={<Bell className="h-8 w-8 text-blue-500" />}
              title="Real-time Alerts"
              description="Receive critical disaster alerts and safety information instantly."
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50">
      <CardHeader>
        <div className="flex items-center justify-center h-16 w-16 bg-white rounded-xl shadow-md mx-auto">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="text-center">
        <CardTitle className="text-xl font-headline mb-2">{title}</CardTitle>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}
