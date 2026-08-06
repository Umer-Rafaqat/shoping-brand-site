import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import AuthVisualPanel from "@/components/auth/AuthVisualPanel";
import PasswordInput from "@/components/auth/PasswordInput";
import SocialButtons from "@/components/auth/SocialButtons";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COPY = {
  login: {
    heading: "Welcome Back",
    subheading: "Log in to pick up right where you left off.",
    submitLabel: "Log In",
    submittingLabel: "Logging in...",
    switchPrompt: "Don't have an account?",
    switchLinkLabel: "Sign up",
    switchTo: "/signup",
  },
  signup: {
    heading: "Create Your Account",
    subheading: "Join 30,000+ members shopping smarter.",
    submitLabel: "Create Account",
    submittingLabel: "Creating account...",
    switchPrompt: "Already have an account?",
    switchLinkLabel: "Log in",
    switchTo: "/login",
  },
};

export default function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const copy = COPY[mode];

  const { signup, login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear field-level error on change
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  // ─── Client-side validation ─────────────────────────────────────────────────
  const validate = () => {
    const next = {};

    if (isSignup && !form.name.trim()) {
      next.name = "Enter your full name.";
    }
    if (!form.email.trim()) {
      next.email = "Enter your email address.";
    } else if (!EMAIL_REGEX.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!form.password) {
      next.password = "Enter a password.";
    } else if (isSignup && form.password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }
    if (isSignup && form.confirmPassword !== form.password) {
      next.confirmPassword = "Passwords don't match.";
    }
    if (isSignup && !agreedToTerms) {
      next.terms = "You need to agree to the terms to continue.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────
  // On success, AuthContext handles navigation (redirects to "/").
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError("");

    try {
      if (isSignup) {
        await signup({
          name: form.name,
          email: form.email,
          password: form.password,
        });
      } else {
        await login({ email: form.email, password: form.password });
      }
    } catch (err) {
      // Server validation errors (422) come as an array; everything else
      // is a single message string.
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        // Map express-validator field errors back to the form
        const mapped = {};
        data.errors.forEach(({ path, msg }) => {
          if (path) mapped[path] = msg;
        });
        setErrors(mapped);
      } else {
        setApiError(data?.message || "Something went wrong. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      <AuthVisualPanel />

      <div className="flex w-full flex-col px-6 py-8 lg:w-[54%] lg:justify-center lg:px-16 lg:py-12 xl:px-24">
        <Link
          to="/"
          className="mb-10 font-integral text-2xl font-bold tracking-tight lg:hidden"
        >
          SHOP.CO
        </Link>

        <div className="mx-auto w-full max-w-sm">
          <h1 className="font-integral text-3xl font-bold uppercase">
            {copy.heading}
          </h1>
          <p className="mt-2 font-satoshi text-sm text-black/60">
            {copy.subheading}
          </p>

          {/* Global API error banner */}
          {apiError && (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 font-satoshi text-sm text-red-600">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {isSignup && (
              <div>
                <input
                  type="text"
                  value={form.name}
                  onChange={updateField("name")}
                  placeholder="Full name"
                  className={`w-full rounded-full border px-5 py-3 font-satoshi text-sm outline-none placeholder:text-black/40 ${
                    errors.name ? "border-red-400" : "border-black/15"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1.5 font-satoshi text-xs text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            <div>
              <input
                type="email"
                value={form.email}
                onChange={updateField("email")}
                placeholder="Email address"
                className={`w-full rounded-full border px-5 py-3 font-satoshi text-sm outline-none placeholder:text-black/40 ${
                  errors.email ? "border-red-400" : "border-black/15"
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 font-satoshi text-xs text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <PasswordInput
              value={form.password}
              onChange={updateField("password")}
              error={errors.password}
            />

            {isSignup && (
              <PasswordInput
                value={form.confirmPassword}
                onChange={updateField("confirmPassword")}
                placeholder="Confirm password"
                error={errors.confirmPassword}
              />
            )}

            {isSignup ? (
              <div>
                <label className="flex items-start gap-2 font-satoshi text-xs text-black/60">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-black/20"
                  />
                  I agree to the Terms of Service and Privacy Policy.
                </label>
                {errors.terms && (
                  <p className="mt-1.5 font-satoshi text-xs text-red-500">
                    {errors.terms}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 font-satoshi text-xs text-black/60">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-black/20"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="font-satoshi text-xs text-black/60 underline underline-offset-2 hover:text-black"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" disabled={submitting} className="mt-2 w-full">
              {submitting ? copy.submittingLabel : copy.submitLabel}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-black/10" />
            <span className="font-satoshi text-xs text-black/40">
              or continue with
            </span>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <SocialButtons />

          <p className="mt-8 text-center font-satoshi text-sm text-black/60">
            {copy.switchPrompt}{" "}
            <Link
              to={copy.switchTo}
              className="font-medium text-black underline underline-offset-2"
            >
              {copy.switchLinkLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
