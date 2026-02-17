"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import type { Bookmark } from "@/types/bookmark";
import AddBookmarkForm from "./AddBookmarkForm";
import BookmarkCard from "./BookmarkCard";

interface Props {
  user: User;
  initialBookmarks: Bookmark[];
}

export default function BookmarkDashboard({ user, initialBookmarks }: Props) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleDelete = useCallback(async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting bookmark:", error);
    }
    // Realtime will handle UI update
  }, [supabase, user.id]);

  useEffect(() => {
    // Subscribe to realtime changes scoped to this user's bookmarks
    const channel = supabase
      .channel("bookmarks-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setBookmarks((prev) => {
            // Avoid duplicates
            if (prev.find((b) => b.id === payload.new.id)) return prev;
            return [payload.new as Bookmark, ...prev];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setBookmarks((prev) =>
            prev.filter((b) => b.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user.id]);

  const avatarUrl = user.user_metadata?.avatar_url as string | undefined;
  const displayName = (user.user_metadata?.full_name as string) ?? user.email ?? "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-[#1e1e2e] bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-indigo-400">
                <path
                  d="M5 3H19C19.5523 3 20 3.44772 20 4V20.382C20 20.7607 19.786 21.107 19.4472 21.2764C19.1085 21.4458 18.7056 21.4124 18.4 21.2L12 16.6667L5.6 21.2C5.29439 21.4124 4.89151 21.4458 4.55279 21.2764C4.21407 21.107 4 20.7607 4 20.382V4C4 3.44772 4.44772 3 5 3Z"
                  fill="currentColor"
                  opacity="0.4"
                />
                <path
                  d="M5 3H19C19.5523 3 20 3.44772 20 4V20.382C20 20.7607 19.786 21.107 19.4472 21.2764C19.1085 21.4458 18.7056 21.4124 18.4 21.2L12 16.6667L5.6 21.2C5.29439 21.4124 4.89151 21.4458 4.55279 21.2764C4.21407 21.107 4 20.7607 4 20.382V4C4 3.44772 4.44772 3 5 3Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Markd</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-[#6b7280] truncate max-w-[160px]">
              {displayName}
            </span>
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-8 h-8 rounded-full ring-2 ring-[#2a2a3e]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white ring-2 ring-[#2a2a3e]">
                {initials}
              </div>
            )}
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#9ca3af] hover:text-white hover:bg-[#1e1e2e] border border-transparent hover:border-[#2a2a3e] disabled:opacity-50"
            >
              {isSigningOut ? (
                <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              )}
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Your Bookmarks</h1>
          <p className="text-[#6b7280] text-sm">
            {bookmarks.length === 0
              ? "No bookmarks yet — add your first one below."
              : `${bookmarks.length} bookmark${bookmarks.length === 1 ? "" : "s"} saved`}
          </p>
        </div>

        {/* Add bookmark form */}
        <AddBookmarkForm userId={user.id} />

        {/* Bookmarks list */}
        <div className="mt-8">
          {bookmarks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {bookmarks.map((bookmark, index) => (
                <div
                  key={bookmark.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms`, animationFillMode: "both" }}
                >
                  <BookmarkCard bookmark={bookmark} onDelete={handleDelete} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#1e1e2e] border border-[#2a2a3e] flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#4b5563]">
          <path
            d="M5 3H19C19.5523 3 20 3.44772 20 4V20.382C20 20.7607 19.786 21.107 19.4472 21.2764C19.1085 21.4458 18.7056 21.4124 18.4 21.2L12 16.6667L5.6 21.2C5.29439 21.4124 4.89151 21.4458 4.55279 21.2764C4.21407 21.107 4 20.7607 4 20.382V4C4 3.44772 4.44772 3 5 3Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-[#9ca3af] font-medium mb-1">Nothing saved yet</h3>
      <p className="text-[#4b5563] text-sm max-w-xs">
        Add your first bookmark using the form above. It will appear here instantly.
      </p>
    </div>
  );
}