import type { Router } from 'vue-router'

export default class TitleManager {
  private router: Router
  private baseTitle: string

  constructor(router: Router, baseTitle: string = '') {
    this.router = router
    this.baseTitle = baseTitle
    this.init()
  }

  private init(): void {
    this.router.afterEach((to) => {
      const title = this.getTitle(to.meta.title as string | undefined, to.name as string | undefined)
      document.title = title
    })
  }

  private getTitle(metaTitle?: string, routeName?: string): string {
    let pageTitle = ''

    // Priority 1: Use meta.title if provided
    if (metaTitle) {
      pageTitle = metaTitle
    }
    // Priority 2: Format route name if available
    else if (routeName && typeof routeName === 'string') {
      pageTitle = this.formatRouteName(routeName)
    }

    // Combine base title with page title
    if (this.baseTitle && pageTitle) {
      return `${this.baseTitle} | ${pageTitle}`
    } else if (pageTitle) {
      return pageTitle
    } else {
      return this.baseTitle
    }
  }

  private formatRouteName(routeName: string): string {
    return routeName
      .split('-') // Split by hyphens (e.g., 'user-profile' -> ['user', 'profile'])
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
      .join(' ') // Join with spaces (e.g., ['User', 'Profile'] -> 'User Profile')
  }
}
