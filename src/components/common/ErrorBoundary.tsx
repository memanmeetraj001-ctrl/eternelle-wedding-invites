import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Éternelle application:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.origin;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-5 bg-stone-900 border border-stone-800 p-8 rounded-3xl shadow-2xl">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={28} />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl text-amber-100 font-normal">
                Something went slightly off
              </h2>
              <p className="text-xs text-stone-400 font-sans leading-relaxed">
                An unexpected hiccup occurred. Your data is safe in local storage.
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-serif text-sm flex items-center gap-2 mx-auto transition-all shadow-lg cursor-pointer"
            >
              <RotateCcw size={15} />
              <span>Reload Invitation Suite</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
