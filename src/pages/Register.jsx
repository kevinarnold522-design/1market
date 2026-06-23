import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import OAuthOptions from "@/components/auth/OAuthOptions";

export default function Register() {
  const [error, setError] = useState("");

  return (
    <AuthLayout
      icon={UserPlus}
      title="Create your account"
      subtitle="Create your account with Gmail or Yahoo"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <OAuthOptions onError={setError} actionLabel="Continue with" showSeparator={false} />

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
    </AuthLayout>
  );
}