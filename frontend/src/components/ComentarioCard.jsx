export default function ComentarioCard({ comentario }) {
  return (
    <div className="p-3 border-b border-gray-100 last:border-0 flex gap-3">
      <img
        src={comentario.usuarioFotoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(comentario.usuarioNome) + '&background=random'}
        alt={comentario.usuarioNome}
        className="w-10 h-10 rounded-full object-cover bg-gray-200 shrink-0"
      />
      <div className="flex-1">
        <p className="text-sm font-medium">{comentario.usuarioNome}</p>
        <p className="text-sm text-gray-700 mt-0.5">{comentario.texto}</p>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(comentario.criadoEm).toLocaleString('pt-BR')}
        </p>
      </div>
    </div>
  );
}
