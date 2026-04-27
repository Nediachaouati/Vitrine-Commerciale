import { RealisationActionTypes } from './constants';
import type { UpsertRealisationDto } from '../../helpers/model/dto/realisation.dto';

export const realisationApiResponseSuccess = (actionType: string, data: any, msg?: string) => ({
  type: RealisationActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data, msg },
});

export const realisationApiResponseError = (actionType: string, error: any) => ({
  type: RealisationActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// ── CRUD ───────────────────────────────────────────────────────────

export const LoadMyRealisations = () => ({
  type: RealisationActionTypes.LOAD_MY_REALISATIONS,
  payload: {},
});

export const CreateRealisation = (dto: UpsertRealisationDto) => ({
  type: RealisationActionTypes.CREATE_REALISATION,
  payload: { dto },
});

export const UpdateRealisation = (id: number, dto: UpsertRealisationDto) => ({
  type: RealisationActionTypes.UPDATE_REALISATION,
  payload: { id, dto },
});

export const DeleteRealisation = (id: number) => ({
  type: RealisationActionTypes.DELETE_REALISATION,
  payload: { id },
});

// ── UI ─────────────────────────────────────────────────────────────

export const SelectRealisation = (id: number | null) => ({
  type: RealisationActionTypes.SELECT_REALISATION,
  payload: { id },
});

export const OpenRealisationForm = (id?: number) => ({
  type: RealisationActionTypes.OPEN_FORM,
  payload: { id: id ?? null }, // null = création, number = édition
});

export const CloseRealisationForm = () => ({
  type: RealisationActionTypes.CLOSE_FORM,
  payload: {},
});

export const ClearRealisationMsg = () => ({
  type: RealisationActionTypes.CLEAR_MSG,
  payload: {},
});