import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_TASK } from "../graphql/tasks";
import { GET_PROJECTS_WITH_TASKS } from "../graphql/projects";
import Modal from "./ui/modal";
import type { Task, TaskStatus } from "../types";

interface EditTaskModalProps {
  task: Task;
  open: boolean;
  onClose: () => void;
}

// modal component for editing task details
const EditTaskModal = ({ task, open, onClose }: EditTaskModalProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [status, setStatus] = useState<TaskStatus>(task.status);

  const [updateTask, { loading, error }] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: GET_PROJECTS_WITH_TASKS }],
    onCompleted: () => {
      onClose();
    },
  });

  // reset form when task changes
  useEffect(() => {
    if (open) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setStatus(task.status);
    }
  }, [task, open]);

  const handleSave = async () => {
    try {
      await updateTask({
        variables: {
          taskId: task.id,
          title: title.trim(),
          description: description.trim(),
          status,
        },
      });
    } catch (err) {
      console.error("failed to update task:", err);
    }
  };

  const getStatusOptions = () => [
    { value: "TODO", label: "To Do", color: "text-slate-700" },
    { value: "IN_PROGRESS", label: "In Progress", color: "text-indigo-700" },
    { value: "DONE", label: "Done", color: "text-emerald-700" },
  ];

  return (
    <Modal open={open} title="Edit Task" onClose={onClose}>
      <div className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800">
                  Failed to update task
                </p>
                <p className="text-xs text-red-700 mt-1">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Description
          </label>
          <textarea
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add task description..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Status
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            {getStatusOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>

          <button
            disabled={loading || !title.trim()}
            onClick={handleSave}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Saving...</span>
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditTaskModal;
