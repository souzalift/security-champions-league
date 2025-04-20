import Image from 'next/image';

export default function MaintenancePage() {
  return (
    <main className="flex flex-col items-center justify-center text-center px-4 pt-44">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">
        🚧 Em Manutenção
      </h1>
      <p className="text-gray-600 max-w-md">
        Jogaram a bola no vidro do vizinho e agora estamos arrumando tudo!
      </p>
      <Image
        src="/images/bola.png"
        alt="Manutenção"
        width={300}
        height={300}
        className="mt-8"
      />
    </main>
  );
}
