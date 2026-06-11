import type { ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'

// Pages
import HomePage from '../pages/HomePage'
import StudioPage from '../pages/StudioPage'
import SubscriptionPage from '../pages/SubscriptionPage'
import LoginPage from '../pages/auth/LoginPage'
import SignupPage from '../pages/auth/SignupPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import AuthCallbackPage from '../pages/auth/AuthCallbackPage'
import DashboardPage from '../pages/DashboardPage'
import AdminPage from '../pages/AdminPage'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import AdminRoute from '../components/auth/AdminRoute'
import TermsPage from '../pages/TermsPage'

// ── Layouts ────────────────────────────────────────────────────────────────
const WithNav = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
  </div>
)

const Bare = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <main className="flex-1">{children}</main>
  </div>
)

export const router = createBrowserRouter([
  // ── Public routes ──────────────────────────────────────────────────────
  {
    path: '/',
    element: <WithNav><HomePage /></WithNav>,
  },
  {
    path: '/studio',
    element: <WithNav><StudioPage /></WithNav>,
  },
  {
    path: '/pricing',
    element: <WithNav><SubscriptionPage /></WithNav>,
  },
  {
    path: '/terms',
    element: <TermsPage />,
  },

  // ── Auth routes ────────────────────────────────────────────────────────
  {
    path: '/login',
    element: <Bare><LoginPage /></Bare>,
  },
  {
    path: '/signup',
    element: <Bare><SignupPage /></Bare>,
  },
  {
    path: '/forgot-password',
    element: <Bare><ForgotPasswordPage /></Bare>,
  },
  {
    path: '/auth/callback',
    element: <Bare><AuthCallbackPage /></Bare>,
  },

  // ── Protected routes ───────────────────────────────────────────────────
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <WithNav><DashboardPage /></WithNav>
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <WithNav><AdminPage /></WithNav>
      </AdminRoute>
    ),
  },
])