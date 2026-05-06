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
  city?: string;
  phone?: string;
  githubUrl?: string;
  availabilityStatus?: string;
  availabilityDate?: string; 
  isPublic?: boolean;

  // Champs Manager
  department?: string;

  company_name?: string;
}