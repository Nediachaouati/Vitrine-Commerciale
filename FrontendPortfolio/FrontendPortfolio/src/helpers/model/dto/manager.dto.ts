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
  availabilityRequired?: string; // "available" | "soon" | "any"
  requiredCertifications?: string[];
  contractType?: string; // "CDI" | "freelance" | "stage"
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