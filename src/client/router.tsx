import { lazy } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';

const publicRoutes: RouteObject[] = [
  {
    path: '/',
    Component: lazy(() => import('./pages/HomePage'))
  },
  {
    path: '*',
    Component: lazy(() => import('./pages/NotFoundPage'))
  }
];

export const router = createBrowserRouter(publicRoutes);
