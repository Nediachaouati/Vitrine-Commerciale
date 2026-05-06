import { ShortlistActionTypes } from './constants';
import type {
  CreateShortlistDto,
  UpdateShortlistDto,
  ShortlistItemInputDto,
  SendShortlistOptionsDto,
} from '../../helpers/model/dto/Shortlist.dto';

export type ShortlistActionType = { type: ShortlistActionTypes; payload: any };

export const shortlistApiResponseSuccess = (
  actionType: string,
  data: any,
  msg?: string
): ShortlistActionType => ({
  type: ShortlistActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data, msg },
});

export const shortlistApiResponseError = (
  actionType: string,
  error: any
): ShortlistActionType => ({
  type: ShortlistActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// ── Manager CRUD ──────────────────────────────────────────────────
export const CreateShortlist = (dto: CreateShortlistDto) => ({
  type: ShortlistActionTypes.CREATE_SHORTLIST,
  payload: { dto },
});

export const LoadMyShortlists = () => ({
  type: ShortlistActionTypes.LOAD_MY_SHORTLISTS,
  payload: {},
});

export const LoadShortlist = (id: number) => ({
  type: ShortlistActionTypes.LOAD_SHORTLIST,
  payload: { id },
});

export const UpdateShortlist = (id: number, dto: UpdateShortlistDto) => ({
  type: ShortlistActionTypes.UPDATE_SHORTLIST,
  payload: { id, dto },
});

export const DeleteShortlist = (id: number) => ({
  type: ShortlistActionTypes.DELETE_SHORTLIST,
  payload: { id },
});

export const SendShortlist = (id: number, dto?: SendShortlistOptionsDto) => ({
  type: ShortlistActionTypes.SEND_SHORTLIST,
  payload: { id, dto },
});

// ── Items ─────────────────────────────────────────────────────────
export const AddShortlistItem = (shortlistId: number, item: ShortlistItemInputDto) => ({
  type: ShortlistActionTypes.ADD_ITEM,
  payload: { shortlistId, item },
});

export const RemoveShortlistItem = (shortlistId: number, portfolioId: number) => ({
  type: ShortlistActionTypes.REMOVE_ITEM,
  payload: { shortlistId, portfolioId },
});

// ── Client view ───────────────────────────────────────────────────
export const ViewShortlistByToken = (token: string) => ({
  type: ShortlistActionTypes.VIEW_BY_TOKEN,
  payload: { token },
});

// ── UI ─────────────────────────────────────────────────────────────
export const SetSelectedShortlist = (id: number | null) => ({
  type: ShortlistActionTypes.SET_SELECTED,
  payload: { id },
});

export const ClearShortlistMsg = () => ({
  type: ShortlistActionTypes.CLEAR_MSG,
  payload: {},
});

export const OpenBuilder = () => ({
  type: ShortlistActionTypes.OPEN_BUILDER,
  payload: {},
});

export const CloseBuilder = () => ({
  type: ShortlistActionTypes.CLOSE_BUILDER,
  payload: {},
});