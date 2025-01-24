import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { Navigate } from 'react-router-dom';

import { UserRoles } from '../constants/constants';
import { useToken } from '../hooks/useToken';

interface AuthGuardProps extends PropsWithChildren {
  roles?: string[];
}

const AuthGuard: FC<AuthGuardProps> = ({ children, roles = [] }) => {
  const { token } = useToken();
  const userRole = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/signin" replace />;
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
