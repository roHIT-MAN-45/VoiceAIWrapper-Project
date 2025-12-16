import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_TASK } from "../graphql/tasks";

interface Props {
  taskId: string;
  title: string;
  description?: string;
}

export default function EditTaskInline({ taskId, title, description }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description || "");

  const [updateTask, { loading }] = useMutation(UPDATE_TASK);

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-xs text-blue-600 hover:underline"
      >
        Edit
      </button>
    );
  }

  return (
    <div className="space-y-2 mt-2">
      <input
        className="w-full border rounded p-2 text-sm"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />

      <textarea
        className="w-full border rounded p-2 text-sm"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
      />

      <div className="flex gap-2">
        <button
          disabled={loading}
          onClick={() => {
            updateTask({
              variables: {
                taskId,
                title: newTitle,
                description: newDescription,
              },
            });
            setIsEditing(false);
          }}
          className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
        >
          Save
        </button>

        <button
          onClick={() => setIsEditing(false)}
          className="text-xs text-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
