import { gql } from "@apollo/client";

// fetch comments for a task
export const GET_TASK_COMMENTS = gql`
  query getTaskComments($taskId: ID!) {
    taskComments(taskId: $taskId) {
      id
      content
      authorEmail
      createdAt
    }
  }
`;

// add comment to a task
export const ADD_TASK_COMMENT = gql`
  mutation addTaskComment(
    $taskId: ID!
    $content: String!
    $authorEmail: String!
  ) {
    addTaskComment(
      taskId: $taskId
      content: $content
      authorEmail: $authorEmail
    ) {
      comment {
        id
        content
        authorEmail
        createdAt
      }
    }
  }
`;

// create new task
export const CREATE_TASK = gql`
  mutation createTask(
    $projectId: ID!
    $title: String!
    $description: String
    $status: String!
    $assigneeEmail: String
  ) {
    createTask(
      projectId: $projectId
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
    ) {
      task {
        id
        title
        description
        status
      }
    }
  }
`;

// update existing task
export const UPDATE_TASK = gql`
  mutation updateTask(
    $taskId: ID!
    $title: String
    $description: String
    $status: String
    $assigneeEmail: String
  ) {
    updateTask(
      taskId: $taskId
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
    ) {
      task {
        id
        title
        description
        status
      }
    }
  }
`;
