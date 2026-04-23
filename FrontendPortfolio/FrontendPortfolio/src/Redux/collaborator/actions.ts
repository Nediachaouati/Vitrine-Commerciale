import { CollaboratorActionTypes } from './constants';
import type {
  AddSkillDto, UpdateSkillDto,
  AddExperienceDto, UpdateExperienceDto,
  AddEducationDto, UpdateEducationDto,
  AddCertificationDto, UpdateCertificationDto,
  AddProjectDto, UpdateProjectDto,
} from '../../helpers/model/dto/collaborator.dto';

export type CollaboratorActionType = { type: CollaboratorActionTypes; payload: any };

export const collabApiResponseSuccess = (actionType: string, data: any, msg?: string): CollaboratorActionType => ({
  type: CollaboratorActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data, msg },
});

export const collabApiResponseError = (actionType: string, error: any): CollaboratorActionType => ({
  type: CollaboratorActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const GetMe = () => ({ type: CollaboratorActionTypes.GET_ME, payload: {} });

export const AddSkill = (dto: AddSkillDto) => ({ type: CollaboratorActionTypes.ADD_SKILL, payload: { dto } });
export const UpdateSkill = (id: number, dto: UpdateSkillDto) => ({ type: CollaboratorActionTypes.UPDATE_SKILL, payload: { id, dto } });
export const DeleteSkill = (id: number) => ({ type: CollaboratorActionTypes.DELETE_SKILL, payload: { id } });

export const AddExperience = (dto: AddExperienceDto) => ({ type: CollaboratorActionTypes.ADD_EXPERIENCE, payload: { dto } });
export const UpdateExperience = (id: number, dto: UpdateExperienceDto) => ({ type: CollaboratorActionTypes.UPDATE_EXPERIENCE, payload: { id, dto } });
export const DeleteExperience = (id: number) => ({ type: CollaboratorActionTypes.DELETE_EXPERIENCE, payload: { id } });

export const AddEducation = (dto: AddEducationDto) => ({ type: CollaboratorActionTypes.ADD_EDUCATION, payload: { dto } });
export const UpdateEducation = (id: number, dto: UpdateEducationDto) => ({ type: CollaboratorActionTypes.UPDATE_EDUCATION, payload: { id, dto } });
export const DeleteEducation = (id: number) => ({ type: CollaboratorActionTypes.DELETE_EDUCATION, payload: { id } });

export const AddCertification = (dto: AddCertificationDto) => ({ type: CollaboratorActionTypes.ADD_CERTIFICATION, payload: { dto } });
export const UpdateCertification = (id: number, dto: UpdateCertificationDto) => ({ type: CollaboratorActionTypes.UPDATE_CERTIFICATION, payload: { id, dto } });
export const DeleteCertification = (id: number) => ({ type: CollaboratorActionTypes.DELETE_CERTIFICATION, payload: { id } });

export const AddProject = (dto: AddProjectDto) => ({ type: CollaboratorActionTypes.ADD_PROJECT, payload: { dto } });
export const UpdateProject = (id: number, dto: UpdateProjectDto) => ({ type: CollaboratorActionTypes.UPDATE_PROJECT, payload: { id, dto } });
export const DeleteProject = (id: number) => ({ type: CollaboratorActionTypes.DELETE_PROJECT, payload: { id } });

export const ClearCollabMsg = () => ({ type: CollaboratorActionTypes.CLEAR_MSG, payload: {} });