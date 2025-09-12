"use client";

import { useState } from "react";
import {
  sendInterviewEmail,
  saveHrLink,
  getHrLink,
} from "@/app/actions/interview";
import { CheckCircle } from "lucide-react";

interface Props {
  applicant: {
    id: string;
    name: string;
    email: string;
    contactNumber: string;
    experienceYears: number;
    experienceMonths: number;
    score?: number;
    analysis?: string;
    job: {
      companyName: string;
      role: string;
      title: string;
      skills: string[];
      pay: number;
      experienceRequired: number;
      jobDescription?: string;
    };
  };
}

export default function ApplicantDetailPageClient({ applicant }: Props) {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [calendlyInput, setCalendlyInput] = useState("");

  const handleSchedule = async () => {
    setLoading(true);
    try {
      const hrLink = await getHrLink();
      if (hrLink) {
        await sendInterviewEmail(applicant.id, hrLink);
        setShowSuccess(true);
      } else {
        setShowPopup(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndSend = async () => {
    if (!calendlyInput.trim()) return;
    setLoading(true);
    try {
      await saveHrLink(calendlyInput.trim());
      await sendInterviewEmail(applicant.id, calendlyInput.trim());
      setShowSuccess(true);
      setShowPopup(false);
      setCalendlyInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-3xl mx-auto">
      {/* Applicant Info */}
      <section className="p-6 border border-black rounded-3xl shadow-lg space-y-4 bg-white">
        <h2 className="text-2xl font-semibold border-b border-black pb-2">
          Applicant Details
        </h2>
        <p>
          <strong>Email:</strong> {applicant.email}
        </p>
        <p>
          <strong>Contact:</strong> {applicant.contactNumber}
        </p>
        <p>
          <strong>Experience:</strong> {applicant.experienceYears} yrs{" "}
          {applicant.experienceMonths} mos
        </p>
        {applicant.score !== undefined && (
          <p>
            <strong>Score:</strong> {applicant.score}
          </p>
        )}
        {applicant.analysis && (
          <p>
            <strong>Analysis:</strong> {applicant.analysis}
          </p>
        )}

        {/* Applied Job Section */}
        <div className="mt-6 space-y-3">
          <h3 className="font-semibold text-xl border-b border-black pb-2">
            Applied Job
          </h3>
          <div className="space-y-2">
            <p>
              <strong>Company:</strong> {applicant.job.companyName}
            </p>
            <p>
              <strong>Role:</strong> {applicant.job.role}
            </p>
            <p>
              <strong>Title:</strong> {applicant.job.title}
            </p>
            <p>
              <strong>Skills:</strong> {applicant.job.skills.join(", ")}
            </p>
            <p>
              <strong>Pay:</strong> ${applicant.job.pay}/month
            </p>
            <p>
              <strong>Experience Required:</strong>{" "}
              {applicant.job.experienceRequired} yrs
            </p>
            {applicant.job.jobDescription && (
              <p>
                <strong>Job Description:</strong>
                <br />
                <span className="whitespace-pre-line">
                  {applicant.job.jobDescription}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Schedule Interview Button */}
        <button
          onClick={handleSchedule}
          disabled={loading}
          className={`mt-6 w-full flex justify-center items-center gap-2 px-4 py-3 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-gray-500"
              : "bg-black hover:bg-white hover:text-black hover:border hover:border-black"
          }`}
        >
          {loading && (
            <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Processing..." : "Schedule Interview"}
        </button>
      </section>

      {/* Glass Popup for HR Calendly */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-2xl space-y-4 w-full max-w-md transform scale-95 animate-scaleIn">
            <h2 className="text-xl font-bold text-center">
              Enter your Calendly link
            </h2>
            <input
              type="text"
              placeholder="https://calendly.com/your-link"
              value={calendlyInput}
              onChange={(e) => setCalendlyInput(e.target.value)}
              className="w-full border border-black p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              autoFocus
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAndSend}
                className="px-4 py-2 bg-black text-white rounded hover:bg-white hover:text-black hover:border hover:border-black transition"
                disabled={loading}
              >
                {loading ? "Processing..." : "Save & Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center space-y-4 max-w-sm w-full transform scale-95 animate-scaleIn">
            <CheckCircle className="mx-auto text-black w-12 h-12" />
            <h2 className="text-2xl font-bold text-black">
              Interview Scheduled!
            </h2>
            <p className="text-gray-700">
              The applicant has received your interview invite.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-4 px-6 py-2 border border-black rounded hover:bg-black hover:text-white transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
