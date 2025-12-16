import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_TASK_COMMENTS, ADD_TASK_COMMENT } from "../graphql/tasks";
import type { TaskComment } from "../types";

interface TaskCommentsProps {
  taskId: string;
}

// format timestamp to readable date
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// task comments section component
const TaskComments = ({ taskId }: TaskCommentsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");

  const { data, loading, error } = useQuery(GET_TASK_COMMENTS, {
    variables: { taskId },
  });

  const [addComment, { loading: submitting }] = useMutation(ADD_TASK_COMMENT, {
    refetchQueries: [{ query: GET_TASK_COMMENTS, variables: { taskId } }],
    onCompleted: () => {
      setContent("");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || !authorEmail.trim()) {
      return;
    }

    try {
      await addComment({
        variables: {
          taskId,
          content: content.trim(),
          authorEmail: authorEmail.trim(),
        },
      });
    } catch (err) {
      console.error("failed to add comment:", err);
    }
  };

  const comments = (data?.taskComments ?? []) as TaskComment[];

  return (
    <div className="space-y-0">
      {/* collapsible header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 -mx-3 mx-0 rounded-lg hover:bg-slate-50/50 active:bg-slate-100 transition-all duration-200 group"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Collapse comments" : "Expand comments"}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center transition-all duration-300 ${
                isOpen
                  ? "rotate-180 bg-gradient-to-br from-indigo-100 to-purple-100"
                  : ""
              }`}
            >
              <svg
                className="w-4 h-4 text-indigo-600 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div className="text-left">
              <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                Comments
              </h4>
              {comments.length > 0 && (
                <p className="text-xs text-slate-500 mt-0.5">
                  {comments.length}{" "}
                  {comments.length === 1 ? "comment" : "comments"}
                </p>
              )}
            </div>
          </div>
        </div>
        {comments.length > 0 && (
          <div className="flex items-center gap-2">
            <div
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                isOpen
                  ? "bg-emerald-500 scale-100"
                  : "bg-slate-300 scale-75 group-hover:bg-slate-400"
              }`}
            />
            <span className="text-xs font-medium text-slate-600">
              {comments.length}
            </span>
          </div>
        )}
      </button>

      {/* collapsible content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pt-3 space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-200 border-t-indigo-600"></div>
                <p className="text-xs text-slate-500 font-medium">
                  Loading comments...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50/50 border border-red-200/50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-3 h-3 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-800 mb-1">
                    Failed to load comments
                  </p>
                  <p className="text-xs text-red-600">{error.message}</p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && comments.length === 0 && (
            <div className="text-center py-10 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200/50">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-1">
                No comments yet
              </p>
              <p className="text-xs text-slate-500">
                Be the first to share your thoughts
              </p>
            </div>
          )}

          {comments.length > 0 && (
            <div className="max-h-72 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {comments.map((comment, index) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-indigo-200/50"
                  style={{
                    animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
                  }}
                >
                  <p className="text-sm text-slate-800 leading-relaxed mb-4">
                    {comment.content}
                  </p>
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200/50">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ring-2 ring-white">
                        <span className="text-xs font-bold text-white">
                          {comment.authorEmail.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-700 truncate">
                          {comment.authorEmail}
                        </p>
                      </div>
                    </div>
                    {comment.createdAt && (
                      <div className="flex items-center gap-1.5 flex-shrink-0 px-2 py-1 bg-slate-50 rounded-lg">
                        <svg
                          className="w-3.5 h-3.5 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                          {formatTimestamp(comment.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* comment form */}
          <form
            onSubmit={handleSubmit}
            className="pt-4 mt-4 border-t border-slate-200/50 space-y-3"
          >
            <div className="space-y-3">
              {/* email input - compact */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Email
                </label>
                <div className="p-0.5">
                  <input
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white placeholder:text-slate-400"
                    placeholder="you@example.com"
                    type="email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* comment input - larger, textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Add Your Comment
                </label>
                <div className="p-0.5 flex gap-2">
                  <textarea
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white resize-none min-h-[80px] placeholder:text-slate-400"
                    placeholder="Share your thoughts..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={3}
                    required
                  />
                  <button
                    type="submit"
                    disabled={
                      submitting || !content.trim() || !authorEmail.trim()
                    }
                    className="self-end px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 whitespace-nowrap h-fit"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span className="hidden sm:inline">Posting...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                        <span className="hidden sm:inline">Post</span>
                        <span className="sm:hidden">Send</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskComments;
