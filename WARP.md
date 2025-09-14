# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a blog application built with React 19, Vite, Appwrite (as BaaS), and modern UI components. The application supports user authentication, blog post creation/editing, and includes both public and protected routes.

## Technology Stack

- **Frontend**: React 19 + Vite
- **Backend**: Appwrite (Backend-as-a-Service)
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v3 + shadcn/ui components (built on Radix UI)
- **Build Tool**: Vite
- **Deployment**: Firebase Hosting (configured)
- **Linting**: ESLint v9

## Essential Commands

### Development
```bash
npm run dev          # Start development server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
```

### Environment Setup
Copy `.env.example` to `.env` and configure Appwrite credentials:
```bash
VITE_APPWRITE_URL=""
VITE_APPWRITE_PROJECT_ID=""
VITE_APPWRITE_DATABSE_ID=""          # Note: typo exists in original
VITE_APPWRITE_COLLECTION_ID=""
VITE_APPWRITE_BUCKET_ID=""
```

### Testing & Development
- Development server runs on `http://localhost:5173`
- Hot reload is enabled via Vite
- Path aliases configured: `@/` maps to `src/`

### shadcn/ui Commands
```bash
npx shadcn@latest add [component]     # Add specific component
npx shadcn@latest info               # Check project configuration
npx shadcn@latest init --force       # Reinitialize if needed
```

## Architecture Overview

### Application Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Radix UI + Tailwind components
│   ├── Navbar.jsx      # Main navigation
│   ├── PostCard.jsx    # Blog post card display
│   └── PrivateRoute.jsx # Route protection wrapper
├── config/             # Configuration files
│   └── appwrite.js     # Appwrite SDK configuration
├── hooks/              # Custom React hooks
│   ├── useAuthCheck.js # Authentication state checker
│   └── useDarkMode.js  # Dark mode toggle
├── layout/             # Layout components
│   └── MainLayout.jsx  # Main app layout with navbar
├── pages/              # Route-level components
├── services/           # External service integrations
│   ├── authService.js  # Appwrite authentication
│   └── postService.js  # Blog post CRUD operations
├── store/              # Redux state management
│   ├── store.js        # Redux store configuration
│   ├── authSlice.js    # Authentication state
│   └── postSlice.js    # Posts state with caching
└── utils/              # Utility functions
```

### Key Architectural Patterns

#### Service Layer Architecture
- **AuthService**: Handles all authentication operations with Appwrite, includes local caching
- **PostService**: Manages blog post CRUD operations via Appwrite Database
- Services are instantiated as singletons and exported for shared usage

#### Redux State Management
- **Auth Slice**: Manages user authentication state, loading states
- **Post Slice**: Handles posts array, search functionality, loading states, and fetched flags
- State is persisted locally for auth via AuthService caching

#### Route Protection
- **PrivateRoute**: HOC component that wraps protected routes
- **useAuthCheck**: Hook that validates authentication on app startup
- Authentication state checked before rendering main app

#### Component Architecture
- **MainLayout**: Provides consistent layout with Navbar for most routes
- **Auth pages** (login/signup) render without layout
- **Protected routes**: Dashboard, Create/Edit posts, Profile, Settings
- **Public routes**: Home, individual post viewing

### Appwrite Integration
- Uses Appwrite SDK v18 for authentication and database operations
- Configuration centralized in `src/config/appwrite.js`
- User sessions managed with local caching for performance
- Database operations follow Appwrite's document-based structure

### UI Component System
- Built on shadcn/ui components (New York style) with Tailwind CSS v3
- Configured via `components.json` for component management
- Dark mode support with CSS custom properties
- Components use class-variance-authority for consistent styling
- Available components: button, card, input, dialog, avatar, dropdown-menu, label, textarea, alert, badge, separator, switch, form, select, table
- All pages and components now use shadcn/ui consistently

## Important Development Notes

### State Management
- Posts are cached in Redux with a `fetched` flag to prevent unnecessary API calls
- Authentication state includes loading indicators for better UX
- Local storage used for user session persistence

### Authentication Flow
1. App startup checks for existing session via `useAuthCheck`
2. User data cached locally for performance
3. Protected routes redirect to login if unauthenticated
4. Session management handles both single session and all session cleanup

### Vite Configuration
- Development server configured with `host: true` for network access
- Path alias `@/` configured for clean imports
- React plugin enabled for JSX support

### Deployment
- Firebase hosting configured to serve from `dist/` directory
- SPA routing handled with rewrite rules to `index.html`
- Build assets optimized via Vite's production build