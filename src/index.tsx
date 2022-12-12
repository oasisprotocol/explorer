import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from 'react-router-dom';
import logotype from '../public/logo192.png'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <div><img src={logotype} alt="Oasis" /> root</div>,
  },
  {
    path: '/dashboard',
    element: <div>dashboard</div>,
  },
];

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
