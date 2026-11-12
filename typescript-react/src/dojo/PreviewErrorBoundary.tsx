import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  resetKey: number;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class PreviewErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(prevProps: Props): void {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error !== null) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(_error: Error, _info: ErrorInfo): void {
    // Error rendered cleanly inside sandbox panel
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="preview-runtime-error" role="alert">
          <strong>💥 Excepción en runtime al renderizar tu componente:</strong>
          <pre>{this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
