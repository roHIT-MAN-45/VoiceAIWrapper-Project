import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_TASK_COMMENTS, ADD_TASK_COMMENT } from "../graphql/tasks";

export default function TaskComments({ taskId }: { taskId: string }) {
  const [content, setContent] = useState("");

  const { data } = useQuery(GET_TASK_COMMENTS, {
    variables: { taskId },
  });

  const [addComment] = useMutation(ADD_TASK_COMMENT, {
    refetchQueries: [{ query: GET_TASK_COMMENTS, variables: { taskId } }],
  });

  return (
    <div className="mt-3 border-t pt-3 space-y-2">
      <h4 className="text-sm font-medium">Comments</h4>

      {data?.taskComments?.map((c: any) => (
        <div key={c.id} className="text-xs bg-gray-100 p-2 rounded">
          <p>{c.content}</p>
          <span className="text-gray-500">{c.authorEmail}</span>
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addComment({
            variables: {
              taskId,
              content,
              authorEmail: "user@example.com",
            },
          });
          setContent("");
        }}
        className="flex gap-2"
      >
        <input
          className="flex-1 border rounded p-1 text-xs"
          placeholder="Add comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button className="text-xs bg-gray-200 px-2 rounded">Send</button>
      </form>
    </div>
  );
}
