'use client';

import React from 'react';
import { AuthShell } from '@/components/auth/auth-shell';

/**
 * Shared Layout for all Auth pages (Login, Register, Verify).
 * AuthShell provides the split-screen branded layout.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthShell>
      {children}
    </AuthShell>
  );
}
