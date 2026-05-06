export interface ShortlistItemInputDto {
  portfolioId: number;
  
  displayOrder: number;
  managerNote?: string;
  switchedViewId?: number | null;
}

export interface CreateShortlistDto {
  title: string;
  description?: string;
  clientId?: number;
  expiresAt?: string;
  items: ShortlistItemInputDto[];
}

export interface UpdateShortlistDto {
  title?: string;
  description?: string;
  status?: string;
  expiresAt?: string;
}

export interface ShortlistItemDto {
  itemId: number;
  portfolioId: number;
  switchedViewId?: number;
  displayOrder: number;
  managerNote?: string;
  collaboratorId: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  jobTitle: string;
  yearsExperience: number;
  availabilityStatus: string;
  primarySkills: string[];
  badges: string[];
  publicSlug?: string;
  publicShareSlug?: string;
  switchedTitle?: string;
  switchedBio?: string;
  transferableSkills?: string[];
  relevanceScore?: number;
}

export interface ShortlistSummaryDto {
  shortlistId: number;
  title: string;
  description?: string;
  status: string;
  shareToken: string;
  expiresAt?: string;
  createdAt: string;
  itemCount: number;
  clientName?: string;
}

export interface ShortlistDetailDto {
  shortlistId: number;
  title: string;
  description?: string;
  status: string;
  shareToken: string;
  shareUrl: string;
  expiresAt?: string;
  createdAt: string;
  managerName: string;
  clientName?: string;
  items: ShortlistItemDto[];
}

export interface ClientShortlistViewDto {
  title: string;
  description?: string;
  managerName: string;
  createdAt: string;
  items: ShortlistItemDto[];
}

export interface SendShortlistOptionsDto {
  mode: 'email' | 'pdf' | 'lien' | 'notification';
  clientEmail?: string;
  clientName?: string;
  subject?: string;
  messageBody?: string;
}