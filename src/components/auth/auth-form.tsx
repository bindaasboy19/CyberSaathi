"use client";

import { AlertTriangle, LockKeyhole, Mail, ShieldCheck, User2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sharedCopy } from "@/lib/i18n";
import { loginSchema, registerSchema } from "@/lib/validation/schemas";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { pick } = useLanguage();
  const { login, register, configured } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [form, setForm] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const isRegister = mode === "register";
  const schema = isRegister ? registerSchema : loginSchema;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);
    setFieldErrors({});

    try {
      setIsSubmitting(true);
      const parsed = schema.safeParse(form);

      if (!parsed.success) {
        const nextErrors = parsed.error.flatten().fieldErrors as Partial<
          Record<keyof FormValues, string[]>
        >;
        setFieldErrors({
          name: nextErrors.name?.[0],
          email: nextErrors.email?.[0],
          password: nextErrors.password?.[0],
          confirmPassword: nextErrors.confirmPassword?.[0],
        });
        return;
      }

      if (isRegister) {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
        });
      } else {
        await login({
          email: form.email,
          password: form.password,
        });
      }

      router.push("/assistant");
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="hero-grid overflow-hidden">
          <CardHeader>
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-700 dark:text-sky-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure access
            </div>
            <CardTitle className="mt-3 text-3xl">
              {isRegister ? "Create your CyberSathi account" : "Welcome back to CyberSathi"}
            </CardTitle>
            <CardDescription>
              {isRegister
                ? "Save chats, post questions, track scam reports, and participate in the community with your role-aware profile."
                : "Sign in to sync your chat history, community activity, and incident reports across devices."}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {[
              "Save AI chat history securely in Firestore",
              "Report scams with structured details and status tracking",
              "Join the community feed with questions, answers, and case sharing",
              "Keep language preference and role metadata attached to your account",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-white/70 bg-white/70 p-4 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRegister ? pick(sharedCopy.register) : pick(sharedCopy.login)}</CardTitle>
            <CardDescription>
              {configured
                ? "Email/password authentication is backed by Firebase Auth."
                : pick(sharedCopy.firebaseMissing)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit}>
              {isRegister ? (
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                    <User2 className="h-4 w-4" />
                    Full name
                  </label>
                  <Input
                    onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Your name"
                    value={form.name}
                  />
                  {fieldErrors.name ? (
                    <p className="mt-2 text-sm text-rose-500">{fieldErrors.name}</p>
                  ) : null}
                </div>
              ) : null}

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <Input
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="name@example.com"
                  type="email"
                  value={form.email}
                />
                {fieldErrors.email ? (
                  <p className="mt-2 text-sm text-rose-500">{fieldErrors.email}</p>
                ) : null}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <LockKeyhole className="h-4 w-4" />
                  Password
                </label>
                <Input
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="••••••••"
                  type="password"
                  value={form.password}
                />
                {fieldErrors.password ? (
                  <p className="mt-2 text-sm text-rose-500">{fieldErrors.password}</p>
                ) : null}
              </div>

              {isRegister ? (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Confirm password
                  </label>
                  <Input
                    onChange={(event) =>
                      setForm((current) => ({ ...current, confirmPassword: event.target.value }))
                    }
                    placeholder="Repeat password"
                    type="password"
                    value={form.confirmPassword}
                  />
                  {fieldErrors.confirmPassword ? (
                    <p className="mt-2 text-sm text-rose-500">{fieldErrors.confirmPassword}</p>
                  ) : null}
                </div>
              ) : null}

              {serverError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{serverError}</span>
                  </div>
                </div>
              ) : null}

              <Button className="w-full" disabled={isSubmitting} type="submit">
                {isSubmitting
                  ? isRegister
                    ? "Creating account..."
                    : "Signing in..."
                  : isRegister
                    ? "Create account"
                    : "Sign in"}
              </Button>
            </form>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              {isRegister ? "Already have an account?" : "New to CyberSathi?"}{" "}
              <Link
                className="font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-300"
                href={isRegister ? "/login" : "/register"}
              >
                {isRegister ? "Sign in" : "Create one"}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
