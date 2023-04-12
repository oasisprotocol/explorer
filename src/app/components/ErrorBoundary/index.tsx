import { Component } from 'react'
import { ErrorDisplay } from '../ErrorDisplay'

type HasChildren = {
  children: React.ReactNode
}

type ErrorBoundaryProps = HasChildren & {
  light?: boolean
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
      return <ErrorDisplay error={this.state.error} light={this.props.light} />
    }

    return this.props.children
  }
}
