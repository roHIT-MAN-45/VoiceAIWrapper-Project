import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_PROJECT, GET_PROJECTS, GET_PROJECTS_WITH_TASKS } from "../graphql/projects";
import Modal from "./ui/modal";

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

// modal component for creating a new project
const CreateProjectModal = ({ open, onClose }: CreateProjectModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [createProject, { loading, error }] = useMutation(CREATE_PROJECT, {
    refetchQueries: [
      { query: GET_PROJECTS },
      { query: GET_PROJECTS_WITH_TASKS },
    ],
    onCompleted: () => {
      setName("");
      setDescription("");
      onClose();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createProject({
        variables: {
          name: name.trim(),
          description: description.trim(),
          status: "ACTIVE",
        },
      });
    } catch (err) {
      console.error("failed to create project:", err);
    }
  };

  return (
    <Modal open={open} title="Create New Project" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
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
                  Failed to create project
                </p>
                <p className="text-xs text-red-700 mt-1">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="Enter project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Description
            <span className="text-xs font-normal text-slate-500 ml-2">
              (optional)
            </span>
          </label>
          <textarea
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
            placeholder="Describe your project..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Creating...</span>
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Create Project</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
