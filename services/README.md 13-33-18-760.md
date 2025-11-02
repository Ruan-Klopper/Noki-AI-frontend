# Services Architecture

This directory contains the service layer for the Noki AI frontend application, following SOLID principles and modern architectural patterns.

## 📁 Directory Structure

```
services/
├── types/           # TypeScript interfaces and types
├── config/          # API configuration and utilities
├── http/            # HTTP client implementation
├── factory/          # Service factory for dependency injection
├── env/             # Environment configuration
├── hooks/           # React hooks for service integration
├── auth/            # Authentication service
├── user/            # User management service
├── project/         # Project management service
├── timetable/       # Timetable service
└── index.ts         # Main export file
```

## 🏗️ Architecture Principles

### SOLID Principles Implementation

1. **Single Responsibility Principle (SRP)**

   - Each service handles one specific domain (auth, user, project, timetable)
   - HTTP client only handles HTTP operations
   - Token manager only handles token operations

2. **Open/Closed Principle (OCP)**

   - Services are open for extension through interfaces
   - Closed for modification through abstract base classes

3. **Liskov Substitution Principle (LSP)**

   - All service implementations can be substituted for their interfaces
   - Factory pattern ensures proper substitution

4. **Interface Segregation Principle (ISP)**

   - Small, focused interfaces (BaseService, HttpService)
   - Clients depend only on methods they use

5. **Dependency Inversion Principle (DIP)**
   - Services depend on abstractions (interfaces)
   - Factory pattern provides dependency injection

## 🚀 Usage Examples

### Basic Service Usage

```typescript
import { getAuthService, getProjectService } from "@/services";

// Get service instances
const authService = getAuthService();
const projectService = getProjectService();

// Use services
const loginResponse = await authService.login({
  email: "user@example.com",
  password: "password123",
});

const projects = await projectService.getProjects();
```

### Using Auth Context Provider

```typescript
// In your app layout or root component
import { AuthProvider } from "@/services";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

// In your components
import { useAuthContext } from "@/services";

function MyComponent() {
  const {
    isAuthenticated,
    user,
    profile,
    login,
    register,
    googleAuth,
    logout,
  } = useAuthContext();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h1>Welcome, {user?.firstname}!</h1>
          <p>Email: {user?.email}</p>
          <p>Google User: {profile?.isGoogleUser ? "Yes" : "No"}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <button
            onClick={() =>
              login({ email: "user@example.com", password: "password123" })
            }
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}
```

### Using React Hooks Directly

```typescript
import { useAuth, useProjects } from "@/services";

function MyComponent() {
  const { isAuthenticated, login, logout } = useAuth();
  const { projects, createProject, isLoading } = useProjects();

  const handleLogin = async () => {
    await login({ email: "user@example.com", password: "password123" });
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}

      {isLoading ? (
        <div>Loading projects...</div>
      ) : (
        <div>
          {projects.map((project) => (
            <div key={project.id}>{project.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Custom Service Factory

```typescript
import { createServiceFactory, createHttpClient } from "@/services";

// Create custom HTTP client with different config
const customHttpClient = createHttpClient({
  baseUrl: "https://api.example.com",
  timeout: 5000,
});

// Create service factory with custom HTTP client
const customServiceFactory = createServiceFactory(customHttpClient);

// Use custom services
const authService = customServiceFactory.createAuthService();
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_DEV_MODE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG=false
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### API Configuration

The API configuration is automatically loaded based on the environment:

- **Development**: `http://localhost:3000`
- **Production**: `https://youdidnttest.noki.co.za`
- **Test**: `http://localhost:3000`

## 🔐 Authentication

The authentication system includes:

- JWT token management with HTTP-only cookies
- Google OAuth 2.0 integration
- Automatic token storage and retrieval
- Authentication state management
- Profile data fetching

### Authentication Flow

1. **Login/Register**: User provides credentials
2. **Token Storage**: Access token stored in HTTP-only cookie
3. **User Data**: User profile stored in cookie
4. **API Calls**: Bearer token automatically included in headers
5. **Profile Fetch**: Additional profile data fetched from `/auth/profile`

### Google OAuth 2.0

The system supports Google OAuth 2.0 authentication:

```typescript
import { GoogleAuth } from "@/services";

// Initialize Google OAuth
await GoogleAuth.initialize();

// Render sign-in button
GoogleAuth.renderButton("google-signin-button", {
  theme: "outline",
  size: "large",
  text: "signin_with",
});

// Handle authentication
const { googleAuth } = useAuthContext();
await googleAuth(idToken);
```

### Token Management

```typescript
import { CookieManager } from "@/services";

// Check if user is authenticated
const isAuthenticated = CookieManager.isAuthenticated();

// Manual token operations
CookieManager.setAccessToken(token);
CookieManager.setUserData(userData);
CookieManager.clearAllAuthData();
```

## 📡 HTTP Client Features

- Automatic retry mechanism
- Request/response interceptors
- Error handling
- Timeout management
- Authentication headers

## 🎯 Error Handling

All services use consistent error handling:

```typescript
import { ApiException } from "@/services";

try {
  const response = await authService.login(credentials);
  // Handle success
} catch (error) {
  if (error instanceof ApiException) {
    console.error(`API Error: ${error.message} (${error.status})`);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

## 🔄 State Management

React hooks provide automatic state management:

- Loading states
- Error handling
- Data caching
- Optimistic updates

## 🧪 Testing

Services are designed to be easily testable:

```typescript
import { createServiceFactory, createHttpClient } from "@/services";

// Mock HTTP client for testing
const mockHttpClient = createHttpClient({
  baseUrl: "http://localhost:3001/api",
});

const serviceFactory = createServiceFactory(mockHttpClient);
const authService = serviceFactory.createAuthService();
```

## 📝 Adding New Services

1. Create service interface in `types/index.ts`
2. Implement service in `services/[domain]/[domain].service.ts`
3. Add service to factory in `factory/index.ts`
4. Create React hook in `hooks/use[Domain].ts`
5. Export from main `index.ts`

## 🔍 Type Safety

All services are fully typed with TypeScript:

- Request/response types
- Error types
- Configuration types
- Hook return types

This ensures compile-time safety and excellent developer experience.
