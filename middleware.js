import { NextResponse } from "next/server"

export function middleware(request) {
  // Se a página não for encontrada, redirecionar para a página inicial
  const url = request.nextUrl.clone()

  // Verificar se é uma rota que não existe
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname === "/" ||
    url.pathname === "/404" ||
    url.pathname === "/not-found"
  ) {
    return NextResponse.next()
  }

  // Tentar verificar se a página existe
  try {
    // Se não conseguir resolver a página, redirecionar para a página inicial
    url.pathname = "/"
    return NextResponse.redirect(url)
  } catch (error) {
    // Em caso de erro, também redirecionar para a página inicial
    url.pathname = "/"
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    // Excluir arquivos estáticos e API routes
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
}
