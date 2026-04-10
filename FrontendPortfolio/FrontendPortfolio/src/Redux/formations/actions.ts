/*import { FormationCreateDto, Formations, FormationUpdateDto } from '../../helpers';
import { FormationsActionTypes } from './constants';

export type FormationsActionType = {
  type:
    | FormationsActionTypes.API_RESPONSE_SUCCESS
    | FormationsActionTypes.API_RESPONSE_ERROR
    | FormationsActionTypes.GET_ALL
    | FormationsActionTypes.GET_ONE
    | FormationsActionTypes.UPDATE
    | FormationsActionTypes.UPDATEWITHPHOTO
    | FormationsActionTypes.DELETE
    | FormationsActionTypes.CREATE;

  payload: any;
};

type FormationsData = {
  payload: Formations;
  type: string;
};

export const formationsApiResponseSuccess = (actionType: string, data: any, msg?: string | {}): FormationsActionType => ({
  type: FormationsActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data, msg },
});

export const formationsApiResponseError = (actionType: string, error: any): FormationsActionType => ({
  type: FormationsActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// ===== CRUD =====
export const AddFormations = (formations: FormationCreateDto): FormationsActionType => ({
  type: FormationsActionTypes.CREATE,
  payload: { formations },
});

export const DeleteFormations = (id: number): FormationsActionType => ({
  type: FormationsActionTypes.DELETE,
  payload: { id },
});

export const GetAllFormations = (): FormationsActionType => ({
  type: FormationsActionTypes.GET_ALL,
  payload: {},
});

export const GetFormationsById = (id: number): FormationsActionType => ({
  type: FormationsActionTypes.GET_ONE,
  payload: { id },
});

export const UpdateFormations = (formations: Formations): FormationsActionType => ({
  type: FormationsActionTypes.UPDATE,
  payload: { formations },
});

export const UpdateFormationWithPhoto = (formations: FormationUpdateDto): FormationsActionType => ({
  type: FormationsActionTypes.UPDATEWITHPHOTO,
  payload: { formations },
});
*/