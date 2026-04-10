/*import { APICore } from './apiCore';
import type { AviesFormations } from '../model/db.model';

const api = new APICore();
const BASE_URL = '/api/AviesFormations';

const AddAviesFormationApi = async (a: Partial<AviesFormations>) => api.create(BASE_URL, a);
const UpdateAviesFormationApi = async (data: { a: Partial<AviesFormations> }) => api.putSimple(BASE_URL, data);
const DeleteAviesFormationApi = async (id: number) => api.delete(`${BASE_URL}/${id}`);
const GetAviesFormationByIdApi = async (id: number) => api.getById(BASE_URL, id);
const GetAllAviesFormationsApi = async () => api.getData(BASE_URL);

export { AddAviesFormationApi, UpdateAviesFormationApi, GetAviesFormationByIdApi, GetAllAviesFormationsApi, DeleteAviesFormationApi };
*/