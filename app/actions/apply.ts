"use server";

import { prisma } from "@/lib/prisma";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

// === Setup Gemini ===
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Server Action: Parse resume, compare with JD, and store only if shortlisted
 */
export async function submitApplicationWithAI(formData: FormData) {
  try {
    // === Extract Job ID ===
    const jobId = formData.get("jobId") as string;
    if (!jobId) throw new Error("Job ID is missing");

    // === Extract Applicant Info ===
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const contactNumber = formData.get("contactNumber") as string;
    const experienceYears = parseInt(formData.get("experienceYears") as string, 10) || 0;
    const experienceMonths = parseInt(formData.get("experienceMonths") as string, 10) || 0;

    if (!name || !email || !contactNumber) {
      throw new Error("Missing required applicant fields");
    }

    // === Handle File Upload ===
    const resumeFile = formData.get("resume") as File;
    if (!resumeFile) throw new Error("No resume uploaded");

    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    const filePath = path.join(uploadDir, `${Date.now()}-${resumeFile.name}`);
    const buffer = Buffer.from(await resumeFile.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // === Parse Resume with LangChain ===
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    const resumeContent = docs.map((d) => d.pageContent).join("\n");

    // === Get JD from DB ===
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });
    if (!job) throw new Error("Job not found");

    const jdContent = `
Job Title: ${job.title}
Role: ${job.role}
Skills: ${job.skills.join(", ")}
Experience Required: ${job.experienceRequired} years
Pay: ${job.pay}
Company Description: ${job.companyDescription}
Job Description: ${job.jobDescription ?? ""}
    `;

    // === AI Prompt ===
 const prompt = `
You are a professional recruiter and talent assessor. 
Your task is to **evaluate a candidate's resume against a specific Job Description** and provide a strict suitability score.

Instructions:
1. Compare the **Job Description** and the **Candidate Resume** thoroughly.
2. Assess skills, experience, role match, and overall suitability.
3. Only consider candidates highly suitable if they are truly qualified.
4. Give a numeric **score between 0 and 100**.
   - Scores above 80 indicate a highly suitable candidate.
   - Scores 80 or below indicate not suitable.
5. Provide a concise analysis explaining why the candidate was scored this way (1–2 sentences).
6. Return **ONLY valid JSON** in the following exact format:
{
  "score": number,
  "analysis": "short explanation"
}

Do NOT include any extra text, markdown, or commentary outside the JSON.

--- Job Description ---
${jdContent}

--- Candidate Resume ---
${resumeContent}
`;


    // === Call Gemini AI ===
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // 🔧 Clean up possible ```json ... ``` wrappers
    if (text.startsWith("```")) {
      text = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }

    let score = 0;
    let analysis = "";
    try {
      const parsed = JSON.parse(text);
      score = parsed.score ?? 0;
      analysis = parsed.analysis ?? "";
    } catch (e) {
      console.error("❌ Could not parse Gemini response:", text);
      throw new Error("Gemini did not return valid JSON");
    }

    // === Save application only if shortlisted ===
    const shortlisted = score > 80;
    if (shortlisted) {
      await prisma.shortlist.create({
        data: {
          jobId,
          name,
          email,
          contactNumber,
          experienceYears,
          experienceMonths,
          resumeText: resumeContent,
          score,
          analysis,
        },
      });
    }

    return { success: true, score, shortlisted, analysis };
  } catch (err: any) {
    console.error("❌ Error in submitApplicationWithAI:", err);
    return { success: false, error: err.message };
  }
}
