import type { FC, PropsWithChildren } from 'react';
import React from 'react';

import { UserRoles } from '../constants/constants';
import { useTokenContext } from '../context/TokenContext';

interface AuthGuardProps extends PropsWithChildren {
  roles?: string[];
}

const AuthGuard: FC<AuthGuardProps> = ({ children, roles = [] }) => {
  const { accessToken } = useTokenContext();
  const userRole = localStorage.getItem('role');

  if (!accessToken) {
    return null;
  }

  if (userRole === UserRoles.ADMIN) {
    return <>{children}</>;
  }

  if (!userRole || !roles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
