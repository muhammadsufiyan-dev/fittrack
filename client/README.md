# FitTrack - client

This is the React frontend of FitTrack, a fitness tracker with workouts, meals, goals, reminders, charts and a small community.

It does not store any data itself. Every page talks to the Express API in the `server` folder, and the API saves everything in MongoDB Atlas.

## Tech used

- React 19 with Vite
- React Router (HashRouter, so it works on GitHub Pages)
- Bootstrap 5 and Bootstrap Icons
- Recharts for the charts
- Google Identity Services for "Continue with Google"
- Formspree for the support form

## Folder structure

    src
    |-- components    buttons, cards, modals, forms and other small parts
    |-- context       login state and theme
    |-- hooks         shared hooks
    |-- layouts       website layout and dashboard layout
    |-- pages         one file for each page
    |-- routes        all the routes and the login guard
    |-- services      API calls for each feature
    |-- styles        CSS files
    `-- utils         small helper functions

## Setup

    npm install
    copy .env.example .env

Open `.env` and fill these values:

    VITE_API_URL=http://localhost:5000/api
    VITE_GOOGLE_CLIENT_ID=your Google OAuth ID (optional)
    VITE_FORMSPREE_ID=your Formspree form ID (optional)

Without `VITE_GOOGLE_CLIENT_ID` the Google button is hidden. Without `VITE_FORMSPREE_ID` the support message is still saved, it is just not emailed.

## Commands

    npm run dev        start on http://localhost:5173/fittrack/
    npm run build      make the production build in dist
    npm run preview    open the production build locally

Start the API from the `server` folder first, otherwise the pages cannot load any data.