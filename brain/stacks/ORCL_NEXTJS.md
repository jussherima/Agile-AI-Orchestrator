# Next.js Best Practices 2025 — Référence Agent IA

> Document de référence pour produire du code Next.js idiomatique avec App Router.
> Sources : documentation officielle Next.js 16, retours communauté 2025.

---

## Table des matières

1. [Structure de projet recommandée](#1-structure-de-projet-recommandée)
2. [Server Components vs Client Components](#2-server-components-vs-client-components)
3. [Data fetching et State management](#3-data-fetching-et-state-management)
4. [Authentication patterns](#4-authentication-patterns)
5. [Performance](#5-performance)
6. [Packages essentiels (ecosysteme 2025)](#6-packages-essentiels-ecosysteme-2025)
7. [Conventions specifiques](#7-conventions-specifiques)

---

## 1. Structure de projet recommandée

### 1.1 App Router vs Pages Router

L'**App Router** est le standard depuis Next.js 13+ et le seul recommande en 2025 :

| Critere | App Router | Pages Router |
|---------|-----------|-------------|
| Server Components | Natif (defaut) | Non |
| Streaming/Suspense | Natif | Non |
| Layouts imbriques | Natif (`layout.tsx`) | Manuel (`_app.tsx`) |
| Loading UI | `loading.tsx` automatique | Manuel |
| Error boundaries | `error.tsx` automatique | Manuel |
| Route Groups | `(group)` | Non |
| Parallel Routes | `@slot` | Non |
| Server Actions | Natif | Non |
| Statut | Actif, toutes les nouveautes | Maintenance, pas de nouvelles features |

**Regle : toujours utiliser l'App Router pour un nouveau projet.**

### 1.2 Structure feature-first avec colocation

```
src/
├── app/                          # Routing uniquement + layouts
│   ├── (marketing)/              # Route group — pas dans l'URL
│   │   ├── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (app)/                    # Route group pour l'app authentifiee
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── _components/      # Prive — pas routable
│   │   │   │   ├── stats-card.tsx
│   │   │   │   └── recent-activity.tsx
│   │   │   └── _lib/
│   │   │       └── dashboard.actions.ts
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── not-found.tsx
│   │   │   ├── _components/
│   │   │   │   └── project-card.tsx
│   │   │   └── _lib/
│   │   │       ├── projects.actions.ts
│   │   │       └── projects.queries.ts
│   │   └── layout.tsx
│   ├── api/                      # Route Handlers (si necessaire)
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts
│   ├── layout.tsx                # Root layout
│   ├── not-found.tsx
│   └── global-error.tsx
├── components/                   # Composants partages globaux
│   ├── ui/                       # Composants UI generiques (shadcn)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── card.tsx
│   ├── layout/                   # Composants de layout
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   └── shared/                   # Composants metier partages
│       ├── user-avatar.tsx
│       └── date-picker.tsx
├── features/                     # Logique metier par feature
│   ├── auth/
│   │   ├── auth-provider.tsx
│   │   ├── login-form.tsx
│   │   ├── use-auth.ts
│   │   └── auth.actions.ts
│   └── notifications/
│       ├── notification-bell.tsx
│       ├── notification-list.tsx
│       └── use-notifications.ts
├── lib/                          # Utilitaires et configurations
│   ├── db.ts                     # Instance Prisma/Drizzle
│   ├── auth.ts                   # Configuration Auth.js
│   ├── utils.ts                  # Fonctions utilitaires (cn, etc.)
│   └── validations/              # Schemas Zod
│       ├── user.ts
│       └── project.ts
├── hooks/                        # Hooks partages globaux
│   ├── use-debounce.ts
│   └── use-media-query.ts
├── types/                        # Types TypeScript globaux
│   ├── index.ts
│   └── database.ts
├── styles/
│   └── globals.css
└── middleware.ts                  # Middleware Next.js (auth, i18n)
```

### 1.3 Principe de colocation

**Regle fondamentale** : un fichier vit au plus pres de la ou il est utilise.

```
# BON — colocated
app/dashboard/_components/stats-card.tsx    # Utilise UNIQUEMENT par dashboard
app/dashboard/_lib/dashboard.actions.ts     # Actions UNIQUEMENT pour dashboard

# BON — partage
components/ui/button.tsx                    # Utilise partout
features/auth/login-form.tsx                # Feature transverse

# MAUVAIS — tout dans un dossier global
components/dashboard-stats-card.tsx         # Devrait etre colocated
components/project-card.tsx                 # Devrait etre colocated
lib/actions/dashboard.actions.ts            # Ingerable a 50+ actions
```

**Regles de colocation** :
- Composant utilise par 1 seule route -> `app/route/_components/`
- Composant utilise par 2+ routes -> `components/` ou `features/`
- Action server pour 1 route -> `app/route/_lib/route.actions.ts`
- Schema de validation -> `lib/validations/`
- Hook partage -> `hooks/`
- Hook specifique a une feature -> `features/feature-name/`

### 1.4 Dossiers prives (`_folder`)

Prefixer avec `_` exclut le dossier du routing :

```tsx
// app/dashboard/_components/stats-card.tsx
// -> PAS accessible via /dashboard/_components/stats-card
// -> Safe pour colocater du code non-routable
```

### 1.5 Route Groups (`(group)`)

Organisent sans affecter l'URL :

```
app/
├── (marketing)/          # URL: /
│   ├── page.tsx          # URL: /
│   ├── about/page.tsx    # URL: /about
│   └── layout.tsx        # Layout marketing (header public)
├── (app)/                # URL: /dashboard, /projects, etc.
│   ├── dashboard/page.tsx
│   └── layout.tsx        # Layout app (sidebar, auth)
└── (auth)/               # URL: /login, /register
    ├── login/page.tsx
    ├── register/page.tsx
    └── layout.tsx        # Layout centre, sans sidebar
```

Chaque groupe peut avoir son propre `layout.tsx`.

---

## 2. Server Components vs Client Components

### 2.1 Regle par defaut

**Tout est Server Component par defaut.** N'ajouter `'use client'` que quand c'est necessaire.

| Besoin | Composant |
|--------|-----------|
| Afficher des donnees (fetch DB/API) | **Server** |
| Afficher du contenu statique | **Server** |
| Utiliser des secrets (API keys) | **Server** |
| `onClick`, `onChange`, event handlers | **Client** |
| `useState`, `useReducer` | **Client** |
| `useEffect`, lifecycle | **Client** |
| APIs navigateur (`localStorage`, `window`) | **Client** |
| Hooks custom avec state | **Client** |

### 2.2 Regles de composition

```
Server Component
├── peut importer Server Component     ✅
├── peut importer Client Component     ✅
├── peut passer des props a Client     ✅ (serialisables uniquement)
└── peut passer Server en children     ✅

Client Component
├── peut importer Client Component     ✅
├── peut importer Server Component     ❌ (INTERDIT)
├── peut recevoir Server en children   ✅ (pattern slots/children)
└── peut recevoir des props du Server  ✅ (serialisables)
```

### 2.3 Pattern : Server Component dans un Client Component

On ne peut PAS importer un Server Component dans un Client Component. Mais on peut le **passer en children** :

```tsx
// app/ui/modal.tsx — CLIENT
'use client'

import { useState } from 'react'

export default function Modal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Ouvrir</button>
      {isOpen && <div className="modal">{children}</div>}
    </>
  )
}
```

```tsx
// app/page.tsx — SERVER
import Modal from './ui/modal'
import Cart from './ui/cart'  // Server Component

export default function Page() {
  return (
    <Modal>
      <Cart />  {/* Server Component rendu cote serveur, passe comme children */}
    </Modal>
  )
}
```

### 2.4 Pattern : Minimiser le boundary client

```tsx
// app/layout.tsx — SERVER (par defaut)
import Search from './search'   // Client
import Logo from './logo'       // Server

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />       {/* Pas de JS envoye au client */}
        <Search />     {/* Seul composant interactif */}
      </nav>
      <main>{children}</main>
    </>
  )
}
```

```tsx
// app/search.tsx — CLIENT (le plus petit possible)
'use client'

import { useState } from 'react'

export default function Search() {
  const [query, setQuery] = useState('')
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />
}
```

**Regle : pousser `'use client'` le plus bas possible dans l'arbre.**

### 2.5 Pattern : Context Provider

Les providers React Context sont des Client Components. Les placer dans le layout :

```tsx
// app/providers.tsx
'use client'

import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system">
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
```

```tsx
// app/layout.tsx — SERVER
import { Providers } from './providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### 2.6 Pattern : Partage de donnees Server -> Client avec `use()`

```tsx
// app/lib/user.ts
import { cache } from 'react'

export const getUser = cache(async () => {
  const res = await fetch('https://api.example.com/user')
  return res.json()
})
```

```tsx
// app/user-provider.tsx
'use client'

import { createContext } from 'react'

type User = { id: string; name: string }
export const UserContext = createContext<Promise<User> | null>(null)

export default function UserProvider({
  children,
  userPromise,
}: {
  children: React.ReactNode
  userPromise: Promise<User>
}) {
  return <UserContext value={userPromise}>{children}</UserContext>
}
```

```tsx
// app/layout.tsx — SERVER
import UserProvider from './user-provider'
import { getUser } from './lib/user'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const userPromise = getUser() // NE PAS await ici
  return (
    <html><body>
      <UserProvider userPromise={userPromise}>{children}</UserProvider>
    </body></html>
  )
}
```

```tsx
// app/ui/profile.tsx — CLIENT
'use client'

import { use, useContext } from 'react'
import { UserContext } from '../user-provider'

export function Profile() {
  const userPromise = useContext(UserContext)
  if (!userPromise) throw new Error('UserProvider manquant')
  const user = use(userPromise) // Suspense-aware
  return <p>Bienvenue, {user.name}</p>
}
```

### 2.7 Streaming et Suspense

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react'
import RevenueChart from './_components/revenue-chart'
import LatestInvoices from './_components/latest-invoices'

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded" />}>
        <RevenueChart />  {/* Server Component async — streame independamment */}
      </Suspense>
      <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded" />}>
        <LatestInvoices /> {/* Streame independamment */}
      </Suspense>
    </div>
  )
}
```

```tsx
// app/dashboard/_components/revenue-chart.tsx — SERVER
import { getRevenue } from '../_lib/dashboard.queries'

export default async function RevenueChart() {
  const revenue = await getRevenue() // Fetch directement dans le composant
  return (
    <div>
      <h2>Revenus</h2>
      {/* Render du chart */}
    </div>
  )
}
```

### 2.8 Protection contre le poisonnement d'environnement

```tsx
// lib/data.ts
import 'server-only'  // Build error si importe dans un Client Component

export async function getData() {
  const res = await fetch('https://api.com/data', {
    headers: { authorization: process.env.API_KEY! },
  })
  return res.json()
}
```

Packages a installer :
```bash
npm install server-only client-only
```

### 2.9 Wrapper pour composants tiers sans `'use client'`

```tsx
// components/ui/carousel.tsx
'use client'

import { Carousel } from 'acme-carousel'
export default Carousel
```

Maintenant utilisable dans un Server Component :
```tsx
import Carousel from '@/components/ui/carousel'

export default function Page() {
  return <Carousel />
}
```

---

## 3. Data fetching et State management

### 3.1 Hierarchie des strategies de data fetching

```
1. Server Components (fetch direct)     → Donnees statiques/dynamiques
2. Server Actions                        → Mutations (create/update/delete)
3. Route Handlers (app/api/)             → Webhooks, APIs tierces, CORS
4. React Query / SWR (client)            → Cache client, polling, optimistic updates
```

### 3.2 Server Components — fetch direct

```tsx
// app/products/page.tsx — SERVER
import { db } from '@/lib/db'

export default async function ProductsPage() {
  // Fetch direct en DB — pas de waterfall, pas d'API intermediaire
  const products = await db.product.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### 3.3 Server Actions — mutations

```tsx
// app/projects/_lib/projects.actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100),
  description: z.string().max(500).optional(),
})

export type CreateProjectState = {
  errors?: { name?: string[]; description?: string[] }
  message?: string
}

export async function createProject(
  prevState: CreateProjectState,
  formData: FormData
): Promise<CreateProjectState> {
  // 1. Authentification
  const session = await auth()
  if (!session?.user?.id) {
    return { message: 'Non autorise' }
  }

  // 2. Validation
  const validated = CreateProjectSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  // 3. Mutation
  try {
    await db.project.create({
      data: {
        ...validated.data,
        userId: session.user.id,
      },
    })
  } catch (error) {
    return { message: 'Erreur lors de la creation' }
  }

  // 4. Revalidation et redirection
  revalidatePath('/projects')
  redirect('/projects')
}
```

```tsx
// app/projects/_components/create-project-form.tsx
'use client'

import { useActionState } from 'react'
import { createProject, type CreateProjectState } from '../_lib/projects.actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function CreateProjectForm() {
  const initialState: CreateProjectState = {}
  const [state, formAction, isPending] = useActionState(createProject, initialState)

  return (
    <form action={formAction}>
      <div>
        <Input name="name" placeholder="Nom du projet" />
        {state.errors?.name && (
          <p className="text-sm text-destructive">{state.errors.name[0]}</p>
        )}
      </div>
      <div>
        <Input name="description" placeholder="Description (optionnel)" />
      </div>
      {state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creation...' : 'Creer le projet'}
      </Button>
    </form>
  )
}
```

### 3.4 Pattern formulaire avance : react-hook-form + zod + Server Action

```tsx
// lib/validations/project.ts
import { z } from 'zod'

export const projectSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  deadline: z.string().datetime().optional(),
})

export type ProjectFormValues = z.infer<typeof projectSchema>
```

```tsx
// app/projects/_components/project-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { projectSchema, type ProjectFormValues } from '@/lib/validations/project'
import { createProject } from '../_lib/projects.actions'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ProjectForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      priority: 'medium',
    },
  })

  function onSubmit(values: ProjectFormValues) {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })
      await createProject({}, formData)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du projet</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priorite</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Basse</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="critical">Critique</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Creation...' : 'Creer'}
        </Button>
      </form>
    </Form>
  )
}
```

### 3.5 React Query pour le cache client

Utiliser React Query quand on a besoin de : polling, optimistic updates, infinite scroll, cache client.

```tsx
// features/projects/use-projects.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch('/api/projects')
      if (!res.ok) throw new Error('Erreur chargement')
      return res.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erreur suppression')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
```

### 3.6 State management : quand utiliser quoi

| Outil | Quand l'utiliser |
|-------|-----------------|
| **Aucun (Server Components)** | Donnees serveur affichees directement — pas besoin de state client |
| **`useState` / `useReducer`** | State local a un composant ou un petit arbre |
| **React Context** | Theme, locale, auth session — donnees qui changent rarement |
| **Zustand** | State global client leger : UI state (sidebar ouverte, filtres actifs, preferences) |
| **React Query / SWR** | Cache de donnees serveur cote client, polling, optimistic updates |
| **Jotai** | State atomique, beaucoup de petits etats independants |
| **Redux Toolkit** | Apps tres complexes avec beaucoup de logique metier client (rare avec Server Components) |

**Regle 2025 : avec les Server Components, le besoin de state management client a drastiquement diminue.** La plupart des donnees viennent du serveur directement.

### 3.7 Zustand — setup recommande

```tsx
// lib/stores/ui-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarOpen: boolean
  toggleSidebar: () => void
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'ui-store' }
  )
)
```

**Important** : Zustand ne s'utilise que dans les Client Components. Ne jamais l'utiliser dans les Server Components (le state serait partage entre tous les utilisateurs).

---

## 4. Authentication patterns

### 4.1 Auth.js v5 — configuration

```tsx
// lib/auth.ts
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const parsed = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }).safeParse(credentials)

        if (!parsed.success) return null

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
        })

        if (!user || !user.password) return null

        const passwordMatch = await bcrypt.compare(
          parsed.data.password,
          user.password
        )

        if (!passwordMatch) return null
        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})
```

```tsx
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers
```

### 4.2 Middleware pour routes protegees

```tsx
// middleware.ts (ou proxy.ts pour Next.js 16+)
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAuthenticated = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
                     req.nextUrl.pathname.startsWith('/register')
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard') ||
                           req.nextUrl.pathname.startsWith('/projects') ||
                           req.nextUrl.pathname.startsWith('/settings')

  // Rediriger les utilisateurs connectes loin des pages auth
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Rediriger les utilisateurs non connectes vers login
  if (isProtectedRoute && !isAuthenticated) {
    const callbackUrl = encodeURIComponent(req.nextUrl.pathname)
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
    )
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/projects/:path*',
    '/settings/:path*',
    '/login',
    '/register',
  ],
}
```

### 4.3 Verification dans les Server Components

```tsx
// app/(app)/dashboard/page.tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return <h1>Bienvenue, {session.user.name}</h1>
}
```

### 4.4 Verification dans les Server Actions

```tsx
'use server'

import { auth } from '@/lib/auth'

export async function sensitiveAction() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Non autorise')
  }
  // ... logique
}
```

---

## 5. Performance

### 5.1 Optimisation des images

```tsx
import Image from 'next/image'

// Image locale
<Image
  src="/hero.png"
  alt="Hero"
  width={1200}
  height={630}
  priority          // Pour les images above-the-fold (LCP)
  placeholder="blur" // Placeholder flou pendant le chargement
/>

// Image distante
<Image
  src="https://example.com/photo.jpg"
  alt="Photo"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, 33vw"  // Responsive
/>
```

```tsx
// next.config.js — domaines autorises
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com',
      },
    ],
  },
}

module.exports = nextConfig
```

### 5.2 Optimisation des polices

```tsx
// app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

```css
/* globals.css — utiliser les variables CSS */
@theme {
  --font-sans: var(--font-inter);
  --font-mono: var(--font-mono);
}
```

### 5.3 Dynamic imports / lazy loading

```tsx
import dynamic from 'next/dynamic'

// Composant lourd charge uniquement quand necessaire
const HeavyEditor = dynamic(() => import('@/components/editor'), {
  loading: () => <div className="h-96 animate-pulse bg-muted rounded" />,
  ssr: false, // Desactiver SSR si le composant utilise des APIs browser
})

// Composant conditionnel
const AdminPanel = dynamic(() => import('@/components/admin-panel'))

export default function Page() {
  return (
    <div>
      <HeavyEditor />
      {isAdmin && <AdminPanel />}
    </div>
  )
}
```

### 5.4 SSG, SSR, ISR — quand utiliser quoi

| Strategie | Quand | Comment |
|-----------|-------|---------|
| **SSG** (Static) | Contenu qui ne change pas souvent (blog, docs, marketing) | `export const dynamic = 'force-static'` ou pas de donnees dynamiques |
| **SSR** (Dynamic) | Contenu personnalise, donnees temps reel | `export const dynamic = 'force-dynamic'` ou utiliser `cookies()`, `headers()` |
| **ISR** (Incremental) | Contenu qui change periodiquement (catalogue, listings) | `export const revalidate = 3600` (secondes) |
| **CSR** (Client) | Dashboards interactifs avec beaucoup de state | React Query / SWR dans des Client Components |

```tsx
// app/blog/[slug]/page.tsx — ISR
export const revalidate = 3600 // Regenerer toutes les heures

export async function generateStaticParams() {
  const posts = await db.post.findMany({ select: { slug: true } })
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await db.post.findUnique({ where: { slug } })
  if (!post) notFound()
  return <article>{post.content}</article>
}
```

```tsx
// Revalidation on-demand dans une Server Action
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function publishPost(id: string) {
  await db.post.update({ where: { id }, data: { published: true } })
  revalidatePath('/blog')           // Regenerer la page blog
  revalidateTag('posts')            // Invalider toutes les donnees taguees 'posts'
}
```

### 5.5 Caching — les 4 couches

| Couche | Ce qu'elle cache | Duree | Invalidation |
|--------|-----------------|-------|-------------|
| **Request Memoization** | `fetch()` et `React.cache()` dans un meme rendu | 1 requete | Automatique |
| **Data Cache** | Reponses `fetch()` sur le serveur | Persistant | `revalidatePath`, `revalidateTag`, `revalidate` |
| **Full Route Cache** | HTML et RSC Payload des routes statiques | Persistant | Redeploiement ou revalidation |
| **Router Cache** | RSC Payload des routes visitees cote client | Session (5 min dynamique, 30 sec statique) | `router.refresh()`, revalidation, navigation |

```tsx
// Data Cache avec tags
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'], revalidate: 3600 },
  })
  return res.json()
}

// Invalidation ciblee
'use server'
import { revalidateTag } from 'next/cache'
export async function refreshPosts() {
  revalidateTag('posts')
}
```

### 5.6 Optimisation du bundle

```tsx
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'date-fns',
      'lodash-es',
    ],
  },
}
```

---

## 6. Packages essentiels (ecosysteme 2025)

### 6.1 Stack recommandee

| Categorie | Package | Pourquoi |
|-----------|---------|----------|
| **Framework** | Next.js 15+ | App Router, Server Components, Server Actions |
| **Langage** | TypeScript | Securite de typage, DX |
| **UI** | shadcn/ui | Composants accessibles, copy-paste, Radix UI |
| **CSS** | Tailwind CSS v4 | Utility-first, JIT, design tokens |
| **Forms** | react-hook-form + zod | Validation type-safe, performance |
| **DB** | Prisma ou Drizzle ORM | Type-safe, migrations |
| **Auth** | Auth.js v5 (NextAuth) | OAuth, Credentials, JWT/Sessions |
| **State client** | Zustand | Leger, SSR-friendly, minimal boilerplate |
| **Cache serveur** | React Query (@tanstack/react-query) | Cache client, mutations, polling |
| **API** | Server Actions (+ tRPC si complexe) | Type-safe end-to-end |
| **Testing unitaire** | Vitest + Testing Library | Rapide, compatible React |
| **Testing E2E** | Playwright | Multi-navigateurs, fiable |
| **Linting** | ESLint + Prettier | Code consistant |
| **Git hooks** | Husky + lint-staged | Qualite pre-commit |
| **Commits** | Commitlint (Conventional Commits) | Historique semantique |

### 6.2 Installation type

```bash
# Creation du projet
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# UI
npx shadcn@latest init
npx shadcn@latest add button input card dialog form select

# Forms + validation
npm install react-hook-form @hookform/resolvers zod

# DB (choisir l'un ou l'autre)
npm install prisma @prisma/client     # Prisma — meilleur DX
npm install drizzle-orm drizzle-kit   # Drizzle — meilleure perf, edge-compatible

# Auth
npm install next-auth@beta @auth/prisma-adapter

# State
npm install zustand
npm install @tanstack/react-query

# Testing
npm install -D vitest @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event happy-dom @vitejs/plugin-react vite-tsconfig-paths
npm install -D @playwright/test

# DX
npm install -D prettier prettier-plugin-tailwindcss
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional

# Securite
npm install server-only client-only
```

### 6.3 Prisma vs Drizzle

| Critere | Prisma | Drizzle |
|---------|--------|---------|
| DX | Excellent (schema declaratif, studio) | Bon (schema TS, SQL-like) |
| Performance | Bon | Excellent (plus leger) |
| Edge Runtime | Non (serverless adapter requis) | Oui (natif) |
| Migrations | Automatiques | Manuelles (drizzle-kit) |
| Type safety | Excellent | Excellent |
| SQL brut | `$queryRaw` | Natif (SQL-like DSL) |
| Recommendation | Apps classiques, DX prioritaire | Edge, performance critique |

### 6.4 Server Actions vs tRPC

| Critere | Server Actions | tRPC |
|---------|---------------|------|
| Setup | Zero config | Middleware, routers |
| Type safety | Avec Zod | End-to-end automatique |
| Cas d'usage | Mutations form, CRUD simple | APIs complexes, beaucoup d'endpoints |
| Cache | `revalidatePath`/`revalidateTag` | React Query integre |
| Recommendation | Defaut pour 90% des cas | Si > 20 endpoints ou API publique |

---

## 7. Conventions specifiques

### 7.1 Nommage des fichiers

```
# kebab-case pour TOUT
components/ui/date-picker.tsx          ✅
components/ui/DatePicker.tsx           ❌

# Fichiers speciaux Next.js (toujours en minuscule)
page.tsx
layout.tsx
loading.tsx
error.tsx
not-found.tsx
route.ts
template.tsx
default.tsx
global-error.tsx

# Actions et queries
_lib/projects.actions.ts               ✅ (colocation)
_lib/projects.queries.ts               ✅

# Schemas de validation
lib/validations/project.ts             ✅

# Hooks
hooks/use-debounce.ts                  ✅ (prefixe use-)
hooks/useDebounce.ts                   ❌

# Types
types/database.ts                      ✅
```

### 7.2 Route Groups

```
app/
├── (marketing)/     # Pages publiques — layout sans sidebar
├── (app)/           # App authentifiee — layout avec sidebar
├── (auth)/          # Pages login/register — layout centre
└── (admin)/         # Admin — layout specifique
```

### 7.3 Pages speciales

```tsx
// app/loading.tsx — Loading UI automatique (Suspense boundary)
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}
```

```tsx
// app/error.tsx — Error boundary automatique
'use client' // OBLIGATOIRE — les error boundaries sont des Client Components

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen">
      <h2 className="text-2xl font-bold">Une erreur est survenue</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Reessayer</Button>
    </div>
  )
}
```

```tsx
// app/not-found.tsx — Page 404 globale
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl text-muted-foreground">Page introuvable</p>
      <Button asChild>
        <Link href="/">Retour a l'accueil</Link>
      </Button>
    </div>
  )
}
```

```tsx
// app/global-error.tsx — Erreur dans le root layout
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <h2>Erreur critique</h2>
        <button onClick={reset}>Reessayer</button>
      </body>
    </html>
  )
}
```

### 7.4 Middleware

```tsx
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Exemple : redirection basee sur la locale
  const locale = request.headers.get('accept-language')?.split(',')[0] || 'fr'

  // Exemple : headers de securite
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')

  return response
}

export const config = {
  matcher: [
    // Exclure les fichiers statiques et les API internes
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
}
```

### 7.5 API Routes vs Server Actions

| | Route Handlers (`route.ts`) | Server Actions (`'use server'`) |
|---|---|---|
| **Quand** | Webhooks, API publique, CORS, streaming | Mutations depuis l'UI (forms, boutons) |
| **Methodes HTTP** | GET, POST, PUT, DELETE, PATCH | POST uniquement (automatique) |
| **Appele par** | fetch, clients externes | `<form action={}>`, `startTransition` |
| **Revalidation** | Manuelle | `revalidatePath`, `revalidateTag` |
| **Exemple** | `app/api/webhooks/stripe/route.ts` | `app/projects/_lib/projects.actions.ts` |

```tsx
// app/api/webhooks/stripe/route.ts — Route Handler
import { headers } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed':
      // Traiter le paiement
      break
  }

  return new Response('OK', { status: 200 })
}
```

### 7.6 Configuration Vitest

```tsx
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

```tsx
// src/tests/setup.ts
import '@testing-library/jest-dom/vitest'
```

### 7.7 Configuration Playwright

```tsx
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

---

## Resume des regles pour l'agent IA

1. **Toujours App Router** — jamais Pages Router pour un nouveau projet
2. **Server Component par defaut** — `'use client'` uniquement quand necessaire
3. **Pousser `'use client'` le plus bas possible** dans l'arbre de composants
4. **Colocation** — fichier au plus pres de son usage (`_components/`, `_lib/`)
5. **kebab-case** pour tous les noms de fichiers
6. **Server Actions pour les mutations** — Route Handlers pour webhooks/API externe
7. **Zod partout** pour la validation (forms, actions, API)
8. **`revalidatePath`/`revalidateTag`** pour invalider le cache apres mutation
9. **Suspense + streaming** pour les chargements paralleles
10. **`server-only`** pour proteger le code sensible
11. **Shadcn/UI + Tailwind** pour l'UI — jamais de CSS-in-JS
12. **Prisma** pour DX, **Drizzle** pour edge/performance
13. **Tester** : Vitest (unitaire) + Playwright (E2E)
