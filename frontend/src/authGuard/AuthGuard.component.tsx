import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { UserRoles } from '../constants/constants';
import { useToken } from '../hooks/useToken';

interface AuthGuardProps extends PropsWithChildren {
  roles?: string[];
}

const AuthGuard: FC<AuthGuardProps> = ({ children, roles = [] }) => {
  const { token } = useToken();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  if (!token) {
    navigate('/signin');
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
