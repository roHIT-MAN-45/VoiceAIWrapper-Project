import { gql } from "@apollo/client";

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      description
      status
      dueDate
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $name: String!
    $description: String
    $status: String!
    $dueDate: Date
  ) {
    createProject(
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      project {
        id
        name
        status
        description
        dueDate
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $projectId: ID!
    $name: String
    $description: String
    $status: String
  ) {
    updateProject(
      projectId: $projectId
      name: $name
      description: $description
      status: $status
    ) {
      project {
        id
        name
        description
        status
      }
    }
  }
`;
