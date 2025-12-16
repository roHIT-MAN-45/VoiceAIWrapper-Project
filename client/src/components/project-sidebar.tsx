import { useQuery } from "@apollo/client/react";
import { GET_PROJECTS } from "../graphql/projects";
import type { Project } from "../types";

interface ProjectSidebarProps {
  activeProjectId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
}

// sidebar component displaying project list
const ProjectSidebar = ({
  activeProjectId,
  onSelect,
  onCreate,
}: ProjectSidebarProps) => {
  const { data, loading, error } = useQuery(GET_PROJECTS);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "bg-emerald-500";
      case "COMPLETED":
        return "bg-blue-500";
      case "ON_HOLD":
        return "bg-amber-500";
      default:
        return "bg-slate-400";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-11 bg-slate-200 rounded-xl animate-pulse"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-slate-200 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-sm text-red-700 font-medium">
          Failed to load projects
        </p>
      </div>
    );
  }

  const projects = (data?.projects ?? []) as Project[];

  return (
    <div className="space-y-6">
      <button
        onClick={onCreate}
        className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 px-4 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <svg
          className="w-5 h-5"
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
        <span>New Project</span>
      </button>

      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
          Your Projects
        </h3>
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-slate-500 mb-4">No projects yet</p>
            <button
              onClick={onCreate}
              className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
            >
              Create one now →
            </button>
          </div>
        ) : (
          <ul className="space-y-2">
            {projects.map((project, index) => {
              const isActive = project.id === activeProjectId;

              return (
                <li
                  key={project.id}
                  onClick={() => onSelect(project.id)}
                  className={`group cursor-pointer rounded-xl p-4 transition-all duration-200 animate-slide-in ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-md"
                      : "bg-slate-50 hover:bg-slate-100 border-2 border-transparent hover:border-slate-200"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(
                            project.status
                          )}`}
                        ></div>
                        <p
                          className={`text-sm font-semibold truncate ${
                            isActive ? "text-indigo-900" : "text-slate-900"
                          }`}
                        >
                          {project.name}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 capitalize">
                        {project.status.replace("_", " ").toLowerCase()}
                      </p>
                    </div>
                    {isActive && (
                      <svg
                        className="w-5 h-5 text-indigo-600 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProjectSidebar;
