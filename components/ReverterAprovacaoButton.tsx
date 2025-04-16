'use client';

type Props = {
  inscricaoId: string;
};

export default function ReverterAprovacaoButton({ inscricaoId }: Props) {
  const handleClick = async () => {
    const confirmed = confirm(
      'Deseja remover essa equipe e reverter a inscrição?',
    );
    if (!confirmed) return;

    const res = await fetch(`/api/admin/reverter/${inscricaoId}`, {
      method: 'DELETE',
    });

    const json = await res.json();
    if (res.ok) {
      alert('✅ Equipe removida com sucesso.');
      location.reload();
    } else {
      alert(json.error || 'Erro ao remover equipe.');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-red-600 text-sm mt-4 hover:underline"
    >
      🔄 Reverter aprovação
    </button>
  );
}
