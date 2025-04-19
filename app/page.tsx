import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Coins, Gift, BarChart3, ShieldCheck, Wallet, Trophy, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Coins className="h-6 w-6 text-purple-600" />
              <span className="inline-block font-bold">loyalty.crypto</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="#features"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Recursos
              </Link>
              <Link
                href="#how-it-works"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Como Funciona
              </Link>
              <Link
                href="#benefits"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Benefícios
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Entrar
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
              >
                Registrar
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-purple-50 dark:from-background dark:to-purple-950/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-500">
                    Transforme pontos em experiências e renda extra
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Um programa de fidelidade revolucionário onde os clientes ganham tokens trocáveis e NFTs
                    colecionáveis, transformando pontos em experiências memoráveis e até renda extra.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600">
                    Comece Agora
                  </Button>
                  <Button variant="outline">Saiba Mais</Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-teal-500/20 rounded-lg flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-[80%]">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Coins className="h-8 w-8 text-purple-600 mr-2" />
                          <span className="font-bold">Loyalty Tokens</span>
                        </div>
                        <span className="text-xl font-bold text-purple-600">1,250</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">NFTs Colecionáveis</span>
                          <span className="text-sm font-medium">7</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Valor Estimado</span>
                          <span className="text-sm font-medium">R$ 750,00</span>
                        </div>
                        <Button
                          size="sm"
                          className="w-full mt-2 bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
                        >
                          Trocar Tokens
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-purple-100 dark:bg-purple-900/20 px-3 py-1 text-sm">
                  Recursos Exclusivos
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Revolucionando Programas de Fidelidade
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nossa plataforma baseada em blockchain oferece uma experiência de fidelidade totalmente nova para
                  empresas e clientes.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3">
                  <Coins className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold">Tokens Trocáveis</h3>
                <p className="text-center text-muted-foreground">
                  Ganhe tokens que podem ser trocados por produtos, serviços ou até mesmo convertidos em moeda corrente.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-teal-100 dark:bg-teal-900/20 p-3">
                  <Trophy className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold">NFTs Colecionáveis</h3>
                <p className="text-center text-muted-foreground">
                  Colecione NFTs exclusivos que podem valorizar com o tempo e serem negociados no mercado secundário.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3">
                  <ShieldCheck className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold">Segurança Blockchain</h3>
                <p className="text-center text-muted-foreground">
                  Todas as transações são registradas na blockchain, garantindo transparência e segurança total.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-teal-100 dark:bg-teal-900/20 p-3">
                  <Wallet className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold">Carteira Digital</h3>
                <p className="text-center text-muted-foreground">
                  Gerencie seus tokens e NFTs em uma carteira digital segura e fácil de usar.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3">
                  <Gift className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold">Experiências Exclusivas</h3>
                <p className="text-center text-muted-foreground">
                  Desbloqueie experiências únicas e exclusivas com seus tokens e NFTs.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-teal-100 dark:bg-teal-900/20 p-3">
                  <BarChart3 className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold">Análise de Dados</h3>
                <p className="text-center text-muted-foreground">
                  Empresas podem acessar análises detalhadas sobre o comportamento dos clientes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-purple-50 to-background dark:from-purple-950/20 dark:to-background"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-purple-100 dark:bg-purple-900/20 px-3 py-1 text-sm">
                  Processo Simples
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Como Funciona</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Entenda como nossa plataforma revoluciona a experiência de fidelidade para empresas e clientes.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                  <span className="text-2xl font-bold text-purple-600">1</span>
                </div>
                <h3 className="text-xl font-bold">Cadastre-se</h3>
                <p className="text-center text-muted-foreground">
                  Crie sua conta e conecte sua carteira digital para começar a acumular tokens.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                  <span className="text-2xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="text-xl font-bold">Acumule Tokens</h3>
                <p className="text-center text-muted-foreground">
                  Ganhe tokens a cada compra ou interação com as empresas parceiras.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-bold">Troque ou Negocie</h3>
                <p className="text-center text-muted-foreground">
                  Use seus tokens para resgatar recompensas ou negocie seus NFTs no mercado.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-purple-100 dark:bg-purple-900/20 px-3 py-1 text-sm">
                  Para Empresas
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Aumente a fidelidade e o engajamento dos clientes
                </h2>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-purple-600 mt-0.5" />
                    <span>Aumente a retenção de clientes com recompensas exclusivas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-purple-600 mt-0.5" />
                    <span>Acesse dados valiosos sobre o comportamento dos consumidores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-purple-600 mt-0.5" />
                    <span>Crie NFTs exclusivos para sua marca</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-purple-600 mt-0.5" />
                    <span>Reduza custos operacionais com automação via smart contracts</span>
                  </li>
                </ul>
                <Button className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600">
                  Para Empresas
                </Button>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-teal-100 dark:bg-teal-900/20 px-3 py-1 text-sm">
                  Para Clientes
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Transforme pontos em valor real e experiências
                </h2>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-teal-600 mt-0.5" />
                    <span>Ganhe tokens que têm valor real e podem ser negociados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-teal-600 mt-0.5" />
                    <span>Colecione NFTs exclusivos que podem valorizar com o tempo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-teal-600 mt-0.5" />
                    <span>Acesse experiências exclusivas e personalizadas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-teal-600 mt-0.5" />
                    <span>Tenha total controle e transparência sobre seus pontos</span>
                  </li>
                </ul>
                <Button className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700">
                  Para Clientes
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-purple-50 dark:from-background dark:to-purple-950/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Pronto para revolucionar sua experiência de fidelidade?
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Junte-se a nós e transforme a maneira como você se relaciona com suas marcas favoritas.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                <form className="flex flex-col sm:flex-row gap-2">
                  <Input type="email" placeholder="Digite seu email" className="max-w-lg flex-1" />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
                  >
                    Comece Agora
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground">
                  Ao se inscrever, você concorda com nossos{" "}
                  <Link href="#" className="underline underline-offset-2">
                    Termos e Condições
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background">
        <div className="container flex flex-col gap-6 py-8 md:py-12 lg:flex-row lg:justify-between">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center space-x-2">
              <Coins className="h-6 w-6 text-purple-600" />
              <span className="inline-block font-bold">loyalty.crypto</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Transformando pontos em experiências e valor real através da blockchain.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Plataforma</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Como Funciona
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Preços
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Para Empresas</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Soluções
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Casos de Uso
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Parceiros
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Para Clientes</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Carteira
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Recompensas
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Termos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container flex flex-col gap-2 sm:flex-row py-6 items-center border-t">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} loyalty.crypto. Todos os direitos reservados.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Política de Privacidade
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Termos de Serviço
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
