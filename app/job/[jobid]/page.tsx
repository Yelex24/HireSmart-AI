import { getJobDetails } from "@/app/actions/getJobById";
import { closeJobForm } from "@/app/actions/closeJobForm"; 
import CopyLink from "@/components/CopyLink";
import Link from "next/link";

interface Applicant {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  experienceYears: number;
  experienceMonths: number;
  shortlisted: boolean;
  score?: number;
}

interface Job {
  id: string;
  companyName: string;
  role: string;
  title: string;
  skills: string[];
  pay: number;
  experienceRequired: number;
  companyDescription: string;
  jobDescription: string;
  createdAt: string;
  applicants: Applicant[];
  isFormClosed: boolean;
}

interface PageProps {
  params: { jobid: string };
}

export default async function JobDetailPage({ params }: PageProps) {
  const jobId = params.jobid;

  let job: any = null;
  try {
    const jobData: any = await getJobDetails(jobId);

    if (!jobData) throw new Error("Job not found");

    job = {
      ...jobData,
      pay:
        typeof jobData.pay === "object" && "toNumber" in jobData.pay
          ? jobData.pay.toNumber()
          : Number(jobData.pay),
      createdAt:
        jobData.createdAt instanceof Date
          ? jobData.createdAt.toISOString()
          : jobData.createdAt,
      applicants: jobData.applicants.map((a: any) => ({
        id: a.id,
        name: a.name,
        email: a.email,
        contactNumber: a.contactNumber,
        experienceYears: a.experienceYears,
        experienceMonths: a.experienceMonths,
        shortlisted: true,
        score: a.score ?? undefined,
      })),
      isFormClosed: jobData.isFormClosed ?? false,
    };
  } catch {
    return (
      <main className="min-h-screen flex items-center justify-center text-black">
        <p>Job not found</p>
      </main>
    );
  }

  const jobLink = `${process.env.NEXT_PUBLIC_SITE_URL}/apply/${job.id}`;

  return (
    <main className="min-h-screen bg-gray-50 px-8 py-12 text-black">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <h1 className="text-4xl font-bold mb-4 text-center tracking-wide">
          {job.companyName} – {job.role}
        </h1>

        <CopyLink link={jobLink} />

        {/* Close Form Button */}
        {!job.isFormClosed && (
          <form action={closeJobForm} className="mb-6 text-center">
            <input type="hidden" name="jobId" value={job.id} />
            <button
              type="submit"
              className="px-6 py-3 border border-gray-800 rounded-2xl hover:bg-gray-800 hover:text-white transition-colors"
            >
              Close Form
            </button>
          </form>
        )}
        {job.isFormClosed && (
          <p className="text-center text-red-600 font-semibold mb-6">
            Form is closed for applicants.
          </p>
        )}

        {/* Job Details */}
        <section className="mb-12 p-6 bg-white border border-gray-200 rounded-3xl shadow-md space-y-4">
          <h2 className="font-semibold text-2xl mb-2 border-b pb-2 text-gray-800">
            Job Details
          </h2>
          <p>
            <strong>Title:</strong> {job.title}
          </p>
          <p>
            <strong>Skills:</strong> {job.skills.join(", ")}
          </p>
          <p>
            <strong>Pay:</strong> ${job.pay}/month
          </p>
          <p>
            <strong>Experience Required:</strong> {job.experienceRequired} yrs
          </p>
          <p>
            <strong>Company Description:</strong> {job.companyDescription}
          </p>
          {job.jobDescription && (
            <div>
              <strong>Job Description:</strong>
              <p className="whitespace-pre-line mt-1 text-gray-700">
                {job.jobDescription}
              </p>
            </div>
          )}
        </section>

        {/* Applicants */}
        <section className="space-y-6">
          <h2 className="font-semibold text-2xl mb-4 border-b pb-2 text-gray-800">
            Applicants
          </h2>
          {job.applicants.length === 0 && (
            <p className="text-gray-600">No applicants yet.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {job.applicants.map((a:any) => (
              <Link
                key={a.id}
                href={`/applicant/${a.id}`}
                className="block p-5 border rounded-2xl shadow-md bg-white text-black 
                           hover:shadow-lg hover:border-gray-400 transition-all duration-200"
              >
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">{a.name}</h3>
                  <p className="text-sm text-gray-600">{a.email}</p>
                  <p className="text-sm text-gray-600">{a.contactNumber}</p>
                  {a.score !== undefined && (
                    <p className="text-xs font-semibold text-gray-500">
                      Score: {a.score}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
