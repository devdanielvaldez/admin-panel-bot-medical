'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const withAuth = (WrappedComponent: React.FC) => {
  const AuthenticatedComponent: React.FC = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        router.push('/');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;