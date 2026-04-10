// src/helpers/api/ProfileApi.ts
import { APICore } from './apiCore';
import type { UpdateProfileDto } from '../model/dto/update-profile.dto';

const api = new APICore();
const BASE_URL = '/api/profile';

// Récupérer mon profil complet
export const GetMyProfileApi = async () => 
  api.get(`${BASE_URL}`);

// Mettre à jour mon profil (User + Collaborator/Manager)
export const UpdateMyProfileApi = async (dto: UpdateProfileDto) => 
  api.update(`${BASE_URL}`, dto);

// Upload Avatar
export const UploadAvatarApi = async (formData: FormData) => 
  api.upload(`${BASE_URL}/avatar`, formData);

// Supprimer Avatar
export const DeleteAvatarApi = async () => 
  api.delete(`${BASE_URL}/avatar`);