// app/applicant/[applicantid]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ApplicantDetailPageClient from "@/components/ApplicantDetailPageClient";

interface PageProps {
  params: {
    applicantid: string;
  };
}

export default async function ApplicantDetailPage({ params }: PageProps) {
  const { applicantid } = params;

  // Fetch applicant with job
  const applicant = await prisma.shortlist.findUnique({
    where: { id: applicantid },
    include: { job: true },
  });

  if (!applicant) return notFound();

  // Serialize + normalize nullable fields
  const safeApplicant = {
    ...applicant,
    analysis: applicant.analysis ?? undefined, // ✅ convert null → undefined
    job: {
      ...applicant.job,
      pay: Number(applicant.job.pay),
      createdAt: applicant.job.createdAt.toISOString(),
      updatedAt: applicant.job.updatedAt.toISOString(),
      jobDescription: applicant.job.jobDescription ?? undefined, // ✅ normalize as well
    },
  };

  return <ApplicantDetailPageClient applicant={safeApplicant} />;
}
