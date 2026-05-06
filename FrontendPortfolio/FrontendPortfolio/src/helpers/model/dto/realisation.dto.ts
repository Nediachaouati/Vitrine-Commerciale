export interface UpsertRealisationDto {
  title: string;
  description?: string;
  clientName?: string;
  siteUrl?: string;
  screenshotUrl?: string;
  technologies?: string[];
  category?: string;
  deliveredAt?: string; 
  isPublic: boolean;
  collaboratorId?: number;
}

export interface RealisationResponseDto {
  realisationId: number;
  managerId: number;
  collaboratorId?: number;
  collaboratorName?: string;
  title: string;
  description?: string;
  clientName?: string;
  siteUrl?: string;
  screenshotUrl?: string;
  technologies: string[];
  category?: string;
  deliveredAt?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RealisationSummaryDto {
  realisationId: number;
  title: string;
  description?: string;
  clientName?: string;
  siteUrl?: string;
  screenshotUrl?: string;
  technologies: string[];
  category?: string;
  deliveredAt?: string;
}