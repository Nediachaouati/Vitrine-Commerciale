// src/helpers/model/dto/update-profile.dto.ts
export interface UpdateProfileDto {
  // Champs communs
  firstName?: string;
  lastName?: string;
  email?: string;
  newPassword?: string;
  // Champs Collaborator
  jobTitle?: string;
  bio?: string;
  yearsExperience?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  availabilityStatus?: string;
  availabilityDate?: string; // DateOnly → string en JSON
  isPublic?: boolean;

  // Champs Manager
  department?: string;
}