
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, LogIn } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useUser, signInWithEmail, signUpWithEmail } from '@/firebase/auth/use-user';

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function LoginPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const onSubmit = async (data: UserFormValue) => {
    setIsSubmitting(true);
    try {
      if (isSigningUp) {
        if (!data.name) {
          form.setError("name", { type: "manual", message: "O nome é obrigatório para o cadastro."});
          setIsSubmitting(false);
          return;
        }
        await signUpWithEmail(data.name, data.email, data.password);
        toast({
          title: "Conta criada com sucesso!",
          description: "Você será redirecionado em breve.",
        });
      } else {
        await signInWithEmail(data.email, data.password);
         toast({
          title: "Login bem-sucedido!",
          description: "Você será redirecionado em breve.",
        });
      }
      // router.push will be handled by the useEffect
    } catch (error: any) {
      let errorMessage = "Ocorreu um erro. Por favor, tente novamente.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este email já está em uso. Tente fazer login.";
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        errorMessage = "Email ou senha inválidos.";
      }
      toast({
        variant: "destructive",
        title: "Falha na autenticação",
        description: errorMessage,
      });
    } finally {
        setIsSubmitting(false);
    }
  };


  if (loading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <LogIn className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground">
                {isSigningUp ? 'Crie sua Conta' : 'Acesse sua Conta'}
            </h1>
            <p className="text-muted-foreground mt-2">
                {isSigningUp ? 'Preencha os campos para se registrar.' : 'Bem-vindo(a) de volta! Faça login para continuar.'}
            </p>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {isSigningUp && (
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                            <Input placeholder="Seu nome completo" {...field} />
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
                        <Input type="email" placeholder="seu@email.com" {...field} />
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
                        <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : (isSigningUp ? 'Criar Conta' : 'Entrar')}
            </Button>
            </form>
        </Form>
        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            {isSigningUp ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}
            <Button variant="link" className="px-1" onClick={() => setIsSigningUp(!isSigningUp)}>
              {isSigningUp ? 'Faça login' : 'Crie uma conta'}
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
