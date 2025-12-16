import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_PROJECT } from "../graphql/projects";

interface Props {
  project: {
    id: string;
    name: string;
    description?: string | null;
    status: string;
  };
}

export default function EditProjectInline({ project }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [status, setStatus] = useState(project.status);

  const [updateProject, { loading }] = useMutation(UPDATE_PROJECT);

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-xs text-blue-600 hover:underline"
      >
        Edit
      </button>
    );
  }

  return (
    <div className="mt-2 space-y-2">
      <input
        className="w-full border rounded p-2 text-sm"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        className="w-full border rounded p-2 text-sm"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        className="w-full border rounded p-2 text-sm"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="ACTIVE">Active</option>
        <option value="COMPLETED">Completed</option>
        <option value="ON_HOLD">On Hold</option>
      </select>

      <div className="flex gap-2">
        <button
          disabled={loading}
          onClick={() => {
            updateProject({
              variables: {
                projectId: project.id,
                name,
                description,
                status,
              },
            });
            setEditing(false);
          }}
          className="bg-blue-600 text-white text-xs px-3 py-1 rounded"
        >
          Save
        </button>

        <button
          onClick={() => setEditing(false)}
          className="text-xs text-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
