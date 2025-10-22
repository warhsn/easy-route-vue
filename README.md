# Easy Route for Vue Router

[![Vue](https://forthebadge.com/images/badges/made-with-vue.svg)](https://vuejs.org)

A middleware routing system for Vue Router 4 (Vue 3) inspired by Laravel routing. Define guards and protect routes with ease using TypeScript support.

## Features

- 🛡️ Middleware-based route protection
- 🎯 Route grouping with shared prefixes and guards
- 📦 TypeScript support with full type definitions
- ⚡ Built with Vite for modern development
- 🔄 Vue 3 and Vue Router 4 compatible

## Installation

Install Easy Route with npm:

```shell
npm i @warhsn/easy-route-vue
```

## Usage

### JavaScript

Import and install:

```javascript
import { createApp } from 'vue'
import EasyRoute from '@warhsn/easy-route-vue'
import router from '@/router'

const app = createApp(App)

app.use(EasyRoute, {
  router,
  guards: [] // Optional: will be discussed below
})

app.use(router)
app.mount('#app')
```

### TypeScript

```typescript
import { createApp } from 'vue'
import EasyRoute from '@warhsn/easy-route-vue'
import type { Guard } from '@warhsn/easy-route-vue'
import router from '@/router'

const app = createApp(App)

const guards: Guard[] = [] // Your guards here

app.use(EasyRoute, {
  router,
  guards
})

app.use(router)
app.mount('#app')
```

Installing the plugin makes Easy Route aware of navigation through the [beforeEach](https://router.vuejs.org/guide/advanced/navigation-guards.html) method on the Vue Router API. It will however not have any effect until guards are added to the mix.

## Routes

The `Route` method has been designed to simplify route definitions. This method will return a route object for Vue Router.


```javascript
import { Route } from '@warhsn/easy-route-vue'

Route('/path', 'route-name', VueComponent, ['stacked', 'middlewares'])

```

**Route Paramaters**

| Paramater     | type          | default  |
| ------------- |---------------| ---------|
| path          | string        | required |
| name          | string        |   ''     |
| component     | Vue Component | required |
| middleware    | Array         | []       |

## RouteGroup

The `RouteGroup()` method gives you the ability to group routes with `common middlewares` or `path prefixes` together.

```javascript
import { Route, RouteGroup } from '@warhsn/easy-route-vue'

// Example components
import UserIndex from '@/components/user/Index'
import CreateUser from '@/components/user/Create'

RouteGroup({
    
    // Prefix all routes in group
    prefix: '/admin',
    
    // Apply guards to all routes in group
    middleware: [
        'auth',
        'admin'
    ],
    
    routes: [
        Route('/users', 'user-index', UserIndex),
        Route('/user', 'create-user', CreateUser, ['can-create-user']) // Additional guard on single route
    ]
    
})

```

**RouteGroup Options**

| Paramater     | type          | default  |
| ------------- |---------------| ---------|
| prefix        | String        | ''       |
| middleware    | Array         | []       |
| routes        | Array         | required |
| parent        | Route         | null     |


## RouteGroup with children

It is quite common to require routes with nested children. In these scenarios you may use the `parent` option of a RouteGroup. parent should be a Route()
and should not include a name. Once you have added the parent option, the routes array will 
become the children of the parent. 

**Note**

Easy Route will strip names & prefixes on parent routes. Child routes will inherit their prefix from the parent route.


```javascript
import { Route, RouteGroup } from '@warhsn/easy-route-vue'

// Example components
import UserManager from '@/components/user/Manager'
import UserOverview from '@/components/user/Overview'
import EditUser from '@/components/user/EditUser'

RouteGroup({
    
    parent: Route('/users/:userId', '', UserManager),
    
    middleware: ['auth', 'admin'],
    
    routes: [
        Route('/', 'user-overview', UserOverview),
        Route('edit', 'edit-user', EditUser)
    ]
    
})

```

## Guards

Easy Route does not ship with built-in guards - each app is unique and needs its own set of guards. However, creating custom guards is very straightforward.

### JavaScript Example

```javascript
// guards/auth.js

const guard = (context) => new Promise((resolve, reject) => {
  if (authenticated === true) {
    resolve()
  } else {
    reject({
      name: 'login',
      path: '/login' // optional, using a named route is better
    })
  }
})

export default {
  name: 'auth',
  run: guard
}
```

### TypeScript Example

```typescript
// guards/auth.ts
import type { Guard, GuardContext } from '@warhsn/easy-route-vue'

const guard = async (context: GuardContext): Promise<void> => {
  const { to, from, next } = context

  if (authenticated) {
    return Promise.resolve()
  } else {
    return Promise.reject({
      name: 'login',
      path: '/login'
    })
  }
}

const authGuard: Guard = {
  name: 'auth',
  run: guard
}

export default authGuard
```

### Guard Requirements

Your guards must:

1. Export an object with `name` and `run` properties: `{ name: 'guard-name', run: Function }`
2. The `run` function must return a Promise
3. If `run` fails (rejects), you must provide a fallback route: `reject({ name: '404' })` or `reject({ path: '/404' })`

Your guards receive the current route context as the only parameter:
- `to`: The target route being navigated to
- `from`: The current route being navigated away from
- `next`: The navigation guard next function

## Installing Guards

### JavaScript

```javascript
// main.js
import { createApp } from 'vue'
import auth from '@/guards/auth'
import guest from '@/guards/guest'
import EasyRoute from '@warhsn/easy-route-vue'
import router from '@/router'

const app = createApp(App)

app.use(EasyRoute, {
  router,
  guards: [auth, guest]
})

app.use(router)
app.mount('#app')
```

### TypeScript

```typescript
// main.ts
import { createApp } from 'vue'
import type { Guard } from '@warhsn/easy-route-vue'
import auth from '@/guards/auth'
import guest from '@/guards/guest'
import EasyRoute from '@warhsn/easy-route-vue'
import router from '@/router'

const app = createApp(App)

const guards: Guard[] = [auth, guest]

app.use(EasyRoute, {
  router,
  guards
})

app.use(router)
app.mount('#app')
```

## Putting it all together

### JavaScript

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { Route, RouteGroup } from '@warhsn/easy-route-vue'

import WelcomePage from '@/views/WelcomePage.vue'
import LoginPage from '@/views/LoginPage.vue'
import AppDashboard from '@/views/AppDashboard.vue'
import UserIndex from '@/views/UserIndex.vue'

const guestRoutes = RouteGroup({
  middleware: ['guest'],
  routes: [
    Route('/', 'welcome', WelcomePage),
    Route('/login', 'login', LoginPage)
  ]
})

const appRoutes = RouteGroup({
  middleware: ['auth'],
  prefix: '/app',
  routes: [
    Route('/', 'dashboard', AppDashboard),
    Route('/users', 'user-index', UserIndex)
  ]
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...guestRoutes,
    ...appRoutes
  ]
})

export default router
```

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import EasyRoute from '@warhsn/easy-route-vue'
import auth from '@/guards/auth'
import guest from '@/guards/guest'

const app = createApp(App)

app.use(EasyRoute, {
  router,
  guards: [auth, guest]
})

app.use(router)
app.mount('#app')
```

### TypeScript

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { Route, RouteGroup } from '@warhsn/easy-route-vue'
import type { RouteConfig } from '@warhsn/easy-route-vue'

import WelcomePage from '@/views/WelcomePage.vue'
import LoginPage from '@/views/LoginPage.vue'
import AppDashboard from '@/views/AppDashboard.vue'
import UserIndex from '@/views/UserIndex.vue'

const guestRoutes: RouteConfig[] = RouteGroup({
  middleware: ['guest'],
  routes: [
    Route('/', 'welcome', WelcomePage),
    Route('/login', 'login', LoginPage)
  ]
})

const appRoutes: RouteConfig[] = RouteGroup({
  middleware: ['auth'],
  prefix: '/app',
  routes: [
    Route('/', 'dashboard', AppDashboard),
    Route('/users', 'user-index', UserIndex)
  ]
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...guestRoutes,
    ...appRoutes
  ] as RouteRecordRaw[]
})

export default router
```

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import EasyRoute from '@warhsn/easy-route-vue'
import type { Guard } from '@warhsn/easy-route-vue'
import auth from '@/guards/auth'
import guest from '@/guards/guest'

const app = createApp(App)

const guards: Guard[] = [auth, guest]

app.use(EasyRoute, {
  router,
  guards
})

app.use(router)
app.mount('#app')
```



