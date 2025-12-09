// Placeholder content for src/app/login/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiLogin } from "@/lib/apiClient";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await apiLogin(data.email, data.password);
      setAuth(res.token, res.userId);
      toast.success("Logged in successfully");
      router.push("/");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-wa-bg">
      <div className="w-full max-w-md bg-wa-surface border border-slate-800 rounded-xl p-6 shadow-lg">
        <h1 className="text-xl font-semibold mb-4">
          WhatsApp Business Dashboard
        </h1>
        <p className="text-xs text-slate-400 mb-4">
          Sign in to continue. (Connect this to your real FastAPI auth.)
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs mb-1 block">Email</label>
            <Input type="email" {...register("email")} />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-xs mb-1 block">Password</label>
            <Input type="password" {...register("password")} />
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-wa-primary hover:bg-emerald-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
