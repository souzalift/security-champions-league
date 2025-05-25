import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full text-center py-4 text-sm text-gray-600 bg-white border-t">
      &copy; {new Date().getFullYear()} Security Champions League. Todos os
      direitos reservados. Desenvolvido por{' '}
      <span className="text-blue-600 font-semibold">
        <Link href="https://www.linkedin.com/in/souzalift/">Souzalift</Link>
      </span>
    </footer>
  );
}
