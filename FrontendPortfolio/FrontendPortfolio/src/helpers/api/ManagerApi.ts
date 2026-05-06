
import { APICore } from './apiCore';
import type {
  BatchSwitchRequestDto,
  CreateClientNeedDto,
  PortfolioFilterDto,
} from '../model/dto/manager.dto';

const api = new APICore();
const BASE = '/api/manager';

// Dashboard 
export const GetDashboardApi = () =>
  api.get(`${BASE}/dashboard`);

// Filtrer portfolios 
export const FilterPortfoliosApi = (filter: PortfolioFilterDto) =>
  api.create(`${BASE}/portfolios/filter`, filter);

// Besoins client 
export const CreateClientNeedApi = (dto: CreateClientNeedDto) =>
  api.create(`${BASE}/needs`, dto);

export const GetMyNeedsApi = () =>
  api.get(`${BASE}/needs`);

export const GetClientNeedApi = (needId: number) =>
  api.get(`${BASE}/needs/${needId}`);

// Matching 
export const MatchFromNeedApi = (needId: number) =>
  api.create(`${BASE}/needs/${needId}/match`, {});

export const MatchDirectApi = (dto: CreateClientNeedDto) =>
  api.create(`${BASE}/match`, dto);

// Critères 
export const GetMatchCriteriaApi = (needId: number, collaboratorId: number) =>
  api.create(`${BASE}/needs/${needId}/match/${collaboratorId}/criteria`, {});

// Suggestions 
export const GetSuggestionsApi = (needId: number, collaboratorId: number) =>
  api.create(`${BASE}/needs/${needId}/match/${collaboratorId}/suggestions`, {});

//  Badges 
export const GetBadgesApi = (collaboratorId: number) =>
  api.get(`${BASE}/collaborators/${collaboratorId}/badges`);

//  Détail collaborateur 
export const GetCollaboratorDetailApi = (collaboratorId: number) =>
  api.get(`${BASE}/collaborators/${collaboratorId}`);

// Tech Switch (Batch) 
export const BatchSwitchApi = (dto: BatchSwitchRequestDto) =>
  api.create(`${BASE}/switch/batch`, dto);
 
export const GetSwitchedViewsApi = (tech?: string) => {
  const params = tech ? `?tech=${encodeURIComponent(tech)}` : '';
  return api.get(`${BASE}/switch/views${params}`);
};
 
export const DeleteSwitchedViewApi = (viewId: number) =>
  api.delete(`${BASE}/switch/views/${viewId}`);