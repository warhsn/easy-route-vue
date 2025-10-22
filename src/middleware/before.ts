import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

export interface GuardContext {
  to: RouteLocationNormalized
  from: RouteLocationNormalized
  next: NavigationGuardNext
}

export interface Guard {
  name: string
  run: (context: GuardContext) => Promise<void>
}

export interface RouteRedirect {
  name?: string
  path?: string
}

export default class Before {
  private router: Router
  private guards: Guard[]

  constructor(router: Router, guards: Guard[] = []) {
    this.router = router
    this.guards = guards

    this.guards.forEach(guard => {
      if (!guard.hasOwnProperty('name') || !guard.hasOwnProperty('run')) {
        throw new Error(
          'Easy Route: Guard is missing the name and/or run property. Please see docs for formatting.'
        )
      }
    })

    this.init()
  }

  private init(): void {
    this.router.beforeEach((to, from, next) => {
      const processes = this.getRouteGuards(to.meta.middleware as string[] | undefined)
        .reduce(
          (promiseChain, currentTask) =>
            promiseChain.then(() => currentTask.run({ to, from, next })),
          Promise.resolve()
        )

      processes
        .then(() => next())
        .catch((error: RouteRedirect) => {
          // Stops the browser from melting down when guards conflict on routes.
          if (to.name === error.name || to.path === error.path) {
            throw new Error('Easy Route Error: Infinite loop detected')
          }

          next(error)
        })
    })
  }

  private getRouteGuards(routeMiddleware: string[] | undefined = []): Guard[] {
    const middleware = routeMiddleware || []
    return this.guards.filter(guard => {
      return middleware.indexOf(guard.name) > -1
    })
  }
}
