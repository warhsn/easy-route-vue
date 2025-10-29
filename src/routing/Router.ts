import { union } from 'lodash-es'
import type { RouteComponent } from 'vue-router'

export interface RouteConfig {
  path: string
  name?: string
  component: RouteComponent
  meta: {
    middleware: string[]
    title?: string
  }
  children?: RouteConfig[]
}

export interface RouteGroupConfig {
  routes: RouteConfig[]
  middleware?: string[]
  parent?: RouteConfig | null
  prefix?: string
  title?: string
}

export const Route = (
  path: string = '',
  name: string = '',
  component: RouteComponent,
  middleware: string[] = [],
  title?: string
): RouteConfig => ({
  path,
  name,
  component,
  meta: { middleware, title },
  children: []
})

class RouterGroup {
  private prefix: string = ''
  private middleware: string[]
  private routes: RouteConfig[]
  private groupTitle?: string

  constructor(config: RouteGroupConfig) {
    this.setPrefix(config.prefix)
    this.middleware = config.middleware || []
    this.groupTitle = config.title
    this.routes = config.routes
    this.hasRoutes()
    this.processRoutes(config)
  }

  private hasRoutes(): void {
    if (!this.routes || !this.routes.length) {
      throw new Error('Easy Route: No Routes in Route Group')
    }
  }

  private processRoutes(config: RouteGroupConfig): void {
    if (config.parent) {
      const parent = config.parent
      parent.children = this.mapRoutes(config.routes)
      parent.name = ''
      this.routes = [parent]
    } else {
      this.routes = this.mapRoutes(config.routes)
    }
  }

  private mapRoutes(routes: RouteConfig[] = []): RouteConfig[] {
    return routes.map(route => {
      route.path = this.prefix + route.path
      route.meta.middleware = union(this.middleware, route.meta.middleware)
      // Only apply group title if route doesn't have its own title (individual titles take priority)
      if (!route.meta.title && this.groupTitle) {
        route.meta.title = this.groupTitle
      }
      return route
    })
  }

  private setPrefix(prefix?: string): void {
    if (typeof prefix === 'undefined' || prefix === null) {
      this.prefix = ''
      return
    }
    this.prefix = prefix
  }

  getRoutes(): RouteConfig[] {
    return this.routes
  }
}

export const RouteGroup = (config: RouteGroupConfig): RouteConfig[] => {
  return new RouterGroup(config).getRoutes()
}
