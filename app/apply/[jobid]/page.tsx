import { getJobDetails } from "@/app/actions/getJobById";
import ApplyForm from "@/components/ApplyForm";

interface PageProps {
  params: { jobid: string };
}

export default async function ApplyPage({ params }: PageProps) {
  const jobId = params.jobid;

  const job: any = await getJobDetails(jobId);

  if (!job) {
    return (
      <main className="min-h-screen flex items-center justify-center text-red-600">
        <p>Job not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-8 py-12 text-black">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Job Info */}
        <section className="p-6 bg-white border border-black rounded-3xl shadow space-y-3">
          <h1 className="text-3xl font-bold text-black">{job.title}</h1>
          <p><strong>Company:</strong> {job.companyName}</p>
          <p><strong>Role:</strong> {job.role}</p>
          <p><strong>Skills:</strong> {Array.isArray(job.skills) ? job.skills.join(", ") : job.skills}</p>
          <p><strong>Pay:</strong> ${job.pay}/month</p>
          <p><strong>Experience Required:</strong> {job.experienceRequired} yrs</p>
          <p><strong>Company Description:</strong> {job.companyDescription}</p>
          {job.jobDescription && (
            <p><strong>Job Description:</strong> {job.jobDescription}</p>
          )}
        </section>

        {/* Check if form is closed */}
        {job.formClosed ? (
          <p className="text-center text-black font-bold text-xl">
            Applications are closed for this job.
          </p>
        ) : (
          <ApplyForm jobId={job.id} />
        )}
      </div>
    </main>
  );
}
