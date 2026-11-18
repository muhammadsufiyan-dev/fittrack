import { Route, Routes } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import PublicLayout from '../layouts/PublicLayout'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Analytics from '../pages/dashboard/Analytics'
import Dashboard from '../pages/dashboard/Dashboard'
import Goals from '../pages/dashboard/Goals'
import Help from '../pages/dashboard/Help'
import Notifications from '../pages/dashboard/Notifications'
import Nutrition from '../pages/dashboard/Nutrition'
import Profile from '../pages/dashboard/Profile'
import Progress from '../pages/dashboard/Progress'
import Reminders from '../pages/dashboard/Reminders'
import Reports from '../pages/dashboard/Reports'
import SearchResults from '../pages/dashboard/SearchResults'
import Settings from '../pages/dashboard/Settings'
import Support from '../pages/dashboard/Support'
import UserProfile from '../pages/dashboard/UserProfile'
import WorkoutDetails from '../pages/dashboard/WorkoutDetails'
import Workouts from '../pages/dashboard/Workouts'
import Home from '../pages/home/Home'
import NotFound from '../pages/NotFound'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  return (
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
  )
}

export default AppRoutes
