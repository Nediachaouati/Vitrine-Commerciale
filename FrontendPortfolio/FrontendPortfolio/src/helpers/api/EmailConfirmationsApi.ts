/*import { APICore } from './apiCore';
import type { EmailConfirmation } from '../model/db.model';

const api = new APICore();
const BASE_URL = '/api/EmailConfirmations';

const AddEmailConfirmationApi = async (e: Partial<EmailConfirmation>) => api.create(BASE_URL, e);
const UpdateEmailConfirmationApi = async (data: { e: Partial<EmailConfirmation> }) => api.putSimple(BASE_URL, data);
const DeleteEmailConfirmationApi = async (id: number) => api.delete(`${BASE_URL}/${id}`);
const GetEmailConfirmationByIdApi = async (id: number) => api.getById(BASE_URL, id);
const GetAllEmailConfirmationsApi = async () => api.getData(BASE_URL);

export { AddEmailConfirmationApi, UpdateEmailConfirmationApi, GetEmailConfirmationByIdApi, GetAllEmailConfirmationsApi, DeleteEmailConfirmationApi };
*/