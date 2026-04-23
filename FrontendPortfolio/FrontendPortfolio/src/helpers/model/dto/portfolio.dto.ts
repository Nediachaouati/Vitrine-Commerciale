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
  sectionType: 'experience' | 'skill' | 'certification' | null;
  extractedData: any | null;
  isComplete: boolean;
}

export interface GeneratePortfolioDto {
  collaboratorId: number;
  theme: string;
  language: string;
}

export interface CreateExperienceDto {
  companyName: string;
  jobTitle: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  location?: string;
  technologies?: string;
}

export interface AddSkillDto {
  skillId: number;
  level: string;
  yearsUsed: number;
  isPrimary: boolean;
}

export interface CreateCertificationDto {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialUrl?: string;
  badgeUrl?: string;
  score: number;
}