import React, { Component, ReactNode, ErrorInfo } from 'react';
import { en } from '../translations/en';
import { hi } from '../translations/hi';

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: unknown;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const lang = localStorage.getItem('pmp_language') || 'en';
      const translations = lang === 'hi' ? hi : en;

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0F1115] px-4">
          <p className="text-[#D4AF37] text-sm">{translations.school}</p>
          <h1 className="text-white text-2xl font-bold mt-4">
            {translations.errorTitle}
          </h1>
          <p className="text-gray-400 text-center mt-2 max-w-md">
            {translations.errorMessage}
          </p>
          <p className="text-[#D4AF37] text-sm mt-4">
            {translations.errorContact}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="border border-[#D4AF37] text-[#D4AF37] px-6 py-2 rounded mt-6 hover:bg-[#D4AF37] hover:text-[#0F1115] transition-colors"
          >
            {translations.errorReload}
          </button>

          {import.meta.env.DEV && (
            <pre className="text-red-400 text-xs mt-4 max-w-lg overflow-auto">
              {this.state.error instanceof Error ? this.state.error.toString() : String(this.state.error)}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
