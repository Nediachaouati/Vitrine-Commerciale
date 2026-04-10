import { APICore } from './apiCore';
import type { CreateUserDto } from '../model/dto/create-user.dto';

const api = new APICore();
const BASE_URL = '/api/admin';

export const GetAllUsersAdminApi = async (first = 0, max = 200) =>
  api.get(`${BASE_URL}/users`, { first, max });

export const CreateUserAdminApi = async (dto: CreateUserDto) =>
  api.create(`${BASE_URL}/users`, dto);

export const DeleteUserAdminApi = async (id: string) =>
  api.delete(`${BASE_URL}/users/${id}`);