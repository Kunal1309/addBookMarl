"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

interface Props {
  userId: string;
}

export default function AddBookmarkForm({ userId }: Props) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const isValidUrl = (value: string) => {
    try {
      const u = new URL(value.startsWith("http") ? value : `https://${value}`);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const normalizeUrl = (value: string) => {
    if (!value.startsWith("http://") && !value.startsWith("https://")) {
      return `https://${value}`;
    }
    return value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUrl = url.trim();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Please enter a title.");
      return;
    }

    if (!trimmedUrl) {
      setError("Please enter a URL.");
      return;
    }

    const normalizedUrl = normalizeUrl(trimmedUrl);

    if (!isValidUrl(normalizedUrl)) {
      setError("Please enter a valid URL (e.g. https://example.com)");
      return;
    }

    setIsLoading(true);

    const { error: insertError } = await supabase.from("bookmarks").insert({
      user_id: userId,
      title: trimmedTitle,
      url: normalizedUrl,
    });

    setIsLoading(false);

    if (insertError) {
      setError("Failed to save bookmark. Please try again.");
      console.error(insertError);
      return;
    }

    // Clear form on success
    setTitle("");
    setUrl("");
  };

  return (
    <div className="rounded-xl bg-[#111118] border border-[#1e1e2e] p-5">
      <h2 className="text-sm font-semibold text-[#9ca3af] uppercase tracking-wider mb-4">
        Add Bookmark
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label htmlFor="title" className="sr-only">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Title (e.g. GitHub)"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0f] border border-[#2a2a3e] text-white placeholder-[#4b5563] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 disabled:opacity-50"
            />
          </div>
          <div className="flex-[2]">
            <label htmlFor="url" className="sr-only">
              URL
            </label>
            <input
              id="url"
              type="text"
              placeholder="URL (e.g. https://github.com)"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0a0a0f] border border-[#2a2a3e] text-white placeholder-[#4b5563] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Save
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-xs animate-slide-in">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}