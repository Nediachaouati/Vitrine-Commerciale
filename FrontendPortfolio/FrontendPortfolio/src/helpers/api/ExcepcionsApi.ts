import { APICore } from './apiCore';
import type { ExceptionDB } from '../model/db.model';

const api = new APICore();
const BASE_URL = '/api/Exceptions';

const AddExceptionApi = async (e: Partial<ExceptionDB>) => api.create(BASE_URL, e);
const UpdateExceptionApi = async (data: { e: Partial<ExceptionDB> }) => api.putSimple(BASE_URL, data);
const DeleteExceptionApi = async (id: number) => api.delete(`${BASE_URL}/${id}`);
const GetExceptionByIdApi = async (id: number) => api.getById(BASE_URL, id);
const GetAllExceptionsApi = async () => api.getData(BASE_URL);

export { AddExceptionApi, UpdateExceptionApi, GetExceptionByIdApi, GetAllExceptionsApi, DeleteExceptionApi };
