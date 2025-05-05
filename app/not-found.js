export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        padding: "3rem",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}
      >
        404 - Página não encontrada
      </h1>
      <p
        style={{
          marginBottom: "2rem",
          maxWidth: "600px",
        }}
      >
        Desculpe, não conseguimos encontrar a página que você está procurando.
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
  )
}
