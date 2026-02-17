import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0f] px-4">
      <div className="text-center">
        <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-red-400">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Authentication Error</h1>
        <p className="text-[#9ca3af] mb-6">
          Something went wrong during sign in. Please try again.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}