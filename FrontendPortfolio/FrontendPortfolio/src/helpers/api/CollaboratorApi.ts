import { APICore } from './apiCore';
import type {
  AddSkillDto, UpdateSkillDto,
  AddExperienceDto, UpdateExperienceDto,
  AddEducationDto, UpdateEducationDto,
  AddCertificationDto, UpdateCertificationDto,
  AddProjectDto, UpdateProjectDto,
} from '../model/dto/collaborator.dto';

const api = new APICore();
const BASE = '/api/collaborator';

// Profil complet
export const GetMeApi = () => api.get(`${BASE}/me`);

// Skills
export const AddSkillApi = (dto: AddSkillDto) => api.create(`${BASE}/skills`, dto);
export const UpdateSkillApi = (id: number, dto: UpdateSkillDto) => api.update(`${BASE}/skills/${id}`, dto);
export const DeleteSkillApi = (id: number) => api.delete(`${BASE}/skills/${id}`);

// Experiences
export const AddExperienceApi = (dto: AddExperienceDto) => api.create(`${BASE}/experiences`, dto);
export const UpdateExperienceApi = (id: number, dto: UpdateExperienceDto) => api.update(`${BASE}/experiences/${id}`, dto);
export const DeleteExperienceApi = (id: number) => api.delete(`${BASE}/experiences/${id}`);

// Education
export const AddEducationApi = (dto: AddEducationDto) => api.create(`${BASE}/education`, dto);
export const UpdateEducationApi = (id: number, dto: UpdateEducationDto) => api.update(`${BASE}/education/${id}`, dto);
export const DeleteEducationApi = (id: number) => api.delete(`${BASE}/education/${id}`);

// Certifications
export const AddCertificationApi = (dto: AddCertificationDto) => api.create(`${BASE}/certifications`, dto);
export const UpdateCertificationApi = (id: number, dto: UpdateCertificationDto) => api.update(`${BASE}/certifications/${id}`, dto);
export const DeleteCertificationApi = (id: number) => api.delete(`${BASE}/certifications/${id}`);

// Projects
export const AddProjectApi = (dto: AddProjectDto) => api.create(`${BASE}/projects`, dto);
export const UpdateProjectApi = (id: number, dto: UpdateProjectDto) => api.update(`${BASE}/projects/${id}`, dto);
export const DeleteProjectApi = (id: number) => api.delete(`${BASE}/projects/${id}`);