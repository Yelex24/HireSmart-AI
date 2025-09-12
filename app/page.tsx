// app/page.tsx
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";

export default function LandingPage() {
  const { data: session } = useSession(); // get user session

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="max-w-3xl text-center space-y-8">
        {/* Heading */}
        <h1 className="text-5xl font-extrabold tracking-tight text-black">
          HireSmart AI
        </h1>

        {/* Subtext */}
        <p className="text-lg text-black max-w-xl mx-auto">
          Upload your job descriptions, share public links, and let AI handle
          candidate shortlisting and automated scheduling. Hire smarter, faster.
        </p>

        {/* Show Sign-in Button only if NOT signed in */}
        {!session && (
          <div className="flex items-center justify-center pt-6">
            <a
              href="/signin"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-black/90 transition"
            >
              Sign in with Google <ArrowRight size={18} />
            </a>
          </div>
        )}

        {/* If signed in, show button to go to dashboard */}
        {session && (
          <div className="flex items-center justify-center pt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-black bg-white text-black font-semibold hover:bg-black hover:text-white transition"
            >
              Go to Dashboard <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>

      {/* Features Section */}
      <section
        id="features"
        className="max-w-5xl mx-auto mt-24 grid sm:grid-cols-3 gap-8 text-center"
      >
        <div className="p-6 rounded-xl border border-black">
          <h3 className="text-xl font-bold mb-2 text-black">Upload Job Descriptions</h3>
          <p className="text-sm text-black">
            HRs can upload job descriptions quickly and share public links for applicants.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-black">
          <h3 className="text-xl font-bold mb-2 text-black">AI Candidate Matching</h3>
          <p className="text-sm text-black">
            Resumes are analyzed and matched with job requirements automatically.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-black">
          <h3 className="text-xl font-bold mb-2 text-black">Automated Scheduling</h3>
          <p className="text-sm text-black">
            Shortlisted candidates receive meeting links without manual effort.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 text-sm text-black border-t border-black pt-6 text-center">
        © {new Date().getFullYear()} HireSmart AI. All rights reserved.
      </footer>
    </main>
  );
}
