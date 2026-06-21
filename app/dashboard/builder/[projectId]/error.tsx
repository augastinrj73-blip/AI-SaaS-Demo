"use client";

import { useEffect } from "react";

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Project page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#030305] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full glass border border-red-500/20 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-[15px] font-semibold text-white mb-2">Something went wrong</p>
        <p className="text-[13px] text-white/35 mb-1 font-mono bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-left break-all">
          {error.message}
        </p>
        {error.digest && (
          <p className="text-[11px] text-white/20 mb-5">digest: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="mt-5 btn-primary px-6 py-2.5 rounded-xl text-[13px] font-semibold"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
