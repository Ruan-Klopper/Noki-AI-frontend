<div align="center">

![Noki Celebration](./public/mascot/Noki_Celebration.gif)

# Noki AI

**The Ultimate Study Buddy - Full Stack SaaS Application**

</div>

---

## 🔗 Links and Navigation

| Repository                          | Link                                                                                                                  |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Noki AI Frontend** (You are here) | [https://github.com/Ruan-Klopper/Noki-AI-frontend](https://github.com/Ruan-Klopper/Noki-AI-frontend)                  |
| **Noki AI Backend**                 | [https://github.com/Ruan-Klopper/Noki-AI-backend](https://github.com/Ruan-Klopper/Noki-AI-backend)                    |
| **Noki AI AI Server**               | [https://github.com/Ruan-Klopper/Noki-AI-AIServer](https://github.com/Ruan-Klopper/Noki-AI-AIServer)                  |
| **Visit the Live Project**          | [https://app.noki.co.za/](https://app.noki.co.za/)                                                                    |
| **Demo Video**                      | To be added                                                                                                           |
| **User Testing Results**            | [Google Sheets](https://docs.google.com/spreadsheets/d/1MwrDLTHMpx5Lyr39LikJZwYCakbMTrx-Na-J83-EfjQ/edit?usp=sharing) |
| **Figma Planning File**             | [Figma Design](https://www.figma.com/design/V9tvA15c6ovCnKKT1fdT6r/Noki-AI?node-id=0-1&t=nT9i8QVTn6hoE5eB-1)          |

---

## 🎯 The Problem

I always struggled with time management, and I wasted time adding all of my Canvas assignments to places like Trello or my notes app on Mac. It all really just wasn't working for me. Additionally, the Canvas LMS UI is truly just not great. So I wanted to build a solution that would solve all of these issues.

---

## 📝 Project Description

Noki AI is the ultimate study buddy - a full-stack SaaS application oriented for students or people who need additional help with time management. That's why I created Noki AI. You have the option to sync your Canvas courses and assignments to Noki, where you can clearly see all of your assignments with a much better UI than Canvas LMS. It's super easy to create projects, tasks, and todos. And not only that, you can ask Noki AI to create a todo list for you, which you can modify. You can also ask Noki to explain an assignment to you.

---

## ✨ Features

### Current Features (v1.0.0)

- **Mascot in Todo Sidenav**: A friendly mascot that motivates you while you work
- **Chat with Noki** (Currently in Beta v1.0.0):
  - Ask it to explain assignments & tasks
  - Ask it to create todos for your tasks
- **Sync Canvas Information**:
  - Sync all of your active courses and assignments
  - Better UI than Canvas LMS
  - Easy project, task, and todo creation

---

## 🚀 Features to Add in the Future

1. **Optimize and Improve AI Chatbot**

   - Follow-up questions
   - Add context like files to the AI chatbot (RAG)
   - _Requested by one of the user testers_

2. **Sync More Canvas Information**

   - Modules and data
   - PDF documents and presentations
   - Resources for better AI context and explanations

3. **AI Chatbot Intents**

   - Implemented but removed and placed on hold due to time constraints
   - Intents so that the AI chatbot can request additional information from the backend to provide users with even better answers

4. **Email Reminders**

   - Reminders when you have a task due tomorrow
   - Alerts for overdue tasks

5. **Notes on Tasks and Projects**

   - Add notes to tasks and projects
   - Add resources like PDF files or similar to projects and tasks
   - Keep things more organized

6. **Move to AWS**

   - Better control and more AI features
   - Easier implementation than the current implementation
   - RAG (Retrieval-Augmented Generation)
   - S3 buckets for file storage

7. **Sync with Blackboard**
   - Not only Canvas but also Blackboard data syncing
   - Support for multiple LMS platforms

---

## 📊 User Testing Results

### Positive Feedback

1. **Authentication**: Users found the authentication seamless. The Google OAuth really made things easier.
2. **Canvas Integration**: Canvas integration was easy and seamless.
3. **User Interface**: Users liked the User Interface of Noki AI.
4. **Navigation**: Navigation in the app was seamless from all responses.

### Issues Identified

1. **Performance**: The animations used from React Bits caused a bit of lag on certain machines (login & sign up screens background).
2. **Canvas Sync Time**: Canvas integration took a while to sync all data, only happens if you have a lot of courses and assignments.
3. **Timetable Day View**: Suggestion for the day view in the timetable page: _"The day schedule I think can be a slightly less stretched it felt really long when scrolling for some reason"_ - Will redesign the app to be more compact, or set the start time to automatically calculate what the first task/todo time is.

### AI Service Feedback

At the time of the user testing for the first two users, the AI service wasn't implemented just yet. However, I did another user test where the AI service was working, and the person suggested:

- **Files Upload**: _"Files upload, like to check if your 'project' matches the assignment description"_ to see if you're doing your work correctly.

### Additional Suggestions

Comments for further improvements or additional features for Noki AI:

1. **Document upload to chat service, follow-up questions in the AI service**
2. **Trello type UI**
3. **Semester Overview**: Maybe you upload or view the semester overviews and make it ask questions about the assignments, and it either contacts lecturer with that problem or answers it for you.

### View All User Testing Results

All responses from the user testing are available in this Google Sheets document:
👉 [User Testing Results](https://docs.google.com/spreadsheets/d/1MwrDLTHMpx5Lyr39LikJZwYCakbMTrx-Na-J83-EfjQ/edit?usp=sharing)

### Want to Contribute to User Testing?

Help us improve Noki AI by participating in our user testing:
👉 [Google Forms - User Testing](https://forms.gle/NX1At39irdDk5g3L7)

---

## 📐 Planning Phase

1. **Exploring New Technologies**: I wanted to explore new technologies that I had never worked with before.
2. **Architecture Decision**: So I decided to go with a full-stack microservices architecture project style.
3. **Figma Planning**: All of my planning that I did, all data, interface and features I've planned in Figma, which you can view:
   - [Figma Design File](https://www.figma.com/design/V9tvA15c6ovCnKKT1fdT6r/Noki-AI?node-id=0-1&t=nT9i8QVTn6hoE5eB-1)
4. **Canvas API Testing**: Before I went all in with my planning phase, I first tested the Canvas public API in Postman to see if something like this would be possible.
5. **UX/UI Design Inspiration**: For the UX/UI design, I went to Dribbble to look for nice-looking UI designs that I could use.
6. **Mascot Integration**: During that phase, I also decided to integrate a Noki Mascot to this project to make the project a bit fun to use.

---

## 🚀 Deployment

### Infrastructure

1. **Backend & AI Service**:

   - Deployed on **Railway** along with the PostgreSQL database
   - Chosen for CI/CD integration and super easy setup
   - Fast to deploy - just had to set up the Docker file correctly so that the app builds correctly

2. **Frontend**:

   - The only service deployed on **Vercel**
   - Optimal for Next.js applications

3. **Domain Configuration**:
   - Purchased the `noki.co.za` domain
   - Configured subdomains for each project:
     - Frontend: `app.noki.co.za`
     - Backend: `youdidnttest.noki.co.za`
     - AI Server: `noidea.noki.co.za` (to be confirmed)

### Architecture Overview

```
Frontend (app.noki.co.za - Vercel)
    ↓
Backend API (youdidnttest.noki.co.za - Railway)
    ↓
AI Server (noidea.noki.co.za - Railway)
    ↓
PostgreSQL Database (Railway)
```

---

---

# Noki AI Frontend Repository

<div align="center">

**An intelligent time management and productivity platform powered by AI - Frontend Implementation**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-app.noki.co.za-blue)](https://app.noki.co.za)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/Ruan-Klopper/Noki-AI-frontend)
[![License](https://img.shields.io/badge/License-Private-red)](LICENSE)

_Built with ❤️ by [Ruan Klopper](https://github.com/Ruan-Klopper)_

</div>

---

## 📋 Table of Contents

- [Getting Started](#-getting-started)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Pages](#-pages)
- [API Endpoints](#-api-endpoints)
- [JWT Authentication](#-jwt-authentication)
- [IndexedDB Storage](#-indexeddb-storage)
- [Usage](#-usage)
- [Contributing](#-contributing)

---

## 🚀 Getting Started

Noki AI Frontend is a comprehensive time management application frontend built with Next.js 14. It provides a modern, responsive user interface with offline capabilities, seamless authentication, and AI-powered productivity features.

### Quick Links

- **Live Application**: [app.noki.co.za](https://app.noki.co.za)
- **Backend Repository**: [Noki-AI-Backend](https://github.com/Ruan-Klopper/Noki-AI-backend)
- **AI Server Repository**: [Noki-AI-AIServer](https://github.com/Ruan-Klopper/Noki-AI-aiserver)

### Architecture Overview

```
Frontend (app.noki.co.za)
    ↓
Backend API (youdidnttest.noki.co.za)
    ↓
AI Server (noidea.noki.co.za)
```

---

## ✨ Features

### Authentication & Security

- **Google OAuth 2.0 Integration**: Seamless sign-in with Google accounts

  - Client-side token verification
  - Automatic user profile synchronization
  - Secure token management

- **JWT-Based Authentication**: Secure token-based authentication system
  - Bearer token authentication for all API requests
  - Automatic token expiration handling
  - Secure cookie-based token storage
  - User session management

### Data Management

- **IndexedDB Storage**: Fast, client-side database for offline capabilities
  - Stores projects, tasks, and todos locally
  - Efficient CRUD operations with indexing
  - Automatic data synchronization
  - Better performance than localStorage or Cache Storage
  - Supports complex queries and relationships

### Core Functionality

- **Project Management**: Create, update, archive, and restore projects
- **Task Management**: Organize tasks within projects with priorities and due dates
- **Todo Management**: Break down tasks into actionable todos
- **AI Chat Interface**: Interactive AI assistant for productivity guidance
- **Timetable Management**: Visual schedule management with events
- **Canvas LMS Integration**: Sync assignments and courses from Canvas

### User Experience

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Built-in theme switching
- **Real-time Updates**: Instant UI updates with optimistic rendering
- **Offline Support**: Access cached data when offline
- **Error Handling**: Comprehensive error handling with user-friendly messages

---

## 🛠 Tech Stack

### Core Framework

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
  - Server-side rendering (SSR)
  - Static site generation (SSG)
  - API routes for backend integration
  - Optimized performance and SEO

### UI & Styling

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework

  - Custom design system
  - Responsive layouts
  - Dark mode support

- **[ShadCN UI](https://ui.shadcn.com/)** - High-quality React components

  - Accessible components built on Radix UI
  - Customizable design system
  - Type-safe component props

- **[Ant Design 5](https://ant.design/)** - Enterprise-grade UI components
  - Rich component library
  - Data visualization components
  - Form validation and input handling

### State Management & Data

- **React Hooks** - Custom hooks for service integration
- **IndexedDB** - Client-side database for offline storage
- **Cookie-based Storage** - Secure token and user data storage

### Form Handling

- **[React Hook Form](https://react-hook-form.com/)** - Performant form library
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### Date & Time

- **[date-fns](https://date-fns.org/)** - Modern JavaScript date utility library
- **[dayjs](https://day.js.org/)** - Lightweight date manipulation library

### Development Tools

- **TypeScript** - Type-safe JavaScript
- **ESLint** - Code linting
- **PostCSS** - CSS processing

### Additional Libraries

- **Lucide React** - Beautiful icon library
- **Recharts** - Composable charting library
- **Sonner** - Toast notifications
- **Next Themes** - Theme management

---

## 📦 Installation

### Prerequisites

- **Node.js** 18.x or higher
- **npm**, **yarn**, or **pnpm** package manager
- **Git** for version control

### Step 1: Clone the Repository

```bash
git clone https://github.com/Ruan-Klopper/Noki-AI-frontend.git
cd Noki-AI-frontend
```

### Step 2: Install Dependencies

Using npm:

```bash
npm install
```

Using yarn:

```bash
yarn install
```

Using pnpm (recommended):

```bash
pnpm install
```

### Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp ENV_VARIABLES.md .env.local
```

Edit `.env.local` with your actual values (see [Environment Variables](#-environment-variables) section).

### Step 4: Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 5: Build for Production

```bash
npm run build
npm run start
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required Variables

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**How to get Google Client ID:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Credentials
3. Create OAuth 2.0 Client ID
4. Add authorized JavaScript origins and redirect URIs

### Optional Variables

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://youdidnttest.noki.co.za
NEXT_PUBLIC_APP_ENV=production

# Feature Flags
NEXT_PUBLIC_DEV_MODE=false
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG=false

# Canvas LMS Integration (Optional)
NEXT_PUBLIC_CANVAS_API_URL=your-canvas-instance-url
NEXT_PUBLIC_CANVAS_API_KEY=your-canvas-api-key
```

### Environment-Specific Configuration

The application automatically configures itself based on `NODE_ENV`:

- **Development**: `http://localhost:3000` (30s timeout, 3 retries)
- **Production**: `https://youdidnttest.noki.co.za` (30s timeout, 2 retries)
- **Test**: `http://localhost:3000` (30s timeout, 1 retry)

> **Note**: Never commit `.env.local` or `.env` files to git. They are already in `.gitignore`.

---

## 📄 Pages

The application includes the following pages:

### Authentication Pages

- **`/signin`** - User sign-in page

  - Email/password authentication
  - Google OAuth integration
  - [Image placeholder: Sign-in page screenshot]

- **`/signup`** - User registration page
  - New user account creation
  - Form validation
  - [Image placeholder: Sign-up page screenshot]

### Main Application Pages

- **`/` (Home)** - Landing/redirect page

  - Automatic authentication check
  - Data initialization
  - Redirects to dashboard

- **`/dashboard`** - Main dashboard

  - Overview of projects, tasks, and todos
  - Quick actions and statistics
  - [Image placeholder: Dashboard screenshot]

- **`/projects`** - Projects management page

  - List all projects
  - Create, edit, delete projects
  - Project archiving and restoration
  - [Image placeholder: Projects page screenshot]

- **`/chat`** - AI chat interface

  - Interactive AI assistant
  - Conversation history
  - Context-aware responses
  - [Image placeholder: Chat interface screenshot]

- **`/timetable`** - Schedule management

  - Visual calendar view
  - Event creation and management
  - Day/week view options
  - [Image placeholder: Timetable screenshot]

- **`/settings`** - User settings page

  - Profile management
  - Preferences
  - Account settings
  - [Image placeholder: Settings page screenshot]

- **`/getting-started`** - Onboarding guide
  - First-time user tutorial
  - Feature introduction
  - [Image placeholder: Getting started screenshot]

### Development/Test Pages

- **`/test-data`** - Data testing interface

  - Development tools
  - Data inspection
  - [Image placeholder: Test data page screenshot]

- **`/antd-test`** - Ant Design component testing
  - Component showcase
  - UI testing
  - [Image placeholder: Ant Design test page screenshot]

---

## 🔌 API Endpoints

The frontend communicates with the backend API at `https://youdidnttest.noki.co.za` (configurable via `NEXT_PUBLIC_API_URL`).

### Authentication Endpoints

| Method | Endpoint             | Description                    | Auth Required |
| ------ | -------------------- | ------------------------------ | ------------- |
| `POST` | `/auth/login`        | User login with email/password | No            |
| `POST` | `/auth/register`     | Create new user account        | No            |
| `POST` | `/auth/google/token` | Google OAuth token exchange    | No            |
| `GET`  | `/auth/profile`      | Get user profile information   | Yes           |

### Project Endpoints

| Method   | Endpoint                       | Description                  | Auth Required |
| -------- | ------------------------------ | ---------------------------- | ------------- |
| `GET`    | `/projects`                    | Get all projects (paginated) | Yes           |
| `GET`    | `/projects/:id`                | Get single project by ID     | Yes           |
| `POST`   | `/projects/create_project`     | Create new project           | Yes           |
| `PUT`    | `/projects/update_project/:id` | Update project               | Yes           |
| `DELETE` | `/projects/delete_project/:id` | Delete project               | Yes           |
| `POST`   | `/projects/:id/duplicate`      | Duplicate project            | Yes           |
| `PATCH`  | `/projects/:id/archive`        | Archive project              | Yes           |
| `PATCH`  | `/projects/:id/restore`        | Restore archived project     | Yes           |

### Task Endpoints

| Method   | Endpoint                   | Description           | Auth Required |
| -------- | -------------------------- | --------------------- | ------------- |
| `POST`   | `/tasks/create_task`       | Create new task       | Yes           |
| `PUT`    | `/tasks/update_task/:id`   | Update task           | Yes           |
| `DELETE` | `/tasks/delete_task/:id`   | Delete task           | Yes           |
| `PUT`    | `/tasks/complete_task/:id` | Mark task as complete | Yes           |

### Todo Endpoints

| Method   | Endpoint                     | Description           | Auth Required |
| -------- | ---------------------------- | --------------------- | ------------- |
| `POST`   | `/todos/create_todo/:taskId` | Create todo for task  | Yes           |
| `PUT`    | `/todos/update_todo`         | Update todo           | Yes           |
| `DELETE` | `/todos/delete_todo`         | Delete todo           | Yes           |
| `PUT`    | `/todos/complete_todo/:id`   | Mark todo as complete | Yes           |

### Timetable Endpoints

| Method   | Endpoint                           | Description                 | Auth Required |
| -------- | ---------------------------------- | --------------------------- | ------------- |
| `GET`    | `/timetable`                       | Get user timetable          | Yes           |
| `PATCH`  | `/timetable`                       | Update timetable            | Yes           |
| `GET`    | `/timetable/events`                | Get all events              | Yes           |
| `POST`   | `/timetable/events`                | Create new event            | Yes           |
| `PUT`    | `/timetable/events/:id`            | Update event                | Yes           |
| `DELETE` | `/timetable/events/:id`            | Delete event                | Yes           |
| `GET`    | `/timetable/events/day/:dayOfWeek` | Get events for specific day | Yes           |
| `GET`    | `/timetable/events/range`          | Get events in date range    | Yes           |
| `POST`   | `/timetable/events/:id/duplicate`  | Duplicate event             | Yes           |

### Canvas LMS Endpoints

| Method | Endpoint            | Description                              | Auth Required |
| ------ | ------------------- | ---------------------------------------- | ------------- |
| `POST` | `/canvas/setup`     | Configure Canvas integration             | Yes           |
| `POST` | `/canvas/link-data` | Link Canvas data (with extended timeout) | Yes           |

### AI Service Endpoints

| Method   | Endpoint                                        | Description              | Auth Required |
| -------- | ----------------------------------------------- | ------------------------ | ------------- |
| `GET`    | `/ai/get_all_conversations`                     | Get all AI conversations | Yes           |
| `GET`    | `/ai/get_conversation_history/:conversation_id` | Get conversation history | Yes           |
| `POST`   | `/ai/new_conversation`                          | Create new conversation  | Yes           |
| `POST`   | `/ai/chat`                                      | Send chat message        | Yes           |
| `PATCH`  | `/ai/rename_conversation/:conversation_id`      | Rename conversation      | Yes           |
| `DELETE` | `/ai/delete_conversation/:conversation_id`      | Delete conversation      | Yes           |

### Miscellaneous Endpoints

| Method | Endpoint              | Description                                | Auth Required |
| ------ | --------------------- | ------------------------------------------ | ------------- |
| `GET`  | `/misc/all-user-data` | Get all user data (projects, tasks, todos) | Yes           |

### User Endpoints

| Method   | Endpoint                 | Description         | Auth Required |
| -------- | ------------------------ | ------------------- | ------------- |
| `GET`    | `/users/profile`         | Get user profile    | Yes           |
| `PATCH`  | `/users/profile`         | Update user profile | Yes           |
| `POST`   | `/users/change-password` | Change password     | Yes           |
| `DELETE` | `/users/account`         | Delete user account | Yes           |
| `POST`   | `/users/avatar`          | Upload avatar image | Yes           |

### Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

The token is automatically included in all requests via the `HttpClient` service.

---

## 🔒 JWT Authentication

### Overview

The application uses JWT (JSON Web Tokens) for secure authentication. Tokens are stored in HTTP-only cookies for security.

### Token Management

#### Token Storage

- **Storage Method**: Secure cookies (via `CookieManager`)
- **Token Key**: `access_token`
- **Expiration**: 24 hours (configurable)
- **Security**: HTTP-only, SameSite=Lax, Secure in production

#### Token Flow

1. **Login/Register**: User authenticates → Backend returns JWT token
2. **Token Storage**: Token stored in secure cookie via `CookieManager.setAccessToken()`
3. **API Requests**: Token automatically included in `Authorization: Bearer <token>` header
4. **Token Validation**: Token expiration checked before each request
5. **Logout**: Token cleared from cookies and IndexedDB

### Implementation Details

#### Cookie Manager (`services/config/cookie-manager.ts`)

```typescript
// Set access token
CookieManager.setAccessToken(token);

// Get access token
const token = CookieManager.getAccessToken();

// Check if token is expired
const isExpired = CookieManager.isTokenExpired(token);

// Check authentication status
const isAuth = CookieManager.isAuthenticated();

// Clear all auth data
CookieManager.clearAllAuthData();
```

#### HTTP Client Integration

The `HttpClient` automatically adds the Bearer token to all requests:

```typescript
// services/http/index.ts
const createAuthHeaders = (): Record<string, string> => {
  const token = CookieManager.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
```

#### Auth Context (`services/auth/auth-context.tsx`)

The `AuthProvider` component manages authentication state:

```typescript
import { useAuthContext } from "@/services/auth/auth-context";

const { isAuthenticated, user, login, logout } = useAuthContext();
```

#### Token Expiration Handling

- Automatic expiration check before API requests
- Redirects to sign-in page on token expiration
- Automatic logout on expired tokens

### Security Features

- ✅ HTTP-only cookies (prevents XSS attacks)
- ✅ SameSite=Lax (prevents CSRF attacks)
- ✅ Secure flag in production (HTTPS only)
- ✅ Token expiration validation
- ✅ Automatic token cleanup on logout

---

## 💾 IndexedDB Storage

### Overview

IndexedDB is used for client-side storage of user data, providing fast access and offline capabilities. It's a better alternative to localStorage or Cache Storage for complex CRUD operations.

### Database Structure

**Database Name**: `NokiDB`  
**Version**: 1

#### Object Stores

1. **`projects`**

   - Key: `id`
   - Indexes: `user_id`, `created_at`, `source`

2. **`tasks`**

   - Key: `id`
   - Indexes: `project_id`, `user_id`, `priority`, `due_date`, `is_submitted`

3. **`todos`**

   - Key: `id`
   - Indexes: `task_id`, `user_id`, `priority`, `is_submitted`

4. **`metadata`**
   - Key: `key`
   - Stores: `lastUpdated`, `version`

### Usage

#### Initialization

```typescript
import { getIndexedDBService } from "@/services/storage/indexeddb.service";

const db = getIndexedDBService();
await db.init();
```

#### Store All Data

```typescript
// Store all user data (projects, tasks, todos)
await db.storeAllData({
  projects: projectsArray,
  tasks: tasksArray,
  todos: todosArray,
});
```

#### Query Operations

```typescript
// Get all projects
const projects = await db.getAllProjects();

// Get project by ID
const project = await db.getProject(projectId);

// Get tasks by project ID
const tasks = await db.getTasksByProjectId(projectId);

// Get todos by task ID
const todos = await db.getTodosByTaskId(taskId);

// Get tasks by user ID
const userTasks = await db.getTasksByUserId(userId);

// Get todos by user ID
const userTodos = await db.getTodosByUserId(userId);
```

#### CRUD Operations

```typescript
// Projects
await db.addProject(project);
await db.updateProject(projectId, updates);
await db.deleteProject(projectId);

// Tasks
await db.addTask(task);
await db.updateTask(taskId, updates);
await db.deleteTask(taskId);

// Todos
await db.addTodo(todo);
await db.updateTodo(todoId, updates);
await db.deleteTodo(todoId);
```

#### Data Synchronization

```typescript
// Get cached data with timestamp
const cachedData = await db.getCachedData();

// Clear all data
await db.clearAll();

// Get cache age
const age = await db.getCacheAge();
```

### Benefits

- ✅ **Performance**: Faster than localStorage for large datasets
- ✅ **Structured Storage**: Supports complex queries and relationships
- ✅ **Offline Support**: Access data without network connection
- ✅ **Indexing**: Fast lookups by user_id, project_id, task_id, etc.
- ✅ **Transactions**: Atomic operations for data consistency
- ✅ **Large Storage**: Can store much more data than localStorage

### Automatic Data Flow

1. **On Login**: All user data fetched from backend and stored in IndexedDB
2. **On Updates**: Changes synced to backend and IndexedDB updated
3. **On Offline**: Data read from IndexedDB for instant access
4. **On Logout**: All IndexedDB data cleared for security

---

## 📖 Usage

### Basic Usage Example

#### Authentication

```typescript
import { useAuth } from "@/services/hooks/useAuth";

function LoginComponent() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    const result = await login({
      email: "user@example.com",
      password: "password123",
    });

    if (result.success) {
      // Redirect to dashboard
    }
  };

  return (
    <button onClick={handleLogin} disabled={isLoading}>
      Sign In
    </button>
  );
}
```

#### Google OAuth

```typescript
import { GoogleAuth } from "@/services/auth/google-auth";

const handleGoogleSignIn = async () => {
  try {
    const idToken = await GoogleAuth.signIn();
    const result = await authService.googleAuth(idToken);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

#### Fetching User Data

```typescript
import { useMain } from "@/services/hooks/useMain";

function DashboardComponent() {
  const { fetchAllUserData, allUserData, isLoading } = useMain();

  useEffect(() => {
    fetchAllUserData();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1>Projects: {allUserData?.projects?.length}</h1>
      <h1>Tasks: {allUserData?.tasks?.length}</h1>
    </div>
  );
}
```

#### Project Management

```typescript
import { useProject } from "@/services/hooks/useProject";

function ProjectComponent() {
  const { projects, createProject, updateProject, deleteProject, isLoading } =
    useProject();

  const handleCreate = async () => {
    await createProject({
      name: "New Project",
      description: "Project description",
    });
  };

  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
}
```

#### Task Management

```typescript
import { useTask } from "@/services/hooks/useTask";

function TaskComponent() {
  const { createTask, updateTask, completeTask } = useTask();

  const handleCreateTask = async (projectId: string) => {
    await createTask({
      project_id: projectId,
      name: "New Task",
      priority: "high",
      due_date: "2024-12-31",
    });
  };
}
```

#### AI Chat

```typescript
import { useAI } from "@/services/hooks/useAI";

function ChatComponent() {
  const { sendMessage, conversations, isLoading } = useAI();

  const handleSend = async (message: string) => {
    const response = await sendMessage(message);
    // Handle AI response
  };
}
```

### Service Architecture

The application follows a service-oriented architecture:

```
Components
    ↓
Hooks (useAuth, useProject, useTask, etc.)
    ↓
Services (AuthService, ProjectService, TaskService, etc.)
    ↓
HttpClient (with JWT authentication)
    ↓
Backend API
```

### Custom Hooks Available

- `useAuth()` - Authentication operations
- `useMain()` - Fetch all user data
- `useProject()` - Project CRUD operations
- `useTask()` - Task CRUD operations
- `useTodo()` - Todo CRUD operations
- `useTimetable()` - Timetable management
- `useCanvas()` - Canvas LMS integration
- `useAI()` - AI chat functionality
- `useUser()` - User profile management

---

## 🤝 Contributing

Contributions are welcome! However, please note that this is a private project. If you have access, please follow these guidelines:

### Development Workflow

1. **Fork the Repository** (if you have access)
2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**

   - Follow the existing code style
   - Write clear commit messages
   - Add comments for complex logic

4. **Test Your Changes**

   ```bash
   npm run lint
   npm run build
   ```

5. **Commit Your Changes**

   ```bash
   git commit -m "Add amazing feature"
   ```

6. **Push to Branch**

   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**

### Code Style Guidelines

- Use TypeScript for all new code
- Follow the existing component structure
- Use functional components with hooks
- Keep components small and focused
- Add PropTypes or TypeScript types
- Write meaningful variable and function names

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists
2. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)

### Author

**Ruan Klopper**

- GitHub: [@Ruan-Klopper](https://github.com/Ruan-Klopper)
- Repository: [Noki-AI-frontend](https://github.com/Ruan-Klopper/Noki-AI-frontend)

---

## 📝 License

Private - Ruan Klopper  
This project is private and proprietary. All rights reserved.

---

## 🙏 Acknowledgments

- Inspired by Canvas LMS and Trello for time management
- Built to solve personal time management challenges
- Special thanks to all contributors and testers

---

<div align="center">

**Made with ❤️ by Ruan Klopper**

[Back to Top](#noki-ai)

</div>
