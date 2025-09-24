
'use client';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Crown, Loader2 } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signupUser } from "@/app/actions/auth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const signupSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  pin: z.string().length(4, "PIN must be exactly 4 digits"),
});

type SignupFormValues = z.infer<typeof signupSchema>;


export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: "",
      mobile: "",
      password: "",
      pin: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    const result = await signupUser(data);
    setLoading(false);

    if (result.error) {
      toast({
        title: "Signup Failed",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signup Successful",
        description: "You can now log in.",
      });
      router.push("/login");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Crown className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your mobile number" {...field} />
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
                      <Input type="password" placeholder="Create a password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>4-Digit PIN</FormLabel>
                    <FormControl>
                      <Input type="password" maxLength={4} placeholder="Create a 4-digit PIN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create an account"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
