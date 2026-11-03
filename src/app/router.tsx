import { createBrowserRouter } from 'react-router'
import { CardDetailPage } from '../pages/CardDetailPage'
import { CardFormPage } from '../pages/CardFormPage'
import { CardListPage } from '../pages/CardListPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ScanPage } from '../pages/ScanPage'
import { SettingsPage } from '../pages/SettingsPage'

export const router = createBrowserRouter([
  { path: '/', element: <CardListPage /> },
  { path: '/card/new', element: <CardFormPage /> },
  { path: '/card/:id', element: <CardDetailPage /> },
  { path: '/card/:id/edit', element: <CardFormPage /> },
  { path: '/scan', element: <ScanPage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '*', element: <NotFoundPage /> },
])
