import { Component, ReactNode } from 'react'
import { ErrorDisplay } from '../ErrorDisplay'

type HasChildren = {
  children: ReactNode
}

type ErrorBoundaryProps = HasChildren & {
  light?: boolean
  minHeight?: number | string
  fallbackContent?: ReactNode
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean; error?: unknown }> {
  constructor(props: HasChildren) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallbackContent ?? (
          <ErrorDisplay error={this.state.error} light={this.props.light} minHeight={this.props.minHeight} />
        )
      )
    }

    return this.props.children
  }
}
