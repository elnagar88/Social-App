# Social App

A social media web app where users can sign up, share posts with images, like, comment, and manage their profile.

**Live demo:** https://social-app-jade-mu.vercel.app

## Features

- **Authentication:** sign up and log in with form validation, plus automatic logout when the session expires
- **Feed:** infinite scroll that loads more posts as you reach the bottom
- **Posts:** create posts with text and an image preview, edit them inline, and delete them after a confirmation step
- **Likes:** instant (optimistic) updates that roll back if the request fails
- **Comments:** add comments from the feed or the post page; the Comment and Reply buttons jump to the comment box
- **Post page:** full post with all comments and a Share button (native share or copy link)
- **Profile:** user info, stats, and the user's posts
- **Settings:** change the profile photo with a live preview, and update the password with show/hide toggles
- **Design:** one warm color theme across the app, responsive layout, and pages that load on demand

## Tech Stack

- [React 19](https://react.dev) + [Vite](https://vite.dev)
- [React Router](https://reactrouter.com) for routing
- [TanStack Query](https://tanstack.com/query) for data fetching, caching, and optimistic updates
- [Axios](https://axios-http.com) for HTTP requests
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) for forms and validation
- [Tailwind CSS 4](https://tailwindcss.com) for styling
- [React Hot Toast](https://react-hot-toast.com) and [React Icons](https://react-icons.github.io/react-icons)

## Project Structure

```
src/
├── api/            # API layer: axios client + one function per endpoint
│   ├── client.js
│   ├── posts.js
│   └── users.js
├── components/
│   ├── Form/       # FormField, FieldError, SubmitButton, AuthCard
│   ├── Post/       # FeedPost, CreatePost, CreateComment, LikeButton, EditPostForm, ...
│   ├── UI/         # ConfirmDialog, PageLoader, Stat, Detail, icons
│   ├── Navbar/  Footer/  ProtectedRoute/  GuestRoute/
├── config/         # constants: API base URL, query keys, password rule
├── context/        # auth token, login and logout
├── hooks/          # useProfile, useLikePost, useDeletePost, useUpdatePost, useInfinitePosts, useInView
├── layouts/        # Layout with Navbar, Footer, and page loading fallback
├── pages/          # Home, Login, Signup, Profile, Settings, SinglePost, Notfound
├── routes/         # router + lazy-loaded pages
└── utils/          # small helpers (formatDate, getErrorMessage)
```

## Getting Started

```bash
git clone https://github.com/elnagar88/Social-App.git
cd Social-App
npm install
npm run dev
```

Then open http://localhost:5173.

### Environment variables (optional)

The app uses `https://route-posts.routemisr.com` by default. To use another API server, copy `.env.example` to `.env` and change the value:

```
VITE_API_BASE_URL=https://route-posts.routemisr.com
```

## Scripts

| Command           | What it does                     |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start the dev server             |
| `npm run build`   | Build for production into `dist` |
| `npm run preview` | Preview the production build     |
| `npm run lint`    | Run ESLint                       |

## Deployment

The app is deployed on [Vercel](https://vercel.com). Every push to `main` deploys automatically. `vercel.json` sends all routes to `index.html`, so refreshing a page like `/profile` works.
