import { gql } from "@apollo/client";

// fetch project list for sidebar
export const GET_PROJECTS = gql`
  query getProjects {
    projects {
      id
      name
      status
    }
  }
`;

// fetch all projects with tasks
export const GET_PROJECTS_WITH_TASKS = gql`
  query getProjectsWithTasks {
    projects {
      id
      name
      status
      tasks {
        id
        title
        description
        status
      }
    }
  }
`;

// create new project
export const CREATE_PROJECT = gql`
  mutation createProject(
    $name: String!
    $description: String
    $status: String!
  ) {
    createProject(name: $name, description: $description, status: $status) {
      project {
      id
        name
        status
      }
    }
  }
`;

// update existing project
export const UPDATE_PROJECT = gql`
  mutation updateProject(
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
        status
      }
    }
  }
`;
