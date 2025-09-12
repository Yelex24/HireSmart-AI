"use client";

import { Button } from "@/components/ui/button";
import { ClipboardIcon } from "lucide-react";
import { useState } from "react";

interface CopyLinkProps {
  link: string;
}

export default function CopyLink({ link }: CopyLinkProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-center items-center space-x-2 mb-10">
      <input
        type="text"
        readOnly
        value={link}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button onClick={copyToClipboard} className="flex items-center gap-2">
        <ClipboardIcon className="h-4 w-4" />
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  );
}
