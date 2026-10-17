import { X } from 'lucide-react';

export default function ComentarioCard({ comentario, onExcluir, podeExcluir }) {
  return (
    <div className="p-3 border-b border-gray-100 last:border-0 flex gap-3">
      <img
        src={comentario.usuarioFotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(comentario.usuarioNome)}&background=random`}
        alt={comentario.usuarioNome}
        className="w-10 h-10 rounded-full object-cover bg-gray-200 shrink-0"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium">{comentario.usuarioNome}</p>
          {podeExcluir && (
            <button
              onClick={() => onExcluir(comentario.id)}
              className="text-xs text-red-500 hover:text-red-700"
              title="Excluir comentário"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-700">{comentario.texto}</p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(comentario.criadoEm).toLocaleString('pt-BR')}
        </p>
      </div>
    </div>
  );
}
