# ARKHA - NASA Space Apps Challenge Project

## 🚀 Project Overview

**ARKHA** is a 3D space habitat design application for the NASA International Space Apps Challenge. The application allows users to design, configure, and visualize space habitats for different missions (Moon, Mars, Deep Space) with customizable parameters like crew size and mission duration.

## 🎯 Core Functionality

### Main Features
- **3D Habitat Design**: Load and manipulate 3D models from SketchUp or other 3D engines
- **Space Neighborhood Algorithm**: Pre-construct space neighborhoods by joining multiple modules horizontally and vertically
- **Mission Configuration**: Set parameters like crew size, mission duration, destination
- **Validation Rules**: Prevent incorrect module placements (e.g., radioactive modules near dormitories)
- **3D Interaction**: Object selection, transformation (translate, rotate, scale), camera controls
- **User Management**: Login/signup, save missions, explore public missions
- **Social Features**: Mini social network for sharing and exploring community designs

### User Flow
1. **Home Page** → **Login/Signup** → **Mission Configuration** → **3D Design** → **Save/Share**

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **3D Library**: Three.js with @react-three/fiber and @react-three/drei
- **Styling**: Tailwind CSS v3.4.0
- **State Management**: Zustand (planned)
- **Language**: TypeScript

### Backend & Database
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Database**: PostgreSQL (managed by Supabase)
- **Authentication**: Supabase Auth using `auth.users` table
- **Architecture**: Clean Architecture implementation

### Clean Architecture Structure
```
src/
├── domain/           # Business entities and rules
├── application/      # Use cases and services
├── infrastructure/   # External implementations (Supabase)
└── interface/        # API routes and UI components
```

## 🎨 Design System

### Color Palette
- **Electric Blue**: `#0042A6` (Primary)
- **Deep Blue**: `#07173F` (Secondary)
- **Neon Yellow**: `#EAFE07` (Accent)
- **Rocket Red**: `#FF0000`
- **Martian Red**: `#CC0000`
- **White**: `#FFFFFF`

### Background Gradient
```css
background: linear-gradient(135deg, #0042A6 0%, #07173F 100%);
```

### Typography
- **Font Sizes**: Responsive scaling (text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl)
- **Font Weights**: font-medium, font-semibold, font-bold

## 📁 Project Structure

```
arkha/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── login/page.tsx     # Login page
│   │   ├── signup/page.tsx    # Signup page
│   │   ├── mission-builder/   # Mission dashboard and configuration
│   │   ├── gallery/page.tsx   # Public missions gallery
│   │   ├── profile/page.tsx   # User profile
│   │   ├── layout.tsx         # Root layout with PersistentNavbar
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable UI components
│   │   ├── PersistentNavbar.tsx    # Fixed navigation bar
│   │   ├── NavbarContent.tsx       # Dynamic navbar content
│   │   ├── ProtectedRoute.tsx      # Route protection wrapper
│   │   └── Navbar.tsx              # Legacy navbar (deprecated)
│   ├── hooks/                 # Custom React hooks
│   │   └── useAuth.ts         # Authentication state management
│   ├── infrastructure/        # External service implementations
│   │   └── external/
│   │       └── SupabaseClient.ts
│   ├── application/           # Business logic and services
│   │   └── services/
│   │       └── AppService.ts
│   └── domain/                # Business entities
├── public/                    # Static assets
│   ├── icono-arkha-blanco.png # Navbar logo
│   └── logo-arkha-blanco.png  # Home page logo
├── .env.local                 # Environment variables
└── package.json
```

## 🔧 Key Components

### PersistentNavbar
- **Purpose**: Fixed navigation bar that persists across all pages
- **Features**: 
  - Logo (clickable to home)
  - Dynamic content based on authentication status
  - Transparent background with semi-transparent blue overlay
  - No backdrop-blur to prevent text ghosting

### NavbarContent
- **Purpose**: Dynamic navigation content that changes based on auth status
- **Authenticated**: Dashboard, New Mission, Gallery, Profile, Logout
- **Public**: NASA DATA, Login, Sign Up

### ProtectedRoute
- **Purpose**: Wrapper component for protected pages
- **Functionality**: Redirects unauthenticated users to login

### useAuth Hook
- **Purpose**: Centralized authentication state management
- **Features**: User state, loading state, signOut function
- **Integration**: Supabase Auth with localStorage backup

## 🎨 UI/UX Features

### Layout Principles
- **No Scroll Design**: All content fits within viewport (h-screen, h-full)
- **Consistent Spacing**: pt-32 for content below navbar, p-6 for padding
- **Background Effects**: Glow effects with blur and opacity
- **Responsive Design**: Mobile-first approach with md: breakpoints

### Animation & Effects
- **Hover Effects**: Scale transforms, color transitions
- **Loading States**: Pulse animations, spinners
- **Background Glow**: Multiple blur effects for depth
- **Smooth Transitions**: CSS transitions for all interactive elements

## 🔐 Authentication Flow

### Supabase Integration
- **Auth Table**: Uses `auth.users` (not custom users table)
- **Email Confirmation**: Disabled for development
- **Session Management**: Automatic with localStorage backup
- **User Data**: Stored in user_metadata

### Route Protection
- **Public Routes**: /, /login, /signup
- **Protected Routes**: /mission-builder/*, /gallery, /profile
- **Redirect Logic**: Automatic redirect to login for unauthenticated users

## 🚀 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Commands
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
```

### Network Access
- **Local**: http://localhost:3000 (or 3001 if 3000 is busy)
- **Network**: http://192.168.1.2:3000 (accessible from other devices on same WiFi)

## 📋 Current Status

### ✅ Completed Features
- [x] Home page with ARKHA branding
- [x] User authentication (login/signup)
- [x] Protected routes
- [x] Persistent navigation
- [x] Mission dashboard
- [x] Mission configuration page
- [x] Gallery with improved card design
- [x] User profile page
- [x] Responsive design
- [x] Clean Architecture implementation
- [x] Supabase integration
- [x] Network access for testing

### 🚧 In Progress
- [ ] 3D model loading and manipulation
- [ ] Space neighborhood algorithm
- [ ] Mission validation rules
- [ ] 3D interaction controls
- [ ] Mission saving and sharing

### 📝 Known Issues & Solutions
1. **Text Ghosting in Navbar**: Fixed by removing backdrop-blur-sm
2. **Content Behind Navbar**: Fixed with pt-32 padding
3. **Duplicate Navbars**: Fixed by removing local Navbar components
4. **Authentication State**: Fixed with useAuth hook and ProtectedRoute

## 🎯 Next Steps

### Immediate Priorities
1. **3D Engine Integration**: Implement Three.js scene with model loading
2. **Mission Builder**: Complete the 3D design interface
3. **Algorithm Implementation**: Space neighborhood construction logic
4. **Validation System**: Module placement rules and warnings

### Future Enhancements
1. **Real-time Collaboration**: Multi-user design sessions
2. **Advanced 3D Features**: Physics simulation, lighting
3. **Export Functionality**: 3D model export, mission reports
4. **Mobile Optimization**: Touch controls for 3D manipulation

## 🔗 Important Files

### Core Components
- `src/app/layout.tsx` - Root layout with PersistentNavbar
- `src/components/PersistentNavbar.tsx` - Fixed navigation
- `src/components/NavbarContent.tsx` - Dynamic nav content
- `src/hooks/useAuth.ts` - Authentication management
- `src/components/ProtectedRoute.tsx` - Route protection

### Key Pages
- `src/app/page.tsx` - Home page
- `src/app/login/page.tsx` - Login form
- `src/app/signup/page.tsx` - Registration form
- `src/app/mission-builder/page.tsx` - Dashboard
- `src/app/mission-builder/new/page.tsx` - Mission configuration
- `src/app/gallery/page.tsx` - Public missions
- `src/app/profile/page.tsx` - User profile

### Styling
- `src/app/globals.css` - Global styles and Tailwind config
- All components use Tailwind CSS classes
- Consistent color palette and spacing system

## 📞 Support Context

When continuing development with a new AI assistant, provide this context and mention:
- The project is for NASA Space Apps Challenge
- Clean Architecture is implemented
- Supabase is used for backend
- Next.js 14 with App Router
- Tailwind CSS for styling
- Current focus is on 3D functionality implementation
- All authentication and basic UI is complete

---

**Last Updated**: January 2025
**Project Status**: Core UI/UX Complete, 3D Implementation Pending
**Next Milestone**: 3D Model Loading and Manipulation
