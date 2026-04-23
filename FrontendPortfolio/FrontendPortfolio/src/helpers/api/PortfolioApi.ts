// helpers/api/PortfolioApi.ts
import { APICore } from './apiCore';
import type {
  CreatePortfolioDto,
  UpdatePortfolioDto,
  SetPortfolioItemsDto,
  ChatRequestDto,
} from '../model/dto/collaborator.dto';

const api = new APICore();
const BASE = '/api/portfolio';

// Mes portfolios
export const GetMyPortfoliosApi = () => api.get(`${BASE}/my`);

// Portfolio complet avec items
export const GetPortfolioApi = (portfolioId: number) =>
  api.get(`${BASE}/${portfolioId}`);

// Vue publique (no token)
export const GetPublicPortfolioApi = (slug: string) =>
  api.get(`${BASE}/public/${slug}`);

// CRUD portfolio
export const CreatePortfolioApi = (dto: CreatePortfolioDto) =>
  api.create(BASE, dto);

export const UpdatePortfolioApi = (portfolioId: number, dto: UpdatePortfolioDto) =>
  api.update(`${BASE}/${portfolioId}`, dto);

export const DeletePortfolioApi = (portfolioId: number) =>
  api.delete(`${BASE}/${portfolioId}`);

// Sélection des items visibles
export const SetPortfolioSkillsApi = (portfolioId: number, dto: SetPortfolioItemsDto) =>
  api.update(`${BASE}/${portfolioId}/skills`, dto);

export const SetPortfolioExperiencesApi = (portfolioId: number, dto: SetPortfolioItemsDto) =>
  api.update(`${BASE}/${portfolioId}/experiences`, dto);

export const SetPortfolioEducationApi = (portfolioId: number, dto: SetPortfolioItemsDto) =>
  api.update(`${BASE}/${portfolioId}/education`, dto);

export const SetPortfolioCertificationsApi = (portfolioId: number, dto: SetPortfolioItemsDto) =>
  api.update(`${BASE}/${portfolioId}/certifications`, dto);

export const SetPortfolioProjectsApi = (portfolioId: number, dto: SetPortfolioItemsDto) =>
  api.update(`${BASE}/${portfolioId}/projects`, dto);

// Chat IA
export const PortfolioChatApi = (portfolioId: number, dto: ChatRequestDto) =>
  api.create(`${BASE}/${portfolioId}/chat`, dto);