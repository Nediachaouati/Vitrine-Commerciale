import { APICore } from '../helpers/api/apiCore';

export default function useUser() {
  const api = new APICore();

  const loggedInUser = {};
  return [loggedInUser];
}
