import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  props: ErrorBoundaryProps;
  state: ErrorBoundaryState = { hasError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application Runtime Error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // Ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F5F0] text-[#171717] flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="space-y-2 max-w-md">
            <h1 className="font-serif text-3xl font-light">LEGNA Studio</h1>
            <p className="text-sm text-[#77736B]">
              페이지를 불러오는 중 예기치 않은 오류가 발생했습니다. 아래 버튼을 눌러 초기 상태로 새로고침해 주세요.
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="px-8 py-3 bg-[#171717] text-[#F7F5F0] text-xs uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors"
          >
            홈페이지 새로고침
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);


