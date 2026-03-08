"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, User as UserIcon } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login, getProfile } from "@/features/auth/actions";
import { createUser, uploadUserAvatar } from "@/features/users/queries";
import { useAuthStore } from "@/store";
import {
  loginSchema,
  registerSchema,
  type LoginFormData,
  type RegisterFormData,
} from "@/features/auth/schema";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { setAuth } = useAuthStore();

  const syncSessionCookie = async (input: {
    role: "admin" | "customer";
    userId: number;
    accessToken: string;
    refreshToken: string;
  }) => {
    try {
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
    } catch {
      // noop: client auth store is still available as fallback
    }
  };

  const loginForm = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const getSafeNextUrl = () => {
    if (typeof window === "undefined") return null;
    const next = new URLSearchParams(window.location.search).get("next");
    return next && next.startsWith("/") ? next : null;
  };

  const handleLogin = loginForm.handleSubmit(async (data) => {
    setError("");
    try {
      const tokens = await login({ email: data.email, password: data.password });
      const user = await getProfile(tokens.access_token);
      await syncSessionCookie({
        role: user.role,
        userId: user.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });
      setAuth(user, tokens.access_token, tokens.refresh_token);
      onClose();
      const next = getSafeNextUrl();
      const canUseNext =
        !!next &&
        !(user.role === "admin" && next.startsWith("/cart")) &&
        !(user.role !== "admin" && next.startsWith("/dashboard"));
      if (canUseNext && next) {
        router.push(next);
      } else if (user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch {
      setError("Invalid email or password. Try: john@mail.com / changeme");
    }
  });

  const handleRegister = registerForm.handleSubmit(async (data) => {
    setError("");
    try {
      const selectedFile = data.avatarFile?.[0] as File | undefined;
      let avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`;

      if (selectedFile) {
        avatarUrl = await uploadUserAvatar(selectedFile);
      }

      await createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        avatar: avatarUrl,
      });
      const tokens = await login({ email: data.email, password: data.password });
      const user = await getProfile(tokens.access_token);
      await syncSessionCookie({
        role: user.role,
        userId: user.id,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });
      setAuth(user, tokens.access_token, tokens.refresh_token);
      onClose();
      const next = getSafeNextUrl();
      const canUseNext =
        !!next &&
        !(user.role === "admin" && next.startsWith("/cart")) &&
        !(user.role !== "admin" && next.startsWith("/dashboard"));
      if (canUseNext && next) {
        router.push(next);
      } else if (user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
      setAvatarPreview(null);
    } catch {
      setError("Registration failed. Email may already be in use.");
    }
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "login" ? "Welcome back" : "Create account"}
    >
      <div className="space-y-5">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="h-4 w-4" />}
              {...loginForm.register("email")}
              error={loginForm.formState.errors.email?.message}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
                {...loginForm.register("password")}
                error={loginForm.formState.errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button
              type="submit"
              className="w-full"
              loading={loginForm.formState.isSubmitting}
            >
              Sign In
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              icon={<UserIcon className="h-4 w-4" />}
              {...registerForm.register("name")}
              error={registerForm.formState.errors.name?.message}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="h-4 w-4" />}
              {...registerForm.register("email")}
              error={registerForm.formState.errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              {...registerForm.register("password")}
              error={registerForm.formState.errors.password?.message}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="h-4 w-4" />}
              {...registerForm.register("confirmPassword")}
              error={registerForm.formState.errors.confirmPassword?.message}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Profile Picture (optional)</label>
              <input
                type="file"
                accept="image/*"
                {...registerForm.register("avatarFile")}
                onChange={(event) => {
                  registerForm.setValue("avatarFile", event.target.files);
                  const file = event.target.files?.[0];
                  if (!file) {
                    setAvatarPreview(null);
                    return;
                  }
                  setAvatarPreview((current) => {
                    if (current) URL.revokeObjectURL(current);
                    return URL.createObjectURL(file);
                  });
                }}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-indigo-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-indigo-700"
              />
              {avatarPreview && (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-2">
                  <Image
                    src={avatarPreview}
                    alt="Avatar preview"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <p className="text-xs text-muted-foreground">Preview of selected profile picture</p>
                </div>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              loading={registerForm.formState.isSubmitting}
            >
              Create Account
            </Button>
          </form>
        )}

        <div className="text-center text-sm text-gray-500">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => { setMode("register"); setError(""); }}
                className="font-semibold text-indigo-600 hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => { setMode("login"); setError(""); }}
                className="font-semibold text-indigo-600 hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
