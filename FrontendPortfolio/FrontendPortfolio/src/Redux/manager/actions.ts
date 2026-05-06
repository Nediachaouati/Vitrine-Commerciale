import { ManagerActionTypes } from './constants';
import type { CreateClientNeedDto, PortfolioFilterDto,BatchSwitchRequestDto, } from '../../helpers/model/dto/manager.dto';

export type ManagerActionType = { type: ManagerActionTypes; payload: any };

export const managerApiResponseSuccess = (
  actionType: string,
  data: any,
  msg?: string
): ManagerActionType => ({
  type: ManagerActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data, msg },
});

export const managerApiResponseError = (
  actionType: string,
  error: any
): ManagerActionType => ({
  type: ManagerActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// ── Dashboard ──────────────────────────────────────────────────────
export const LoadDashboard = () => ({
  type: ManagerActionTypes.LOAD_DASHBOARD,
  payload: {},
});

// ── Besoins client ─────────────────────────────────────────────────
export const CreateNeed = (dto: CreateClientNeedDto) => ({
  type: ManagerActionTypes.CREATE_NEED,
  payload: { dto },
});

export const LoadMyNeeds = () => ({
  type: ManagerActionTypes.LOAD_MY_NEEDS,
  payload: {},
});

export const SelectNeed = (needId: number | null) => ({
  type: ManagerActionTypes.SELECT_NEED,
  payload: { needId },
});

// ── Matching ───────────────────────────────────────────────────────
export const RunMatch = (needId: number) => ({
  type: ManagerActionTypes.RUN_MATCH,
  payload: { needId },
});

export const MatchDirect = (dto: CreateClientNeedDto) => ({
  type: ManagerActionTypes.MATCH_DIRECT,
  payload: { dto },
});

// ── Critères ───────────────────────────────────────────────────────
export const LoadCriteria = (needId: number, collaboratorId: number) => ({
  type: ManagerActionTypes.LOAD_CRITERIA,
  payload: { needId, collaboratorId },
});

// ── Suggestions ────────────────────────────────────────────────────
export const LoadSuggestions = (needId: number, collaboratorId: number) => ({
  type: ManagerActionTypes.LOAD_SUGGESTIONS,
  payload: { needId, collaboratorId },
});

// ── Portfolios ─────────────────────────────────────────────────────
export const FilterPortfolios = (filter: PortfolioFilterDto) => ({
  type: ManagerActionTypes.FILTER_PORTFOLIOS,
  payload: { filter },
});

// ── Tech Switch (Batch) ────────────────────────────────────────────
export const BatchSwitch = (dto: BatchSwitchRequestDto) => ({
  type: ManagerActionTypes.BATCH_SWITCH,
  payload: { dto },
});
 
export const LoadSwitchedViews = (tech?: string) => ({
  type: ManagerActionTypes.LOAD_SWITCHED_VIEWS,
  payload: { tech },
});
 
export const DeleteSwitchedView = (viewId: number) => ({
  type: ManagerActionTypes.DELETE_SWITCHED_VIEW,
  payload: { viewId },
});

// ── UI ─────────────────────────────────────────────────────────────
export const SelectCollab = (collaboratorId: number | null) => ({
  type: ManagerActionTypes.SELECT_COLLAB,
  payload: { collaboratorId },
});

export const SetActiveTab = (tab: 'dashboard' | 'matching' | 'portfolios') => ({
  type: ManagerActionTypes.SET_ACTIVE_TAB,
  payload: { tab },
});

export const ClearMatch = () => ({
  type: ManagerActionTypes.CLEAR_MATCH,
  payload: {},
});

export const ClearManagerMsg = () => ({
  type: ManagerActionTypes.CLEAR_MSG,
  payload: {},
});