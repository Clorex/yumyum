"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCustomerAuth } from "@/store/customerAuth";

export default function LoginPage() {
  const router = useRouter();
  const auth = useCustomerAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);

  function submit() {
    setErr(null);
    const res = auth.login(email, password);
    if (!res.ok) {
      setErr(res.error);
      return;
    }
    router.replace("/");
  }

  return (
    <div className="min-h-screen bg-yum-bg px-4 flex items-center justify-center">
      <Card className="w-full max-w-md p-7">
        <h1 className="text-2xl font-semibold">Customer login</h1>
        <p className="mt-1 text-sm text-yum-text-secondary">
          Sign in with email and password.
        </p>

        <div className="mt-5 space-y-3">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {err ? <p className="text-sm font-semibold text-brand-deep">{err}</p> : null}

          <Button className="w-full" onClick={submit}>
            Login
          </Button>

          <Link className="block text-sm font-semibold text-brand-deep" href="/">
            ← Back home
          </Link>
        </div>
      </Card>
    </div>
  );
}