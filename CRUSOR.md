never use type any


### 🖥️ Frontend
- **Framework:** Next.js (React 19 App Router)
- **Language:** TypeScript (strict mode enabled)
- **Styling:** Tailwind CSS
- **State Management:** React Server Components
- **Deployment:** Vercel (edge network with auto-build preview deploys)

### 🗄️ Backend / Database
- **Database:** Supabase (PostgreSQL)
- **ORM / Query Builder:** Supabase JS client + SQL functions
- **Auth:** Supabase Auth (Email / OAuth providers)
- **Storage:** Supabase Buckets (for images & screenshots)
- **Edge Functions:** Supabase Edge Functions (for server-side logic)
- **Realtime:** Supabase Realtime subscriptions on table changes
- **RLS:** Row-Level Security enabled with policies per company / user

Rules: 

never use the type any

Break bigger changes into smaller components that can be seperate commits 

Always do npm run build after making changes, make a plan to fix if fails

never use type any