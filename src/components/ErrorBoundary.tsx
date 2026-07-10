import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Rendered instead of the children if they throw. Defaults to nothing. */
  fallback?: ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Isolates a subtree so a crash inside it (e.g. a WebGL background failing to
 * initialize) can't blank the entire app.
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn(`ErrorBoundary${this.props.label ? ` (${this.props.label})` : ""}:`, error, info);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export default ErrorBoundary;
