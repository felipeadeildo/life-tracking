import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Life Tracking' }, { name: 'description', content: 'IDK' }]
}

export default function Home() {
  return (
    <div className="flex h-screen justify-center items-center">
      <h1 className="text-2xl">In progress...</h1>
    </div>
  )
}
