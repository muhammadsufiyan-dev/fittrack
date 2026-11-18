# FitTrack - client

React + Vite frontend for the FitTrack fitness tracker. Data is mocked in the browser (localStorage) for now.

## Run

```
npm install
npm run dev
```

Build for production with `npm run build`.

Demo login: `demo@fittrack.com` / `Demo@123`

## Folder guide

```
src/
  components/
    layout/      Navbar, Footer, Sidebar, UserMenu, Brand, ThemeToggle
    ui/          Modal, PageHeader, StatCard, Loader, EmptyState, ComingSoon, Reveal, CountUp, Ecg
    auth/        AuthShell, FormField, PasswordField
    charts/      ActivityRings, WeeklyChart, MacroChart
    workouts/    WorkoutCard, WorkoutForm
    nutrition/   MealCard, NutritionForm
  pages/
    home/        Landing page sections
    auth/        Login, Register
    dashboard/   All logged-in pages
  layouts/       PublicLayout, DashboardLayout
  routes/        AppRoutes, ProtectedRoute, ScrollToTop
  context/       ThemeContext, AuthContext
  hooks/         useTheme, useAuth, useGoTo
  services/      Mock API functions (swap for axios calls later)
  data/          Mock JSON data
  utils/         Small helpers
  styles/        variables, base, animations, layout, components, home, auth, dashboard
```

## Preloader

The loading screen is `components/ui/Preloader.jsx` with its styles in `styles/preloader.css`.

## Deploy (GitHub Pages)

`vite.config.js` sets `base: '/fittrack/'`. Change it if your repository has a different name.
