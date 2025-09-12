"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { uploadJDAction } from "@/app/actions/jobs";

type Job = {
  id: string;
  companyName: string;
  title: string;
  role: string;
  skills: string; // ✅ treated as string for display
  pay: number;
  experienceRequired: number;
  companyDescription: string;
  jobDescription: string;
  createdAt: string | Date;
};

export default function DashboardClient({ jobs: initialJobs }: { jobs: Job[] }) {
  const { data: session } = useSession();
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [pay, setPay] = useState<number | "">("");
  const [experience, setExperience] = useState<number | "">("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(
    [...initialJobs].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );

  if (!session)
    return (
      <p className="text-center mt-10 text-black text-lg">
        Please sign in to view dashboard.
      </p>
    );

  const userId = session.user?.id!;

  const handleUploadJD = async () => {
    if (
      !companyName.trim() ||
      !role.trim() ||
      !skills.trim() ||
      pay === "" ||
      experience === "" ||
      !companyDescription.trim() ||
      !jobDescription.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const newJobResult = await uploadJDAction({
        companyName,
        title: role,
        role,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .join(","), // ✅ save as comma-separated string
        pay: Number(pay),
        experienceRequired: Number(experience),
        companyDescription,
        jobDescription,
      });

      const rawJob = newJobResult.job ?? newJobResult;
      const newJob: Job = {
        ...rawJob,
        skills: Array.isArray(rawJob.skills)
          ? rawJob.skills.join(", ")
          : String(rawJob.skills),
        jobDescription,
      };

      setJobs((prev) => [newJob, ...prev]);

      // reset form
      setCompanyName("");
      setRole("");
      setSkills("");
      setPay("");
      setExperience("");
      setCompanyDescription("");
      setJobDescription("");
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleNumberInput = (
    value: string,
    setter: (val: number | "") => void
  ) => {
    if (/^\d*$/.test(value)) {
      setter(value === "" ? "" : Number(value));
    }
  };

  return (
    <main className="min-h-screen bg-white px-8 py-12 text-black">
      <h1 className="text-4xl font-bold mb-10 text-center tracking-wide">
        HireSmart Dashboard
      </h1>

      {/* Upload JD Section */}
      <section className="mb-12 p-6 border-2 border-black rounded-3xl shadow-md space-y-4">
        <h2 className="font-semibold text-2xl mb-3 tracking-wide">
          Upload New Job Description
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="border border-black rounded-lg px-4 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Role / Job Title"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-black rounded-lg px-4 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Skills Required (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="border border-black rounded-lg px-4 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Experience Required (years)"
            value={experience}
            onChange={(e) => handleNumberInput(e.target.value, setExperience)}
            className="border border-black rounded-lg px-4 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Pay per month in $"
            value={pay}
            onChange={(e) => handleNumberInput(e.target.value, setPay)}
            className="border border-black rounded-lg px-4 py-2 w-full"
          />
        </div>

        <textarea
          placeholder="Company Description"
          value={companyDescription}
          onChange={(e) => setCompanyDescription(e.target.value)}
          className="border border-black rounded-lg px-4 py-2 w-full h-24"
        />

        <textarea
          placeholder="Job Description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="border border-black rounded-lg px-4 py-2 w-full h-32"
        />

        <Button
          onClick={handleUploadJD}
          className="bg-black text-white rounded-2xl px-6 py-3 flex items-center justify-center gap-2 w-full hover:bg-white hover:text-black border border-black transition-colors cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
          ) : (
            "Upload JD"
          )}
        </Button>
      </section>

      {/* Jobs List */}
      <section className="space-y-6">
        <h2 className="font-semibold text-2xl mb-4 tracking-wide">
          Your Job Listings
        </h2>
        {jobs.length === 0 && (
          <p className="text-black text-lg">No jobs uploaded yet.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-5 border-2 border-black rounded-2xl flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow"
            >
              <div>
                <h3 className="font-bold text-lg">{job.companyName}</h3>
                <p className="text-sm mt-1">{job.role}</p>
                <p className="text-xs mt-1 text-gray-500">
                  Skills: {job.skills}
                </p>
                <p className="text-xs mt-1 text-gray-500">
                  Experience: {job.experienceRequired} years
                </p>
                <p className="text-xs mt-1">
                  Posted on {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Link href={`/job/${job.id}`} className="mt-4">
                <Button className="bg-white text-black border border-black hover:bg-black hover:text-white w-full py-2 rounded-lg transition-colors cursor-pointer">
                  Open
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
