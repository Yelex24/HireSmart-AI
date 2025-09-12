"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { submitApplicationWithAI } from "@/app/actions/apply";

export default function ApplyForm({ jobId }: { jobId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    formData.append("jobId", jobId);

    await submitApplicationWithAI(formData);

    setLoading(false);
    setSuccess(true);
    formEl.reset();

    // Hide success popup after 3s
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white border-2 border-black p-8 rounded-3xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-black mb-6 tracking-wide">
          Apply Now
        </h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          className="w-full border-2 border-black px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full border-2 border-black px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* Contact */}
        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number"
          required
          className="w-full border-2 border-black px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* Experience */}
        <div className="flex gap-3">
          <input
            type="number"
            name="experienceYears"
            placeholder="Years"
            min={0}
            className="w-1/2 border-2 border-black px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="number"
            name="experienceMonths"
            placeholder="Months"
            min={0}
            max={11}
            className="w-1/2 border-2 border-black px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Resume Upload */}
        <input
          type="file"
          name="resume"
          required
          accept="application/pdf"
          className="w-full border-2 border-dashed border-black px-4 py-6 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 text-center text-sm 
            file:mr-4 file:py-2 file:px-4 file:rounded-md 
            file:border-0 file:bg-black file:text-white 
            hover:file:bg-white hover:file:text-black hover:file:border hover:file:border-black"
        />

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-white hover:text-black hover:border-2 hover:border-black rounded-xl py-3 text-lg font-semibold transition-all"
        >
          {loading && (
            <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </form>

      {/* Success Popup */}
      {success && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-sm">
          <div className="bg-black text-white text-center py-3 px-4 rounded-xl shadow-md animate-fadeIn">
            ✅ Application submitted successfully!
          </div>
        </div>
      )}
    </div>
  );
}
