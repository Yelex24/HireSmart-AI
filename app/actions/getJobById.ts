"use server";

import { prisma } from "@/lib/prisma";


export async function getJobDetails(jobId: string) {
  // 1️⃣ Check session
 

  // 2️⃣ Fetch job from DB
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      shortlisted: true, // include applicants
    },
  });

  if (!job) return null;

  // 3️⃣ Map job and applicants
  return {
    ...job,
    pay:
      typeof job.pay === "object" && "toNumber" in job.pay
        ? job.pay.toNumber()
        : Number(job.pay),
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    applicants: job.shortlisted.map((a) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      contactNumber: a.contactNumber,
      experienceYears: a.experienceYears ?? 0,
      experienceMonths: a.experienceMonths ?? 0,
      resumeText: a.resumeText ?? "",
      score: a.score ?? undefined,
      shortlisted: true,
      analysis: a.analysis ?? "",
      createdAt: a.createdAt.toISOString(),
    })),
  };
}
