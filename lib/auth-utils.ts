import { toast } from "@/components/ui/use-toast"

export async function handleSignOut(signOut: () => Promise<void>, router: any) {
  try {
    // Mostrar toast de carregamento
    toast({
      title: "Saindo...",
      description: "Encerrando sua sessão",
    })

    // Executar o logout
    await signOut()

    // Redirecionar para a página inicial
    router.push("/")

    // Mostrar toast de sucesso
    toast({
      title: "Logout realizado com sucesso",
      description: "Você foi desconectado da sua conta",
    })

    // Forçar um recarregamento da página para garantir que todos os estados sejam limpos
    setTimeout(() => {
      window.location.href = "/"
    }, 300)
  } catch (error) {
    console.error("Error during sign out:", error)
    toast({
      title: "Erro ao sair",
      description: "Ocorreu um erro ao tentar sair da sua conta",
      variant: "destructive",
    })
  }
}
