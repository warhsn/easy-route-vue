import type { App, Plugin } from 'vue'
import type { Router } from 'vue-router'
import BeforeMiddleware from './src/middleware/before'
import TitleManager from './src/middleware/title'
import type { Guard } from './src/middleware/before'

export { RouteGroup, Route } from './src/routing/Router'
export type { RouteConfig, RouteGroupConfig } from './src/routing/Router'
export type { Guard, GuardContext, RouteRedirect } from './src/middleware/before'

export interface EasyRouteOptions {
  router: Router
  guards?: Guard[]
  baseTitle?: string
}

const install: Plugin = (_app: App, options: EasyRouteOptions) => {
  if (!options.router) {
    throw new Error('Easy Route: You must pass in a vue-router instance')
  }

  if (!options.guards || options.guards.length === 0) {
    console.warn('Easy Route Warning: There are no guards protecting your routes.')
  }

  const router = options.router
  const guards = options.guards || []
  const baseTitle = options.baseTitle || ''

  new BeforeMiddleware(router, guards)
  new TitleManager(router, baseTitle)
}

export default install
