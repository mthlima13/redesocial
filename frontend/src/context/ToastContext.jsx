import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((tipo, mensagem, duracao = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, tipo, mensagem }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duracao);
  }, []);

  const removerToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const sucesso = useCallback((msg, d) => addToast('sucesso', msg, d), [addToast]);
  const erro = useCallback((msg, d) => addToast('erro', msg, d), [addToast]);
  const info = useCallback((msg, d) => addToast('info', msg, d), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, sucesso, erro, info, removerToast }}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-lg shadow-lg border text-sm flex items-center gap-3 min-w-[300px] animate-slide-in ${
              t.tipo === 'sucesso'
                ? 'bg-green-50 border-green-200 text-green-800'
                : t.tipo === 'erro'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            {t.tipo === 'sucesso' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {t.tipo === 'erro' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {t.tipo === 'info' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>{t.mensagem}</span>
            <button
              onClick={() => removerToast(t.id)}
              className="ml-auto opacity-50 hover:opacity-100"
            >
              <svg className="w-4 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de ToastProvider');
  return ctx;
};
