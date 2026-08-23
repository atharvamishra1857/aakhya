"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navbar";
// NEW: Import your server actions and Next.js router
import { loginAction, registerAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter(); // Allows us to redirect after login

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    
    try {
      let result;
      
      if (isLogin) {
        result = await loginAction(formData);
      } else {
        result = await registerAction(formData);
      }

      if (result?.error) {
        setStatus("error");
        setErrorMessage(result.error);
      } else if (result?.success) {
        setStatus("success");
        // Redirect to homepage or profile after a brief success message
        setTimeout(() => {
          router.push("/");
          router.refresh(); // Refresh to update navbar states if needed
        }, 1000);
      }
    } catch (error: any) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-bgprimary text-brand-ink font-body flex flex-col pt-24">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-brand-bgsecondary rounded-2xl border border-brand-borderlight p-8 shadow-xl relative overflow-hidden">
          
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-brand-ink mb-2">
              {isLogin ? "Welcome Back" : "Join Vreya"}
            </h1>
            <p className="text-sm text-brand-gray">
              {isLogin 
                ? "Sign in to access your orders and saved details." 
                : "Create an account for early access to limited editions."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-4"
                >
                  <input
                    type="text"
                    name="firstName"
                    required={!isLogin}
                    placeholder="First Name"
                    className="w-full px-4 py-3 bg-brand-bgprimary border border-brand-borderlight rounded-lg text-sm focus:outline-none focus:border-brand-sage transition-colors"
                  />
                  <input
                    type="text"
                    name="lastName"
                    required={!isLogin}
                    placeholder="Last Name"
                    className="w-full px-4 py-3 bg-brand-bgprimary border border-brand-borderlight rounded-lg text-sm focus:outline-none focus:border-brand-sage transition-colors"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              className="w-full px-4 py-3 bg-brand-bgprimary border border-brand-borderlight rounded-lg text-sm focus:outline-none focus:border-brand-sage transition-colors"
            />
            
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              className="w-full px-4 py-3 bg-brand-bgprimary border border-brand-borderlight rounded-lg text-sm focus:outline-none focus:border-brand-sage transition-colors"
            />

            {status === "error" && (
              <p className="text-brand-rose text-xs text-center">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="mt-4 w-full h-12 bg-brand-ink text-brand-ivory rounded-lg font-body text-[13px] uppercase tracking-wide hover:bg-opacity-90 transition-all flex items-center justify-center disabled:opacity-70"
            >
              {status === "loading" ? (
                <div className="w-5 h-5 border-2 border-brand-ivory border-t-transparent rounded-full animate-spin" />
              ) : status === "success" ? (
                <span className="text-brand-sage font-medium">Success!</span>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-brand-borderlight pt-6">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setStatus("idle");
                setErrorMessage("");
              }}
              className="text-sm text-brand-gray hover:text-brand-sage transition-colors"
            >
              {isLogin 
                ? "Don't have an account? Create one." 
                : "Already have an account? Sign in."}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}