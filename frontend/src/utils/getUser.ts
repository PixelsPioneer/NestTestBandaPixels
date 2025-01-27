import type { User } from '../constants/constants';

export const getUser = (): User | null => {
  const userMaybe = localStorage.getItem('user');

  if (!userMaybe) {
    return null;
  }

  return JSON.parse(userMaybe);
};
