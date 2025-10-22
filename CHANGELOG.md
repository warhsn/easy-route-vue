# Changelog

### 2018-12-27 (2.0.8):

- Bug fix: RouterGroup now checks for existance of the routes property
- Refactor: Package description

### 2018-11-30 (2.0.7):

- Improved documentation
- Strip name on parent routes
- Bug: Fixes a nasty infinite loop when guards reject to a route that rejects to... the same route. Now throws an Exception.