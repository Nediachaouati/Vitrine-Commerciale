import { APICore } from './apiCore';
import { RoleEnum } from '../model/enum/role.enum';

const api = new APICore();
const BASE_URL = '/api/users';

export const GetUsersByRolesApi = async (roles: string, first = 0, max = 200) =>
  api.get(`${BASE_URL}/by-roles`, { roles, first, max });

export const SyncUsersApi = async (batchSize = 200, maxTotal = 20000) =>
  api.create(`${BASE_URL}/sync?batchSize=${batchSize}&maxTotal=${maxTotal}`, {});

export const GetAllCollaborateursApi = async () =>
  GetUsersByRolesApi(RoleEnum.COLLABORATEUR);

export const GetAllManagersApi = async () =>
  GetUsersByRolesApi(RoleEnum.MANAGER);