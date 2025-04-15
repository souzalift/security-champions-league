export default function RegulamentoPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">
        📜 Regulamento Oficial
      </h1>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">🎯 Objetivo</h2>
        <p className="text-gray-700">
          A Security Champions League tem como objetivo promover a integração,
          espírito esportivo e a prática do futsal entre colaboradores das áreas
          de segurança da informação.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">⚙️ Formato do Torneio</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>8 equipes participantes</li>
          <li>Fase única de pontos corridos</li>
          <li>As 4 melhores equipes avançam para as semifinais</li>
          <li>Semifinal + Final em jogo único</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          ⚖️ Critérios de Desempate
        </h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-1">
          <li>Maior número de vitórias</li>
          <li>Maior saldo de gols</li>
          <li>Maior número de gols marcados</li>
          <li>Confronto direto</li>
          <li>Sorteio</li>
        </ol>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">📏 Regras Gerais</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Tempo de jogo: 2 tempos de 15 minutos corridos</li>
          <li>Cada equipe deve ter no mínimo 5 e no máximo 12 jogadores</li>
          <li>Uso obrigatório de uniforme com numeração visível</li>
          <li>Cartão vermelho: suspensão automática de 1 jogo</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">🏆 Premiação</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>🥇 1º lugar: Troféu + medalhas</li>
          <li>⚽ Artilheiro: Troféu individual</li>
          <li>🧤 Melhor goleiro: Troféu individual</li>
        </ul>
      </section>
    </main>
  );
}
