import { APICore } from '../../helpers/api/apiCore';
import type {
  CreateShortlistDto,
  UpdateShortlistDto,
  ShortlistItemInputDto,
  SendShortlistOptionsDto,
} from '../model/dto/Shortlist.dto';

const api = new APICore();
const BASE = '/api/shortlists';

// ── Manager CRUD ──────────────────────────────────────────────────
export const CreateShortlistApi = (dto: CreateShortlistDto) =>
  api.create(BASE, dto);

export const GetMyShortlistsApi = () =>
  api.get(BASE);

export const GetShortlistByIdApi = (id: number) =>
  api.get(`${BASE}/${id}`);

export const UpdateShortlistApi = (id: number, dto: UpdateShortlistDto) =>
  api.update(`${BASE}/${id}`, dto);

export const DeleteShortlistApi = (id: number) =>
  api.delete(`${BASE}/${id}`);

// ── Items ─────────────────────────────────────────────────────────
export const AddShortlistItemApi = (shortlistId: number, item: ShortlistItemInputDto) =>
  api.create(`${BASE}/${shortlistId}/items`, item);

export const RemoveShortlistItemApi = (shortlistId: number, portfolioId: number) =>
  api.delete(`${BASE}/${shortlistId}/items/${portfolioId}`);

// ── Send ──────────────────────────────────────────────────────────
export const SendShortlistApi = (id: number, dto: SendShortlistOptionsDto) =>
  api.create(`${BASE}/${id}/send`, dto);

// ── Client view ───────────────────────────────────────────────────
export const ViewShortlistByTokenApi = (token: string) =>
  api.get(`${BASE}/view/${token}`);