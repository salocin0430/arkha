# AI Assistant Context Prompt for ARKHA Project

## 🚀 Quick Start Prompt

Copy and paste this prompt when starting a new conversation with an AI assistant:

---

**I'm working on ARKHA, a 3D space habitat design application for the NASA International Space Apps Challenge. Here's the complete project context:**

## Project Overview
ARKHA allows users to design space habitats for Moon, Mars, and Deep Space missions with customizable crew size and duration. Users can load 3D models, configure mission parameters, and share designs with the community.

## Technical Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS v3.4.0
- **3D**: Three.js with @react-three/fiber and @react-three/drei
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Architecture**: Clean Architecture implementation
- **State**: Zustand (planned)

## Current Status
✅ **COMPLETED**: Authentication, protected routes, persistent navbar, mission dashboard, gallery, profile, responsive design, Supabase integration
🚧 **IN PROGRESS**: 3D model loading, space neighborhood algorithm, mission validation

## Key Architecture Decisions
- Uses Supabase `auth.users` table (not custom users table)
- Email confirmation disabled for development
- Clean Architecture with domain/application/infrastructure layers
- Persistent navbar with transparent background (no backdrop-blur to prevent text ghosting)
- All content fits in viewport (h-screen, h-full) with pt-32 padding for navbar clearance

## Color Palette
- Electric Blue: #0042A6 (Primary)
- Deep Blue: #07173F (Secondary) 
- Neon Yellow: #EAFE07 (Accent)
- Background: linear-gradient(135deg, #0042A6 0%, #07173F 100%)

## Important Files
- `src/app/layout.tsx` - Root layout with PersistentNavbar
- `src/components/PersistentNavbar.tsx` - Fixed navigation
- `src/components/NavbarContent.tsx` - Dynamic nav content
- `src/hooks/useAuth.ts` - Authentication management
- `src/components/ProtectedRoute.tsx` - Route protection
- `src/app/mission-builder/new/page.tsx` - Mission configuration
- `src/app/gallery/page.tsx` - Public missions with improved card design

## Development Setup
- Port: http://localhost:3000 (or 3001 if busy)
- Network: http://192.168.1.2:3000 (accessible from other devices)
- Environment: .env.local with Supabase credentials

## Next Priority
Implement 3D model loading and manipulation using Three.js, then build the space neighborhood construction algorithm.

**Please help me continue development from this point. The UI/UX foundation is complete and working perfectly.**

---

## 📋 Additional Context for Specific Tasks

### For 3D Development
- Need to integrate Three.js scene in mission builder
- Load GLTF/GLB and OBJ models
- Implement object selection, transformation (translate, rotate, scale)
- Add camera controls (orbit, first-person/keyboard)
- Build space neighborhood algorithm for module joining

### For Backend Development
- Supabase is already configured
- Clean Architecture is implemented
- Need to add mission CRUD operations
- Implement real-time collaboration features

### For UI/UX Improvements
- All basic pages are complete and responsive
- Gallery has modern card design with animations
- Navbar is persistent and optimized
- Need to enhance 3D interface when implemented

### For Testing
- Application is accessible via network URL for device testing
- All authentication flows work correctly
- Protected routes are properly implemented
- No known bugs in current implementation

---

**Use this context to understand the project state and continue development appropriately.**
