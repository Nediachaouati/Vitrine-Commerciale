export type Guid = string;

export interface KcUser {
  id:        string;
  username?: string;
  email?:    string;
  firstName?: string;
  lastName?:  string;
  roles:     string[];
}

export interface User {
  userId:    Guid;
  email:     string;
  firstName: string;
  lastName:  string;
  avatarUrl?: string;
  isActive:  boolean;
  role:      string;
  createdAt: string;
}

export interface Collaborator {
  collaboratorId:     number;
  jobTitle:           string;
  bio:                string;
  yearsExperience:    number;
  availabilityStatus: string;
  availabilityDate?:  string;
  globalScore:        number;
  linkedinUrl?:       string;
  githubUrl?:         string;
  isPublic:           boolean;
  userId:             Guid;
}

export interface Manager {
  managerId:           number;
  department?:         string;
  managedProfilesCount: number;
  createdAt:           string;
  userId:              Guid;
}