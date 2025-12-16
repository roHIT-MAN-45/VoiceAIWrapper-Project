import { useQuery, useMutation } from "@apollo/client/react";
import { GET_TASKS, UPDATE_TASK_STATUS } from "../graphql/tasks";
import CreateTaskForm from "./create-task-form";
import TaskComments from "./task-comments";
import type { Task } from "../types";
import EditTaskInline from "./edit-task-inline";

export default function TaskList({ projectId }: { projectId: string }) {
  const { data, loading } = useQuery(GET_TASKS, {
    variables: { projectId },
    skip: !projectId,
  });

  const [updateStatus] = useMutation(UPDATE_TASK_STATUS);

  if (!projectId)
    return <div className="bg-white p-6 rounded">Select a project</div>;

  if (loading)
    return <div className="bg-white p-6 rounded">Loading tasks...</div>;

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-lg font-semibold">Tasks</h2>

      <CreateTaskForm projectId={projectId} />

      {data.tasks.map((task: Task) => (
        <div key={task.id} className="border rounded p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{task.title}</h3>
            <EditTaskInline
              taskId={task.id}
              title={task.title}
              description={task.description}
            />

            <select
              value={task.status}
              onChange={(e) =>
                updateStatus({
                  variables: {
                    taskId: task.id,
                    status: e.target.value,
                  },
                })
              }
              className="border rounded text-xs px-2 py-1"
            >
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600">{task.description}</p>
          )}

          <TaskComments taskId={task.id} />
        </div>
      ))}
    </div>
  );
}
