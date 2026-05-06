import { APICore } from './apiCore';

const api = new APICore();
const BASE = '/api/skillcatalog';

export const GetSkillCatalogApi = (category?: string) =>
  api.get(BASE + (category ? `?category=${encodeURIComponent(category)}` : ''));