"use client";

import { useState } from "react";
import type { Bookmark } from "@/types/bookmark";

interface Props {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).origin;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return "";
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export default function BookmarkCard({ bookmark, onDelete }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const domain = getDomain(bookmark.url);
  const faviconUrl = getFaviconUrl(bookmark.url);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    await onDelete(bookmark.id);
    // Component will be removed from the list by parent via realtime
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div
      className={`group relative flex items-start gap-4 p-4 rounded-xl bg-[#111118] border transition-all ${
        isDeleting
          ? "border-red-500/20 opacity-50 scale-95"
          : "border-[#1e1e2e] hover:border-[#2a2a3e] hover:bg-[#13131b]"
      }`}
    >
      {/* Favicon */}
      <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-[#1e1e2e] border border-[#2a2a3e] flex items-center justify-center overflow-hidden">
        {!faviconError && faviconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={faviconUrl}
            alt=""
            width={16}
            height={16}
            onError={() => setFaviconError(true)}
            className="w-4 h-4 object-contain"
          />
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#4b5563]">
            <path
              d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block group/link"
        >
          <h3 className="text-sm font-semibold text-white group-hover/link:text-indigo-300 truncate transition-colors">
            {bookmark.title}
          </h3>
          <p className="text-xs text-[#6b7280] truncate mt-0.5 group-hover/link:text-[#9ca3af] transition-colors">
            {domain}
          </p>
        </a>
      </div>

      {/* Time + Actions */}
      <div className="flex-shrink-0 flex items-center gap-2">
        <span className="text-xs text-[#4b5563] tabular-nums">
          {formatDate(bookmark.created_at)}
        </span>

        {!showConfirm ? (
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            title="Delete bookmark"
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#4b5563] hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        ) : (
          <div className="flex items-center gap-1 animate-slide-in">
            <span className="text-xs text-[#9ca3af] hidden sm:block">Delete?</span>
            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20 font-medium disabled:opacity-50"
            >
              Yes
            </button>
            <button
              onClick={handleCancelDelete}
              className="px-2 py-1 rounded text-xs bg-[#1e1e2e] text-[#9ca3af] hover:bg-[#2a2a3e] border border-[#2a2a3e]"
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  );
}