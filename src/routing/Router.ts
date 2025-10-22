import { union } from 'lodash-es'
import type { RouteComponent } from 'vue-router'

export interface RouteConfig {
  path: string
  name?: string
  component: RouteComponent
  meta: {
    middleware: string[]
  }
  children?: RouteConfig[]
}

export interface RouteGroupConfig {
  routes: RouteConfig[]
  middleware?: string[]
  parent?: RouteConfig | null
  prefix?: string
}

export const Route = (
  path: string = '',
  name: string = '',
  component: RouteComponent,
  middleware: string[] = []
): RouteConfig => ({
  path,
  name,
  component,
  meta: { middleware },
  children: []
})

class RouterGroup {
  private prefix: string = ''
  private middleware: string[]
  private routes: RouteConfig[]

  constructor(config: RouteGroupConfig) {
    this.setPrefix(config.prefix)
    this.middleware = config.middleware || []
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
