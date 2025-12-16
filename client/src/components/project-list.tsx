import { useQuery } from "@apollo/client/react";
import { GET_PROJECTS } from "../graphql/projects";
import type { Project } from "../types";
import EditProjectInline from "./edit-project-inline";

interface Props {
  onSelectProject: (projectId: string) => void;
  selectedProjectId?: string;
}

export default function ProjectList({
  onSelectProject,
  selectedProjectId,
}: Props) {
  const { data, loading, error } = useQuery(GET_PROJECTS);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-red-500">Failed to load projects</p>
      </div>
    );
  }

  if (data.projects.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">No projects yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-lg font-semibold">Projects</h2>

      <ul className="space-y-3">
        {data.projects.map((project: Project) => (
          <li
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={`border rounded p-4 cursor-pointer transition ${
              selectedProjectId === project.id
                ? "border-blue-500 bg-blue-50"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{project.name}</h3>

              <EditProjectInline project={project} />

              <span
                className={`text-xs px-2 py-1 rounded ${
                  project.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : project.status === "COMPLETED"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {project.status}
              </span>
            </div>

            {project.description && (
              <p className="text-sm text-gray-600 mt-1">
                {project.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
