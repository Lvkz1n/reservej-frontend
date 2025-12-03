Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Backend integration

- Configure the API base URL through `VITE_API_URL` (default: `http://localhost:3000`). Example: copy `.env.example` to `.env.local` and adjust the value.
- Authentication flows use the backend endpoints:
  - `POST /auth/login` with `{ email, password }` returning `access_token`, `refresh_token`, `user`.
  - `POST /auth/refresh` with `{ refreshToken }` (automatic refresh when a 401 happens).
  - `POST /auth/logout` with `{ refreshToken }`.
- All authenticated requests send `Authorization: Bearer <access_token>` and, for company-scoped routes, `X-Company-Id: <companyId>`.
