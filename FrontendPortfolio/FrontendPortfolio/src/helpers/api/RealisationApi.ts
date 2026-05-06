import { APICore } from './apiCore';
import type { UpsertRealisationDto } from '../model/dto/realisation.dto';

const api = new APICore();
const BASE = '/api/realisations';

// Manager 

export const GetMyRealisationsApi = () =>
  api.get(`${BASE}/my`);

export const GetRealisationByIdApi = (id: number) =>
  api.get(`${BASE}/${id}`);

export const CreateRealisationApi = (dto: UpsertRealisationDto) =>
  api.create(`${BASE}`, dto);

export const UpdateRealisationApi = (id: number, dto: UpsertRealisationDto) =>
  api.update(`${BASE}/${id}`, dto);

export const DeleteRealisationApi = (id: number) =>
  api.delete(`${BASE}/${id}`);

// Public (clients) 

export const GetPublicRealisationsApi = () =>
  api.get(`${BASE}/public`);