export interface CollaboratorSummaryDto {
  collaboratorId: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  jobTitle: string;
  bio: string;
  yearsExperience: number;
  availabilityStatus: string;
  availabilityDate?: string;
  isPublic: boolean;
  badges: string[];
  primarySkills: string[];
  portfolioCount: number;
  viewCount: number;
 publicSlug?: string;
}

export interface CreateClientNeedDto {
  title: string;
  description: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  minYearsExperience?: number;
  availabilityRequired?: string; 
  requiredCertifications?: string[];
  contractType?: string; 
  clientId?: number;
}

export interface ClientNeedResponseDto {
  needId: number;
  managerId: number;
  clientId?: number;
  title: string;
  description: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  minYearsExperience?: number;
  availabilityRequired?: string;
  requiredCertifications?: string[];
  contractType?: string;
  status: string;
  createdAt: string;
}

export interface MatchCriterionDto {
  criterion: string;
  status: 'matched' | 'partial' | 'missing';
  detail: string;
}

export interface MatchBreakdownDto {
  skillScore: number;
  experienceScore: number;
  certificationScore: number;
  availabilityScore: number;
  details: MatchCriterionDto[];
}

export interface MatchedCollaboratorDto {
  collaboratorId: number;
  portfolioId: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  jobTitle: string;
  yearsExperience: number;
  availabilityStatus: string;
  matchScore: number;
  breakdown: MatchBreakdownDto;
  badges: string[];
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  publicSlug?: string;
}

export interface PortfolioFilterDto {
  search?: string;
  skills?: string[];
  availabilityStatus?: string;
  minYearsExperience?: number;
  maxYearsExperience?: number;
  theme?: string;
  language?: string;
  sortBy?: string;
  sortDir?: string;
}

export interface PortfolioListItemDto {
  portfolioId: number;
  switchedViewId?: number | null;
  title: string;
  description?: string;
  publicSlug: string;
  theme: string;
  language: string;
  isActive: boolean;
  viewCount: number;
  createdAt: string;
  collaborator: CollaboratorSummaryDto;
}

export interface ImprovementSuggestionDto {
  collaboratorId: number;
  collaboratorName: string;
  suggestions: string[];
  currentMatchScore: number;
  potentialMatchScore: number;
}

// Tech Switch DTOs 
 
export interface BatchSwitchRequestDto {
  portfolioIds: number[];
  targetTech: string;
  missionContext?: string;
}
 
export interface BatchSwitchResultItemDto {
  portfolioId: number;
  collaboratorId: number;
  collaboratorName: string;
  originalJobTitle: string;   
  targetTech: string;
  generatedTitle: string;
  generatedBio: string;
  transferableSkills: string[];
  relevanceScore: number;      
  publicShareSlug: string;     
  switchedViewId: number | null;
  status: 'success' | 'error';
}
 
export interface BatchSwitchResponseDto {
  targetTech: string;
  missionContext?: string;
  total: number;
  successCount: number;
  errorCount: number;
  results: BatchSwitchResultItemDto[];
}
 
export interface SwitchedViewSummaryDto {
  viewId: number;
  portfolioId: number;
  
  targetTech: string;
  generatedTitle: string;
  generatedBio: string;
  missionContext?: string;
  status: string;
  updatedAt: string;
  collaboratorName: string;
  originalTitle: string;
  publicSlug?: string;          // slug original du portfolio collab
  transferableSkills: string[];
  relevanceScore?: number;      // ✅ NOUVEAU
  publicShareSlug?: string;     // ✅ NOUVEAU — lien à partager au client
}
 
// ── Vue publique (ce que le CLIENT voit) ───────────────────────────
export interface PublicPortfolioViewDto {
  targetTech: string;
  generatedTitle: string;
  generatedBio: string;
  missionContext?: string;
  relevanceScore?: number;
  collaborator: CollaboratorPublicInfoDto;
  projects: PublicProjectDto[];
  skills: PublicSkillDto[];
  experiences: PublicExperienceDto[];
  certifications: PublicCertificationDto[];
}
 
export interface CollaboratorPublicInfoDto {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  jobTitle: string;
  yearsExperience: number;
  availabilityStatus: string;
  linkedinUrl?: string;
  githubUrl?: string;
}
 
export interface PublicProjectDto {
  projectId: number;
  title: string;
  description?: string;
  technologies?: string;
  projectUrl?: string;
  screenshotUrl?: string;
  relevanceOrder: number;
}
 
export interface PublicSkillDto {
  collabSkillId: number;
  name: string;
  level: string;
  yearsUsed: number;
  isPrimary: boolean;
  relevanceOrder: number;
}
 
export interface PublicExperienceDto {
  experienceId: number;
  companyName: string;
  jobTitle: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  relevanceOrder: number;
}
 
export interface PublicCertificationDto {
  certificationId: number;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  relevanceOrder: number;
}
 