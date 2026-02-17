import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LoginButton from "@/components/LoginButton";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] relative overflow-hidden px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">
        {/* Logo/Icon */}
        <div className="mb-8 flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            className="text-indigo-400"
          >
            <path
              d="M5 3H19C19.5523 3 20 3.44772 20 4V20.382C20 20.7607 19.786 21.107 19.4472 21.2764C19.1085 21.4458 18.7056 21.4124 18.4 21.2L12 16.6667L5.6 21.2C5.29439 21.4124 4.89151 21.4458 4.55279 21.2764C4.21407 21.107 4 20.7607 4 20.382V4C4 3.44772 4.44772 3 5 3Z"
              fill="currentColor"
              opacity="0.3"
            />
            <path
              d="M5 3H19C19.5523 3 20 3.44772 20 4V20.382C20 20.7607 19.786 21.107 19.4472 21.2764C19.1085 21.4458 18.7056 21.4124 18.4 21.2L12 16.6667L5.6 21.2C5.29439 21.4124 4.89151 21.4458 4.55279 21.2764C4.21407 21.107 4 20.7607 4 20.382V4C4 3.44772 4.44772 3 5 3Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Brand name */}
        <h1 className="text-5xl font-bold tracking-tight mb-3">
          <span className="text-white">Markd</span>
        </h1>

        <p className="text-[#9ca3af] text-lg mb-2 font-light">
          Your personal bookmark manager
        </p>

        <p className="text-[#6b7280] text-sm mb-10 max-w-xs leading-relaxed">
          Save links, stay organized. Real-time sync across all your tabs and devices.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {["Private & Secure", "Real-time Sync", "Instant Access"].map(
            (feature) => (
              <span
                key={feature}
                className="px-3 py-1 rounded-full text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20"
              >
                {feature}
              </span>
            )
          )}
        </div>

        {/* Login button */}
        <LoginButton />

        <p className="mt-6 text-xs text-[#4b5563]">
          Sign in with Google to get started. No password required.
        </p>
      </div>
    </main>
  );
}