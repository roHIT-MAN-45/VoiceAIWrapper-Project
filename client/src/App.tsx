import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_PROJECTS_WITH_TASKS } from "./graphql/projects";
import ProjectSidebar from "./components/project-sidebar";
import TaskList from "./components/task-list";
import CreateProjectModal from "./components/create-project-modal";
import type { Project } from "./types";

// main app component
const App = () => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data, loading, error } = useQuery(GET_PROJECTS_WITH_TASKS);

  const projects = (data?.projects ?? []) as Project[];
  const activeProject = projects.find(
    (project) => project.id === activeProjectId
  );

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "ON_HOLD":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col overflow-hidden">
      {/* header */}
      <header className="h-16 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="toggle sidebar"
          >
            <svg
              className="w-6 h-6 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Project Manager
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Organize and track your projects
              </p>
            </div>
          </div>
        </div>
        {activeProject && (
          <div className="hidden sm:flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                activeProject.status
              )}`}
            >
              {activeProject.status.replace("_", " ")}
            </span>
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 top-16 lg:top-0 w-72 bg-white/95 backdrop-blur-lg border-r border-slate-200 shadow-lg lg:shadow-none z-30 transition-transform duration-300 ease-in-out overflow-y-auto`}
        >
          <div className="p-4 sm:p-6">
            <ProjectSidebar
              activeProjectId={activeProjectId}
              onSelect={setActiveProjectId}
              onCreate={() => setShowCreateProject(true)}
            />
          </div>
        </aside>

        {/* sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-20 top-16"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            {loading && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
                  <p className="text-slate-600 font-medium">Loading projects...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
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
                    <h3 className="text-red-800 font-semibold mb-1">
                      Failed to load data
                    </h3>
                    <p className="text-red-700 text-sm">{error.message}</p>
                  </div>
                </div>
              </div>
            )}

            {!activeProjectId && !loading && !error && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-indigo-600"
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
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Welcome to Project Manager
                  </h2>
                  <p className="text-slate-600 mb-6">
                    Select a project from the sidebar to get started, or create a
                    new one to begin organizing your work.
                  </p>
                  <button
                    onClick={() => setShowCreateProject(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
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
                    Create Your First Project
                  </button>
                </div>
              </div>
            )}

            {activeProject && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        {activeProject.name}
                      </h2>
                      {activeProject.description && (
                        <p className="text-slate-600 max-w-2xl">
                          {activeProject.description}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold border self-start sm:self-auto ${getStatusColor(
                        activeProject.status
                      )}`}
                    >
                      {activeProject.status.replace("_", " ")}
                    </span>
                  </div>
                  {activeProject.dueDate && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        Due: {new Date(activeProject.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <TaskList
                tasks={activeProject.tasks ?? []}
                projectId={activeProject.id}
              />
              </div>
            )}
          </div>
        </main>
      </div>

      <CreateProjectModal
        open={showCreateProject}
        onClose={() => setShowCreateProject(false)}
      />
    </div>
  );
};

export default App;
