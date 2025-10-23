# Canvas Service Usage Guide

The Canvas Service provides integration with Canvas LMS for Noki AI. It allows users to connect their Canvas account and import their course data.

## Authentication

All Canvas API calls **require a bearer token** (access token) which is automatically included in the headers. The token is retrieved from cookies after a user signs up or logs in.

## API Flow

The Canvas integration is a **two-step process**:

### Step 1: Setup Canvas Account

First, you need to setup the Canvas account with the institutional URL and access token.

**Endpoint:** `/canvas/setup`

**Parameters:**

```typescript
{
  canvas_institutional_url: string; // e.g., "https://uxi.instructure.com"
  canvas_token: string; // e.g., "1234~abcdefghijklmnopqrstuvwxyz1234567890"
}
```

**Response:**

```typescript
{
  message: "Canvas Linked successfully",
  user_details: {
    id: number;
    name: string;
    created_at: string;
    sortable_name: string;
    short_name: string;
    avatar_url: string;
    last_name: string;
    first_name: string;
    locale: string | null;
    effective_locale: string;
    permissions: {
      can_update_name: boolean;
      can_update_avatar: boolean;
      limit_parent_app_web_access: boolean;
    };
  };
}
```

### Step 2: Link Canvas Data

After successful setup, link the Canvas data to Noki AI. This step **cannot** be performed before Step 1.

**Endpoint:** `/canvas/link-data`

**Parameters:** None (uses the same bearer token)

**Response:**

```typescript
{
  message: "Your canvas account has been linked successfully, 5 courses and 23 assignments loaded to your Noki account.";
}
```

## Usage Examples

### Using the Canvas Service Directly

```typescript
import { getCanvasService } from "@/services";

const canvasService = getCanvasService();

// Step 1: Setup Canvas account
const setupData = {
  canvas_institutional_url: "https://uxi.instructure.com",
  canvas_token: "1234~abcdefghijklmnopqrstuvwxyz1234567890",
};

try {
  const setupResponse = await canvasService.setupCanvas(setupData);

  if (setupResponse.success) {
    console.log("Canvas setup successful:", setupResponse.data.message);
    console.log("User:", setupResponse.data.user_details.name);

    // Step 2: Link Canvas data
    const linkResponse = await canvasService.linkCanvasData();

    if (linkResponse.success) {
      console.log("Canvas linked successfully:", linkResponse.data.message);
    }
  }
} catch (error) {
  console.error("Canvas setup failed:", error);
}
```

### Using the Canvas Hook (Recommended for React Components)

```typescript
import { useCanvas } from "@/services";

function CanvasSetupComponent() {
  const {
    isLoading,
    error,
    setupResponse,
    linkResponse,
    setupCanvas,
    linkCanvasData,
    setError,
  } = useCanvas();

  const handleSetupCanvas = async () => {
    const setupData = {
      canvas_institutional_url: "https://uxi.instructure.com",
      canvas_token: "1234~abcdefghijklmnopqrstuvwxyz1234567890",
    };

    const result = await setupCanvas(setupData);

    if (result) {
      // Display user details for confirmation
      alert(`Connected as: ${result.user_details.name}`);

      // Proceed to link data
      const linkResult = await linkCanvasData();

      if (linkResult) {
        // Show success message
        alert(linkResult.message);
      }
    }
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {setupResponse && (
        <div>
          <h3>Canvas Account Connected</h3>
          <p>Name: {setupResponse.user_details.name}</p>
          <p>Institution: {setupResponse.user_details.effective_locale}</p>
        </div>
      )}

      {linkResponse && <div className="success">{linkResponse.message}</div>}

      <button onClick={handleSetupCanvas} disabled={isLoading}>
        Setup Canvas
      </button>
    </div>
  );
}
```

## Integration with Signup Flow

For integration during the signup process (Step 4):

```typescript
// Step 4 of signup - Show only name and institutional URL
const { setupResponse } = useCanvas();

if (setupResponse) {
  return (
    <div className="canvas-confirmation">
      <p>Connected Account: {setupResponse.user_details.name}</p>
      <p>Institution: {setupResponse.canvas_institutional_url}</p>
      <button onClick={proceedToNextStep}>Continue</button>
    </div>
  );
}
```

## Error Handling

All Canvas service methods handle errors gracefully and return `null` on failure. Check the `error` state for user-friendly error messages:

```typescript
const { error, setupCanvas } = useCanvas();

const result = await setupCanvas(data);

if (!result) {
  console.error("Setup failed:", error);
  // Show error to user
}
```

## Bearer Token Flow

The bearer token authentication flow is handled automatically:

1. **Signup/Login:** User signs up or logs in → Access token stored in cookies
2. **API Calls:** Token automatically retrieved from cookies and added to headers
3. **Authorization Header:** `Authorization: Bearer ${token}` sent with every request

This is managed by:

- `CookieManager.setAccessToken()` - Stores token after auth
- `CookieManager.getAccessToken()` - Retrieves token from cookies
- `createAuthHeaders()` - Creates Authorization header
- `HttpClient.makeRequest()` - Automatically includes auth headers

## Notes

- Both API calls require authentication (bearer token)
- Step 2 (link-data) depends on Step 1 (setup) being completed first
- The setup step returns user details for confirmation before linking
- The link step returns information about imported courses and assignments
- Email reminders (Step 5) are not yet implemented
