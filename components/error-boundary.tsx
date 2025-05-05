"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="p-4 border rounded-md bg-red-50 dark:bg-red-900/20">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">Algo deu errado</h2>
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {this.state.error?.message || "Ocorreu um erro neste componente."}
          </p>
          <Button variant="outline" size="sm" onClick={this.resetError} className="mt-2">
            <RefreshCw className="mr-2 h-3 w-3" />
            Tentar novamente
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
