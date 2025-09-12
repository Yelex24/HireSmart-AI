"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // your NextAuth config
import { revalidatePath } from "next/cache";

export async function closeJobForm(formData: FormData) {
  // ✅ Get HR session
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Unauthorized: HR must be logged in to close the form");
  }

  // ✅ Get jobId from form
  const jobId = formData.get("jobId")?.toString();
  if (!jobId) throw new Error("Job ID missing");

  // ✅ Update job in database
  await prisma.job.update({
    where: { id: jobId },
    data: { formClosed: true },
  });

  // ✅ Revalidate job detail page so UI updates instantly
  revalidatePath(`/job/${jobId}`);
}
