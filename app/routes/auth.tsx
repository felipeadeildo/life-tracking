import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { Route } from './+types/auth'
import { useAuth } from '~/contexts/auth'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'

const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type FormValues = z.infer<typeof formSchema>

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Auth - Life Tracking' }, { name: 'description', content: 'Login or Sign up' }]
}

export default function Auth() {
  const { user, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  if (user) {
    return <Navigate to="/" replace />
  }

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        await signIn(values.email, values.password)
      } else {
        if (!values.name) {
          setError('Nome é obrigatório para cadastro')
          return
        }
        await signUp(values.email, values.password, values.name)
      }
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    form.reset()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? 'Login' : 'Cadastro'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Entre com suas credenciais' : 'Crie uma nova conta'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!isLogin && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Digite seu email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Digite sua senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Cadastrar'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={toggleMode}
              className="text-sm"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}