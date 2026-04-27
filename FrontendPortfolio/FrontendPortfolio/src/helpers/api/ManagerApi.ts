
import { APICore } from './apiCore';
import type {
  CreateClientNeedDto,
  PortfolioFilterDto,
} from '../model/dto/manager.dto';

const api = new APICore();
const BASE = '/api/manager';

// ── 5.1 Dashboard ──────────────────────────────────────────────────
export const GetDashboardApi = () =>
  api.get(`${BASE}/dashboard`);

// ── 5.3 Filtrer portfolios ─────────────────────────────────────────
export const FilterPortfoliosApi = (filter: PortfolioFilterDto) =>
  api.create(`${BASE}/portfolios/filter`, filter);

// ── Besoins client ─────────────────────────────────────────────────
export const CreateClientNeedApi = (dto: CreateClientNeedDto) =>
  api.create(`${BASE}/needs`, dto);

export const GetMyNeedsApi = () =>
  api.get(`${BASE}/needs`);

export const GetClientNeedApi = (needId: number) =>
  api.get(`${BASE}/needs/${needId}`);

// ── 5.2 Matching ───────────────────────────────────────────────────
export const MatchFromNeedApi = (needId: number) =>
  api.create(`${BASE}/needs/${needId}/match`, {});

export const MatchDirectApi = (dto: CreateClientNeedDto) =>
  api.create(`${BASE}/match`, dto);

// ── 5.4 Critères ───────────────────────────────────────────────────
export const GetMatchCriteriaApi = (needId: number, collaboratorId: number) =>
  api.create(`${BASE}/needs/${needId}/match/${collaboratorId}/criteria`, {});

// ── 5.5 Suggestions ────────────────────────────────────────────────
export const GetSuggestionsApi = (needId: number, collaboratorId: number) =>
  api.create(`${BASE}/needs/${needId}/match/${collaboratorId}/suggestions`, {});

// ── 5.6 Badges ─────────────────────────────────────────────────────
export const GetBadgesApi = (collaboratorId: number) =>
  api.get(`${BASE}/collaborators/${collaboratorId}/badges`);

// ── Détail collaborateur ────────────────────────────────────────────
export const GetCollaboratorDetailApi = (collaboratorId: number) =>
  api.get(`${BASE}/collaborators/${collaboratorId}`);