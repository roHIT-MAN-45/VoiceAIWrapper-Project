import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_TASK, GET_TASKS } from "../graphql/tasks";

export default function CreateTaskForm({ projectId }: { projectId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeEmail, setAssigneeEmail] = useState("");

  const [createTask, { loading }] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_TASKS, variables: { projectId } }],
  });

  if (!projectId) return null;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createTask({
          variables: {
            projectId,
            title,
            description,
            assigneeEmail,
            status: "TODO",
          },
        });
        setTitle("");
        setDescription("");
        setAssigneeEmail("");
      }}
      className="border rounded p-4 space-y-3"
    >
      <h3 className="font-semibold">Add Task</h3>

      <input
        className="w-full border rounded p-2"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        className="w-full border rounded p-2"
        placeholder="Assignee email"
        value={assigneeEmail}
        onChange={(e) => setAssigneeEmail(e.target.value)}
      />

      <textarea
        className="w-full border rounded p-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        disabled={loading}
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Add
      </button>
    </form>
  );
}
