import { X } from 'lucide-react';
import Avatar from './ui/Avatar.jsx';

export default function ComentarioCard({ comentario, onExcluir, podeExcluir }) {
  return (
    <div className="p-3 border-b border-neutral-100 last:border-0 flex gap-3">
      <Avatar
        src={comentario.usuarioFotoUrl}
        alt={comentario.usuarioNome}
        size="sm"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-neutral-900 truncate">{comentario.usuarioNome}</p>
          {podeExcluir && (
            <button
              onClick={() => onExcluir(comentario.id)}
              className="text-xs text-error-600 hover:text-error-700 hover:bg-error-50 rounded px-1.5 py-0.5 transition-colors"
              title="Excluir comentário"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <p className="text-sm text-neutral-700 break-words">{comentario.texto}</p>
        <p className="text-xs text-neutral-400 mt-1">
          {new Date(comentario.criadoEm).toLocaleString('pt-BR')}
        </p>
      </div>
    </div>
  );
}
