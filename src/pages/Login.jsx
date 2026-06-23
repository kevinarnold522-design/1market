import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LogIn } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import OAuthOptions from "@/components/auth/OAuthOptions";

export default function Login() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");

  return (
    <AuthLayout
      icon={LogIn}
      title="Welcome back"
      subtitle="Continue with Gmail or Yahoo"
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <OAuthOptions onError={setError} actionLabel="Continue with" redirectTo={searchParams.get('next') || '/'} showSeparator={false} />

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
    </AuthLayout>
  );
}