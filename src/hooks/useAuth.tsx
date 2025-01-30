'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const withAuth = (WrappedComponent: React.FC) => {
  const AuthenticatedComponent: React.FC = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          router.push('/');
        } else {
          setLoading(false);
        }
      }
    }, [router]);

    if (loading) {
      return <div>Cargando...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
