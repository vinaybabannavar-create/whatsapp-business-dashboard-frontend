"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiLogin } from "@/lib/apiClient";
import { useAuthStore } from "@/store/useAuthStore";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await apiLogin({
        email: data.email,
        password: data.password,
      });

      // ✅ FIX: pass 4 args (token, userId, name, email)
      setAuth(res.token, res.userId, res.name, res.email);

      toast.success("Logged in successfully");
      router.push("/");
    } catch (error) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-6 text-center">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full mt-1 px-3 py-2 border rounded-md"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          © WhatsApp Business Dashboard
        </p>
      </div>
    </div>
  );
}
