// helpers/model/dto/collaborator.dto.ts

export interface AddSkillDto {
  skillId: number;
  level: string;
  yearsUsed: number;
  isPrimary: boolean;
}

export interface UpdateSkillDto {
  level?: string;
  yearsUsed?: number;
  isPrimary?: boolean;
}

export interface AddExperienceDto {
  companyName: string;
  jobTitle: string;
  description?: string;
  startDate: string; // "YYYY-MM-DD"
  endDate?: string | null;
  isCurrent: boolean;
  location?: string;
  technologies?: string;
  contractType?: string;
}

export interface UpdateExperienceDto {
  companyName?: string;
  jobTitle?: string;
  description?: string;
  startDate?: string;
  endDate?: string | null;
  isCurrent?: boolean;
  location?: string;
  technologies?: string;
  contractType?: string;
}

export interface AddEducationDto {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  grade?: string;
  description?: string;
}

export interface UpdateEducationDto {
  school?: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string | null;
  isCurrent?: boolean;
  grade?: string;
  description?: string;
}

export interface AddCertificationDto {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string | null;
  credentialUrl?: string;
  badgeUrl?: string;
  score?: number;
}

export interface UpdateCertificationDto {
  name?: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string | null;
  credentialUrl?: string;
  score?: number;
}

export interface AddProjectDto {
  title: string;
  description?: string;
  technologies?: string;
  projectUrl?: string;
  githubUrl?: string;
  screenshotUrl?: string;
  startDate?: string | null;
  endDate?: string | null;
  roleInProject?: string;
  isFeatured: boolean;
}

export interface UpdateProjectDto {
  title?: string;
  description?: string;
  technologies?: string;
  projectUrl?: string;
  githubUrl?: string;
  screenshotUrl?: string;
  startDate?: string | null;
  endDate?: string | null;
  roleInProject?: string;
  isFeatured?: boolean;
}

// Portfolio
export interface CreatePortfolioDto {
  title: string;
  description?: string;
  targetClient?: string;
  theme?: string;
  language?: string;
}

export interface UpdatePortfolioDto {
  title?: string;
  description?: string;
  targetClient?: string;
  theme?: string;
  language?: string;
  isActive?: boolean;
}

export interface PortfolioItemDto {
  id: number;
  isVisible: boolean;
  displayOrder: number;
}

export interface SetPortfolioItemsDto {
  items: PortfolioItemDto[];
}

// Chat
export interface ChatMessageDto {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequestDto {
  collaboratorId: number;
  messages: ChatMessageDto[];
}

export interface ChatResponseDto {
  message: string;
  isComplete: boolean;
  action?: {
    type: string;
    items: PortfolioItemDto[];
  } | null;
}

// Skill catalog
export interface SkillCatalogItem {
  skillId: number;
  name: string;
  category: string;
  iconUrl?: string;
}

// Collaborator full profile
export interface CollaboratorFull {
  collaboratorId: number;
  userId: string;
  jobTitle: string;
  bio?: string;
  yearsExperience: number;
  availabilityStatus: string;
  availabilityDate?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  city?: string;
  country?: string;
  phone?: string;
  contractType?: string;
  remotePreference?: string;
  isPublic: boolean;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
  collaboratorSkills: CollaboratorSkillItem[];
  experiences: ExperienceItem[];
  educations: EducationItem[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  portfolios: PortfolioItem[];
}

export interface CollaboratorSkillItem {
  collabSkillId: number;
  skillId: number;
  level: string;
  yearsUsed: number;
  isPrimary: boolean;
  skill: { skillId: number; name: string; category: string; iconUrl?: string };
}

export interface ExperienceItem {
  experienceId: number;
  companyName: string;
  jobTitle: string;
  description?: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  location?: string;
  technologies?: string;
  contractType?: string;
}

export interface EducationItem {
  educationId: number;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  grade?: string;
  description?: string;
}

export interface CertificationItem {
  certificationId: number;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string | null;
  credentialUrl?: string;
  badgeUrl?: string;
  score?: number;
}

export interface ProjectItem {
  projectId: number;
  title: string;
  description?: string;
  technologies?: string;
  projectUrl?: string;
  githubUrl?: string;
  screenshotUrl?: string;
  startDate?: string | null;
  endDate?: string | null;
  roleInProject?: string;
  isFeatured: boolean;
}

export interface PortfolioItem {
  portfolioId: number;
  title: string;
  description?: string;
  theme: string;
  language: string;
  isActive: boolean;
  publicSlug: string;
  targetClient?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  portfolioSkills?: any[];
  portfolioExperiences?: any[];
  portfolioEducations?: any[];
  portfolioCertifications?: any[];
  portfolioProjects?: any[];
}