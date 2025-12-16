import { useState } from "react";
import EditTaskModal from "./edit-task-modal";
import TaskComments from "./task-comments";
import type { Task } from "../types";

interface TaskItemProps {
  task: Task;
}

// single task card component
const TaskItem = ({ task }: TaskItemProps) => {
  const [showEdit, setShowEdit] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case "TODO":
        return {
          color: "bg-slate-100 text-slate-700 border-slate-200",
          icon: (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        };
      case "IN_PROGRESS":
        return {
          color: "bg-indigo-100 text-indigo-700 border-indigo-200",
          icon: (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
        };
      case "DONE":
        return {
          color: "bg-emerald-100 text-emerald-700 border-emerald-200",
          icon: (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: null,
        };
    }
  };

  const statusConfig = getStatusConfig(task.status);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-2">
              <div className="flex-shrink-0 mt-1">
                <div className={`w-8 h-8 rounded-lg ${statusConfig.color} flex items-center justify-center border`}>
                  {statusConfig.icon}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {task.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap mt-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
              >
                {statusConfig.icon}
                <span className="capitalize">
                  {task.status.replace("_", " ").toLowerCase()}
                </span>
              </span>
              {task.assigneeEmail && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="truncate max-w-[120px]">{task.assigneeEmail}</span>
                </div>
              )}
              {task.dueDate && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowEdit(true)}
            className="flex-shrink-0 p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            aria-label="edit task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>

        <div className="border-t border-slate-200/50 pt-4 -mx-5 px-5">
          <TaskComments taskId={task.id} />
        </div>
      </div>

      <EditTaskModal
        task={task}
        open={showEdit}
        onClose={() => setShowEdit(false)}
      />
    </div>
  );
};

export default TaskItem;
