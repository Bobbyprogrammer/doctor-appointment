import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "@/features/auth/components/login-form";
import Link from "next/link";


export default function LoginPage() {
  
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardContent className="space-y-6 p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Login into your Account</h1>
            <p className="text-sm text-muted-foreground">
              Access Your Dashboard
            </p>
          </div>

          <LoginForm />
          <p> Don't have an account Create New Account   <Link href="/register" className="underline  text-blue-500">Signup</Link> </p>
      
        </CardContent>
      </Card>
    </div>
 
  );
}