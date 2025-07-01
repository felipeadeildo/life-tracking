import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  route('auth', 'routes/auth.tsx'),
  layout('protected.tsx', [index('routes/home.tsx')]),
] satisfies RouteConfig
