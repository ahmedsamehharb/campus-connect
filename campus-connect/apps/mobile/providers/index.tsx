import React, { ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { MessagesProvider } from '@/contexts/MessagesContext';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Combined providers wrapper for the app
 * Order matters: QueryProvider should wrap AuthProvider
 * so auth can use React Query for data fetching
 * NotificationProvider needs AuthProvider for user context
 * MessagesProvider needs AuthProvider for user context
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <NotificationProvider>
          <MessagesProvider>{children}</MessagesProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

export { QueryProvider } from './QueryProvider';
export { AuthProvider, useAuth } from '@/contexts/AuthContext';
export { NotificationProvider, useNotifications } from '@/contexts/NotificationContext';
export { MessagesProvider, useMessages } from '@/contexts/MessagesContext';

