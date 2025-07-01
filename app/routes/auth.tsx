import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { LoginForm } from '~/components/login-form'
import { SignupForm } from '~/components/signup-form'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { useAuth } from '~/contexts/auth'
import type { Route } from './+types/auth'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Auth - Life Tracking' },
    { name: 'description', content: 'Login or Sign up' },
  ]
}

export default function Auth() {
  const { user, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true)
    setError('')

    try {
      await signIn(values.email, values.password)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (values: {
    name: string
    email: string
    password: string
  }) => {
    setLoading(true)
    setError('')

    try {
      await signUp(values.email, values.password, values.name)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? 'Login' : 'Cadastro'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Entre com suas credenciais' : 'Crie uma nova conta'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLogin ? (
            <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
          ) : (
            <SignupForm
              onSubmit={handleSignup}
              loading={loading}
              error={error}
            />
          )}

          <div className="mt-4 text-center">
            <Button variant="link" onClick={toggleMode} className="text-sm">
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
