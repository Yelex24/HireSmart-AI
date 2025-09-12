"use server";

import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export type UploadJDInput = {
  companyName: string;
  title: string;
  role: string;
  skills: string; // comma-separated
  pay: number | string;
  experienceRequired: number | string;
  companyDescription: string;
  jobDescription?: string; // optional
};

export async function uploadJDAction(data: UploadJDInput) {
  // 1️⃣ Check session
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized: HR must be logged in");

  // 2️⃣ Get HR user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("HR not found");

  // 3️⃣ Generate unique slug
  const randomId = randomBytes(3).toString("hex");
  const slug = `${slugify(data.companyName)}-hiring-${randomId}`;

  // 4️⃣ Parse numbers safely
  const experienceRequiredValue = parseInt(data.experienceRequired as string, 10);
  const payValue = parseFloat(data.pay as string);

  if (isNaN(experienceRequiredValue)) {
    throw new Error("Invalid experienceRequired value. Must be a number.");
  }
  if (isNaN(payValue)) {
    throw new Error("Invalid pay value. Must be a number.");
  }

  // 5️⃣ Create Job in DB
  const job = await prisma.job.create({
    data: {
      userId: user.id,
      companyName: data.companyName,
      title: data.title,
      role: data.role,
      skills: data.skills.split(",").map((s) => s.trim()),
      pay: payValue,
      experienceRequired: experienceRequiredValue,
      companyDescription: data.companyDescription,
      jobDescription: data.jobDescription ?? "",
    },
  });

  // 6️⃣ Return safe serializable job + form link
  return {
    job: {
      ...job,
      pay: Number(job.pay),
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    },
    formLink: `/form/${slug}`,
  };
}
