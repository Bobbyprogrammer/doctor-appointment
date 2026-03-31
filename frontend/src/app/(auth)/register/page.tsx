import { Card, CardContent } from "@/components/ui/card";
import RegisterForm from "@/features/auth/components/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardContent className="space-y-6 p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-sm text-muted-foreground">
              Register as a patient
            </p>
          </div>

          <RegisterForm />
             <p> Already have an account ?   <Link href="/login" className="underline  text-blue-500">Login</Link> </p>
        </CardContent>
      </Card>
    </div>
  );
}