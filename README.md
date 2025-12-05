# AR/VR Club GHRCEM - Serverless Platform

A modern, serverless web platform built with Next.js, Firebase Authentication, and Supabase (PostgreSQL) as the database.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- A **Supabase account** (free tier available) - [Sign up](https://supabase.com)
- A **Firebase account** (free tier available) - [Sign up](https://firebase.google.com)

## 🚀 Complete Setup Guide

### Step 1: Clone and Install

```bash
# Clone the repository (if applicable)
# cd ar-vr-club-ghrcem

# Install dependencies
npm install
```

### Step 2: Set Up Firebase Authentication

#### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `ar-vr-club-ghrcem` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click **"Create project"**

#### 2.2 Enable Authentication

1. In Firebase Console, go to **Authentication** > **Get started**
2. Click on **Sign-in method** tab
3. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle **Enable**
   - Click **Save**
4. (Optional) Enable **Google Sign-In**:
   - Click on "Google"
   - Toggle **Enable**
   - Enter support email
   - Click **Save**

#### 2.3 Get Firebase Configuration

1. Go to **Project Settings** (gear icon) > **General**
2. Scroll down to **"Your apps"** section
3. Click **Web icon** (`</>`) to add a web app
4. Register app with nickname: `AR/VR Club Web`
5. Copy the configuration values

### Step 3: Set Up Supabase Database

**See detailed guide: [docs/setup/SUPABASE_SETUP.md](./docs/setup/SUPABASE_SETUP.md)**

Quick steps:
1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run the SQL schema from `supabase/schema.sql` in Supabase SQL Editor
4. Get your API keys from Project Settings > API


### Step 4: Configure Environment Variables

1. Create a file named `.env.local` in the root directory
2. Add the following content:

```env
# Firebase Configuration (from Step 2.3)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. **Fill in the values**:
   - **Firebase values**: Copy from Firebase Console (Step 2.3)
   - **Supabase values**: Copy from Supabase Project Settings > API (Step 3)

### Step 5: Verify Setup

1. **Check environment variables**:
   ```bash
   # Make sure .env.local exists and has all values
   cat .env.local
   ```

2. **Verify Google Sheet structure**:
   - Open your Google Sheet
   - Ensure all 4 tabs exist with correct headers
   - Verify service account has Editor access

3. **Verify Firebase Authentication**:
   - Go to Firebase Console > Authentication
   - Ensure Email/Password is enabled

### Step 6: Run the Application

```bash
# Start development server
npm run dev
```

The application will start at `http://localhost:3000`

### Step 7: Test the Application

1. **Visit Home Page**: Open `http://localhost:3000`
   - Should see the home page with hero section
   - Events section should load (may be empty initially)

2. **Test Registration**:
   - Click "Sign In"
   - Click "Sign Up" tab
   - Create a test account
   - Should redirect to dashboard

3. **Test Login**:
   - Sign out
   - Sign in with created account
   - Should see dashboard

4. **Set Up Admin User** (Optional):
   - See detailed guide: [docs/features/ADMIN_SETUP.md](./docs/features/ADMIN_SETUP.md)
   - Quick method: Run SQL in Supabase to update user role:
     ```sql
     UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
     ```
   - After setting admin role, sign in and you'll be redirected to `/admin`

## 📁 Project Structure

```
ar-vr-club-ghrcem/
├── public/
│   └── Assets/              # Static assets (images, logos)
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Home page (public)
│   │   ├── login/           # Login/Signup page
│   │   ├── dashboard/       # User dashboard
│   │   └── api/             # API routes (serverless)
│   │       ├── events/      # Events CRUD
│   │       ├── registrations/ # Registration management
│   │       └── contact/     # Contact form
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   └── home/            # Home page components
│   ├── lib/
│   │   ├── firebase/        # Firebase config & auth
│   │   └── supabase/        # Supabase database service
│   ├── context/             # React contexts
│   └── styles/              # Global styles
├── .env.local               # Environment variables (create this)
├── package.json
├── tsconfig.json
└── next.config.js
```

## 🔑 Key Features

### Supabase Database Service

The core service (`src/lib/sheets/service.ts`) provides:

- **Events Management**: CRUD operations for events
- **User Management**: User data sync with Firebase
- **Registration System**: Event registration with capacity checks
- **Winners Management**: Track past event winners

### Authentication

- Firebase Authentication (Email/Password & Google)
- Role-based access control (Student/Admin)
- Protected routes
- Auth context for global state

### API Routes

All API routes are serverless functions:

- `GET /api/events` - Fetch all events
- `POST /api/events` - Create event (admin)
- `GET /api/registrations?userId=xxx` - Get user registrations
- `POST /api/registrations` - Register for event
- `POST /api/contact` - Submit contact form

## 📊 Database Schema

See `supabase/schema.sql` for the complete database schema. The database has 4 main tables:

### Events Sheet
| ID | Title | Description | StartTime | EndTime | MaxCapacity | CurrentCount | Status | ImageURL | CreatedAt |

### Users Sheet
| UserID | Name | Email | Role | Year | Dept | CreatedAt |

### Registrations Sheet
| RegistrationID | EventID | UserID | UserEmail | Timestamp | Status |

### Winners Sheet
| ID | EventName | EventDate | FirstPlace | SecondPlace | ThirdPlace | CreatedAt |

## 🛠️ Development

### Adding a New API Route

Create a file in `src/app/api/[route]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getSheetsService } from '@/lib/sheets/service';

export async function GET() {
  const service = getSheetsService();
  const data = await service.getAllEvents();
  return NextResponse.json({ success: true, data });
}
```

### Using the Sheets Service

```typescript
import { getSupabaseService } from '@/lib/supabase/service';

  const service = getSupabaseService();

// Get all events
const events = await service.getAllEvents();

// Create event
const newEvent = await service.createEvent({
  Title: 'Intro to VR',
  Description: 'Learn VR basics',
  StartTime: '2025-01-15T10:00:00Z',
  EndTime: '2025-01-15T12:00:00Z',
  MaxCapacity: 50,
  Status: 'Open',
});

// Register user
await service.createRegistration('eventId', 'userId', 'user@email.com');
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard:
   - Go to Project Settings > Environment Variables
   - Add all variables from `.env.local`
4. Click **Deploy**

API routes automatically become serverless functions.

## 🔒 Security Notes

- **Never commit `.env.local`** to version control
- Keep Supabase service role key secure
- Use environment variables for all sensitive data
- Regularly rotate Supabase API keys
- Use environment variables for all sensitive data

## 🆘 Troubleshooting

### "Failed to connect to database" Error

- Verify Supabase environment variables are set correctly
- Check `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
- Ensure database tables exist (run `supabase/schema.sql`)

### "Invalid credentials" Error

- Verify `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` includes full key with BEGIN/END markers
- Ensure `\n` characters are preserved in the private key
- Check service account JSON file is valid

### Firebase Authentication Not Working

- Verify all `NEXT_PUBLIC_FIREBASE_*` variables are set correctly
- Check Firebase Console > Authentication > Sign-in method is enabled
- Check browser console for specific error messages

### "Module not found" Errors

- Run `npm install` again
- Delete `node_modules` and `.next` folders, then `npm install`
- Check Node.js version: `node --version` (should be v18+)

### Events Not Showing

- Check Google Sheet "Events" tab has correct headers
- Verify API route is working: `http://localhost:3000/api/events`
- Check browser console and terminal for errors

## 📚 Documentation

All documentation is organized in the `docs/` directory:

### Setup Guides
- **[docs/SETUP_GUIDE.md](./docs/SETUP_GUIDE.md)** - Complete setup guide (start here!)
- **[docs/setup/ENV_SETUP.md](./docs/setup/ENV_SETUP.md)** - Environment variables setup
- **[docs/setup/SUPABASE_SETUP.md](./docs/setup/SUPABASE_SETUP.md)** - Supabase database setup

### Feature Guides
- **[docs/features/ADMIN_SETUP.md](./docs/features/ADMIN_SETUP.md)** - Admin user setup
- **[docs/features/ADD_MOBILE_NUMBER.md](./docs/features/ADD_MOBILE_NUMBER.md)** - Mobile number feature
- **[docs/features/INQUIRIES_SETUP.md](./docs/features/INQUIRIES_SETUP.md)** - Club Inquiry feature

### Database Scripts
- **[supabase/README.md](./supabase/README.md)** - Database scripts documentation
- **[supabase/schema.sql](./supabase/schema.sql)** - Complete database schema

## 📝 Next Steps After Setup

- [ ] Create your first event via admin dashboard
- [ ] Test event registration flow
- [ ] Set up admin user (see [docs/features/ADMIN_SETUP.md](./docs/features/ADMIN_SETUP.md))
- [ ] Customize home page content
- [ ] Add team member information
- [ ] Deploy to production

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is for educational purposes at GHRCEM.

---

**Need Help?** Check the troubleshooting section above or refer to the additional documentation files.
