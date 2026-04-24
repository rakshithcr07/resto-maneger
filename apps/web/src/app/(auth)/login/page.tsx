'use client';

import React from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/admin/dashboard');
  };

  return <LoginForm onSuccess={handleLoginSuccess} />;
}
