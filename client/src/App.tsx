import { useState } from "react";
import ProjectList from "./components/project-list";
import TaskList from "./components/task-list";
import CreateProjectForm from "./components/create-project-form";

export default function App() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-bold">Project Management</h1>
      </header>

      <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <CreateProjectForm />
          <ProjectList
            onSelectProject={setSelectedProjectId}
            selectedProjectId={selectedProjectId ?? undefined}
          />
        </div>

        <div className="md:col-span-2">
          <TaskList projectId={selectedProjectId ?? ""} />
        </div>
      </main>
    </div>
  );
}
