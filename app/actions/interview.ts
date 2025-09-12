"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import nodemailer from "nodemailer";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, // e.g., neeru.singh327@gmail.com
    pass: process.env.MAIL_PASS, // App password
  },
});

// Save HR Calendly link
export async function saveHrLink(link: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: { calendlyLink: link },
  });

  return user;
}

// Send interview email (auto uses HR link if present)
export async function sendInterviewEmail(applicantId: string, link?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const hr = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!hr) throw new Error("HR not found");

  const applicant = await prisma.shortlist.findUnique({
    where: { id: applicantId },
    include: { job: true },
  });
  if (!applicant) throw new Error("Applicant not found");
  if (!applicant.email) throw new Error("Applicant email not found");

  // Use HR saved link or passed link
  const interviewLink = link || hr.calendlyLink;
  if (!interviewLink) throw new Error("No Calendly link available");

 await transporter.sendMail({
  from: `"${hr.name ?? "HR"}" <${process.env.MAIL_USER}>`,
  to: applicant.email,
  subject: `Interview Invitation – ${applicant.job.companyName} | ${applicant.job.title}`,
  html: `
    <p>Dear ${applicant.name},</p>
    
    <p>We are pleased to inform you that you have been shortlisted for the <strong>${applicant.job.title}</strong> position at <strong>${applicant.job.companyName}</strong>.</p>
    
    <p>Please schedule your interview at a convenient time using the following link:</p>
    
    <p><a href="${interviewLink}" target="_blank" style="color: #000; text-decoration: underline;">${interviewLink}</a></p>
    
    <p>We look forward to speaking with you.</p>
    
    <p>Best regards,<br/>${hr.name ?? "HR Team"}<br/>${applicant.job.companyName}</p>
  `,
});


  return { success: true };
}

// Check if HR has a link
export async function getHrLink() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { calendlyLink: true },
  });

  return user?.calendlyLink || null;
}
