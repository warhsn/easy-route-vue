# Changelog

### 2018-12-27 (1.0.2):

- Feature: Router now sets page title on navigation

### 2018-12-27 (1.0.1):

- Bug fix: RouterGroup now checks for existance of the routes property
- Refactor: Package description

### 2018-11-30 (1.0.0):

- Improved documentation
- Strip name on parent routes
- Bug: Fixes a nasty infinite loop when guards reject to a route that rejects to... the same route. Now throws an Exception.