# 🎬 CinemaY - Full-Stack Movie & Series Rating Portal

> A high-performance, modular entertainment platform for movies & TV series 🌟

CinemaY is a robust and scalable platform where users can explore, rate, and review movies and TV series. This project integrates a secure authentication system, a premium subscription model, and a comprehensive admin dashboard to manage content and moderate community interactions.

---

## 📂 Backend Project Structure

Following a **Feature-Based Modular Architecture**, the backend is organized for maximum maintainability and scalability.

```text
src/
├── 👨‍💼 admin/          # Admin-only management logic & dashboard analytics
├── 🔐 auth/           # Authentication handlers (Better Auth/Social Login)
├── 💬 comment/        # Review comments & threaded discussions
├── ⚠️  error/          # Centralized error handling & logging middleware
├── 📜 history/        # User watch history & activity tracking
├── 📚 lib/            # Prisma client & Better Auth configurations
├── 🎥 media/          # Movies and Series core logic (CRUD Operations)
├── 💳 payment/        # SSLCommerz & Stripe payment gateway integration
├── 🛒 purchase/       # Content rental & subscription management
├── ⭐ review/         # Movie rating (1-10) & review publication system
├── 🔧 scripts/        # Database seeding & automation tasks
├── 📦 types/          # TypeScript interfaces & global type definitions
├── 👤 user/           # User profile management & account settings
├── 🛠️  utils/          # Reusable helper functions & constants
├── 🔖 watchlist/      # Personal user watchlists
├── 📱 app.ts          # Express application & global middleware setup
└── 🚀 server.ts       # Entry point - HTTP Server listener
```

---

## 🛠️ Technology Stack

### 🎨 Frontend
- **Framework:** Next.js (App Router, SSR/SSG)
- **Styling:** Tailwind CSS (Responsive Design)
- **State Management:** React Context / TanStack Query
- **Authentication:** Better Auth (Client-side sync)

### ⚙️ Backend
- **Runtime:** Node.js (TypeScript)
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Security:** JWT & OAuth 2.0 (Google Login)
- **Payments:** SSLCommerz / Stripe Integration

---

## ✨ Functional Requirements

### 👤 User Roles

#### 🧑‍💻 Regular User
- ✅ Secure Social/Email login
- ✅ Browse/Filter by genre, year, or rating
- ✅ Rate (1-10 stars) and write reviews (with spoiler toggles)
- ✅ Like/Comment on reviews and manage a personal Watchlist
- ✅ Purchase/Rent premium titles

#### 👨‍⚖️ Admin User
- ✅ Manage media library (Title, Cast, Streaming links)
- ✅ Moderate (Approve/Unpublish) reviews and comments
- ✅ Access sales and rental analytics

---

## 🚀 Core Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Password hashing with JWT session management via Better Auth |
| 💬 **Review System** | Admin-moderated community feedback with interactive likes/comments |
| 💳 **Payment System** | Secure integration for monthly/yearly subscriptions |
| 🔍 **Advanced Search** | Real-time filtering by title, director, or cast |

---

## 🚦 API Documentation (Media Module)

### 📥 Get All Media

Fetches a paginated list of media entries with advanced filtering.

**Endpoint:** `GET /api/media`

**Query Parameters:**
- `search` - Title, director, or cast keywords
- `genre` - Categories like Action, Drama, etc.
- `type` - MOVIE or SERIES
- `rating` - Minimum average rating

---

## 💻 Sample Implementation

### Media Service (`src/media/media.service.ts`)

```typescript
import { prisma } from "../lib/prisma";

export const getAllMediaService = async (filters: any) => {
    const { search, genre, type, rating } = filters;
    
    return await prisma.media.findMany({
        where: {
            title: { contains: search, mode: 'insensitive' },
            genre: genre ? { has: genre } : undefined,
            type: type,
            avgRating: { gte: Number(rating) || 0 }
        },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { reviews: true }
            }
        }
    });
};
```

---

## 📦 Installation & Setup

### 🔄 Clone & Install

```bash
git clone https://github.com/yourusername/cinemay.git
cd cinemay/backend && npm install
```

### 📋 Environment Configuration

Create a `.env` file in the root directory and configure the following variables:

```env
# Server Configuration
PORT=5000

# Database Configuration
DATABASE_URL="postgresql://user:pass@localhost:5432/cinemay"

# Authentication Configuration
BETTER_AUTH_SECRET="your_secret"
BETTER_AUTH_URL="http://localhost:5000"
GOOGLE_CLIENT_ID="your_id"
GOOGLE_CLIENT_SECRET="your_secret"

# Frontend Configuration
APP_URL="http://localhost:3000"
```

### 🗄️ Database Sync

```bash
npx prisma generate
npx prisma migrate dev
```

### 🚀 Development Mode

```bash
npm run dev
```

---

## 📘 Project Structure Overview

```
CinemaY Backend/
├── 📁 src/
│   ├── 👨‍💼 admin/              - Admin dashboard & analytics
│   ├── 🔐 auth/               - Authentication & authorization
│   ├── 💬 comment/            - Comments management
│   ├── ⚠️  error/              - Error handling utilities
│   ├── 📜 history/            - Watch history tracking
│   ├── 📚 lib/                - External libraries & configs
│   ├── 🎥 media/              - Media CRUD operations
│   ├── 💳 payment/            - Payment processing
│   ├── 🛒 purchase/           - Purchase/Rental logic
│   ├── ⭐ review/             - Review & rating system
│   ├── 🔧 scripts/            - Utility scripts
│   ├── 📦 types/              - TypeScript definitions
│   ├── 👤 user/               - User management
│   ├── 🛠️  utils/              - Helper functions
│   ├── 🔖 watchlist/          - Watchlist management
│   ├── 📱 app.ts              - Express app setup
│   └── 🚀 server.ts           - Server entry point
├── 🗄️ prisma/
│   ├── 📄 schema.prisma       - Database schema
│   └── 📂 migrations/         - Migration history
├── 📦 package.json
└── 📖 README.md
```

---

## 🎯 Key Highlights

✨ **Modular Architecture** - Feature-based organization for easy maintenance
🔒 **Security First** - JWT, OAuth integration, role-based access control
⚡ **Performance** - Optimized queries with Prisma ORM
🌍 **Scalability** - Ready for production deployment
🎨 **Clean Code** - TypeScript for type safety

---

## 👨‍💻 Author

**Sakib Hossain**  
Full-Stack Developer & Programming Enthusiast

---

## 📞 Support & Contact

For queries or suggestions, feel free to reach out or create an issue in the repository.

---

<div align="center">

### ⭐ If you found this helpful, consider giving it a star! ⭐

</div>