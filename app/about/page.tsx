// app/about/page.tsx
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center px-6 py-16">
      {/* Heading */}
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight">About HireSmart AI</h1>
        <p className="text-lg leading-relaxed">
          HireSmart AI is a modern AI-powered recruitment platform designed to
          help companies streamline hiring and identify top talent efficiently.
          Our mission is simple: make recruitment smarter, faster, and fairer.
        </p>
      </div>

      {/* Vision & Mission Section */}
      <section className="max-w-5xl mt-20 grid sm:grid-cols-2 gap-12 text-center">
        <div className="p-8 rounded-2xl border border-black shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-base leading-relaxed">
            To empower organizations with AI-driven insights, ensuring that
            every recruitment process identifies the best candidates seamlessly.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-black shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-base leading-relaxed">
            To simplify hiring by combining advanced AI analysis with
            actionable recommendations, saving time and improving recruitment outcomes.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mt-20 space-y-10">
        <h2 className="text-3xl font-bold text-center">What We Offer</h2>
        <div className="grid sm:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-xl border border-black">
            <h3 className="text-xl font-semibold mb-2">Smart Candidate Matching</h3>
            <p className="text-sm">
              AI-powered analysis to match resumes with job requirements accurately.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-black">
            <h3 className="text-xl font-semibold mb-2">Automated Shortlisting</h3>
            <p className="text-sm">
              Automatically shortlist candidates based on experience, skills, and fit.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-black">
            <h3 className="text-xl font-semibold mb-2">Seamless Scheduling</h3>
            <p className="text-sm">
              Schedule interviews with shortlisted candidates effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 text-sm text-black border-t border-black pt-6 text-center w-full">
        © {new Date().getFullYear()} HireSmart AI. All rights reserved.
      </footer>
    </main>
  );
}
