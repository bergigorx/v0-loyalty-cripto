export default function NotFound() {
  return (
    <html>
      <head>
        <title>404 - Página não encontrada</title>
      </head>
      <body
        style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          margin: 0,
          backgroundColor: "#f7f7f7",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "2rem",
              marginBottom: "1rem",
            }}
          >
            404 - Página não encontrada
          </h1>
          <p
            style={{
              marginBottom: "2rem",
              color: "#666",
            }}
          >
            A página que você está procurando não existe.
          </p>
          <a
            href="/"
            style={{
              backgroundColor: "#0070f3",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.375rem",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Voltar para a página inicial
          </a>
        </div>
      </body>
    </html>
  )
}
