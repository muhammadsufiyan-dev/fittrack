import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Loader from '../components/ui/Loader'
import DashboardLayout from '../layouts/DashboardLayout'
import PublicLayout from '../layouts/PublicLayout'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Home from '../pages/home/Home'
import NotFound from '../pages/NotFound'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import ProtectedRoute from './ProtectedRoute'

const Analytics = lazy(() => import('../pages/dashboard/Analytics'))
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'))
const Goals = lazy(() => import('../pages/dashboard/Goals'))
const Help = lazy(() => import('../pages/dashboard/Help'))
const Notifications = lazy(() => import('../pages/dashboard/Notifications'))
const Nutrition = lazy(() => import('../pages/dashboard/Nutrition'))
const Profile = lazy(() => import('../pages/dashboard/Profile'))
const Progress = lazy(() => import('../pages/dashboard/Progress'))
const Reminders = lazy(() => import('../pages/dashboard/Reminders'))
const Reports = lazy(() => import('../pages/dashboard/Reports'))
const SearchResults = lazy(() => import('../pages/dashboard/SearchResults'))
const Settings = lazy(() => import('../pages/dashboard/Settings'))
const Support = lazy(() => import('../pages/dashboard/Support'))
const UserProfile = lazy(() => import('../pages/dashboard/UserProfile'))
const WorkoutDetails = lazy(() => import('../pages/dashboard/WorkoutDetails'))
const Workouts = lazy(() => import('../pages/dashboard/Workouts'))

function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/workouts/:id" element={<WorkoutDetails />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/users/:id" element={<UserProfile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/support" element={<Support />} />
            <Route path="/help" element={<Help />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
