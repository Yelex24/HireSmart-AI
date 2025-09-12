import DashboardClient from "@/components/DashBoardClient";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Suspense } from "react";

// ✅ Loading component (spinner)
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

async function DashboardContent() {
  // Get the current user session
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <p className="text-center mt-10 text-black text-lg">
        Please sign in to view your dashboard.
      </p>
    );
  }

  const userId = session.user.id;

  // Fetch only jobs created by this user
  const jobs = await prisma.job.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      companyName: true,
      title: true,
      role: true,
      skills: true, // string[]
      pay: true,
      experienceRequired: true,
      companyDescription: true,
      jobDescription: true,
      createdAt: true,
    },
  });

  // Convert Decimal, Date, and skills[] → string
  const jobsWithSafeTypes = jobs.map((job) => ({
    ...job,
    pay:
      typeof job.pay === "object" && "toNumber" in job.pay
        ? job.pay.toNumber()
        : Number(job.pay),
    createdAt: job.createdAt.toISOString(),
    skills: Array.isArray(job.skills) ? job.skills.join(", ") : String(job.skills), // ✅ normalize
  }));

  return <DashboardClient jobs={jobsWithSafeTypes} />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardContent />
    </Suspense>
  );
}
