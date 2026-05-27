import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error capturado:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
            <span className="text-6xl block mb-4">💥</span>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Algo salió mal
            </h1>
            <p className="text-gray-500 mb-6">
              Se produjo un error inesperado. Recargá la página o revisá la consola (F12).
            </p>
            <pre className="bg-red-50 text-red-700 text-xs p-4 rounded-lg mb-6 text-left overflow-auto max-h-32">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-700 transition cursor-pointer"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
