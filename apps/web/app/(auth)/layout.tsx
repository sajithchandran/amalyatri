import Link from 'next/link';
import { BrandMark, Wordmark } from '@/components/landing/logo';
import { KeralaMist } from '@/components/landing/kerala-mist';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand panel — only on large screens */}
      <aside className="relative hidden lg:flex flex-col p-12 lg:px-16 bg-cream">
        <Link href="/" className="inline-flex items-center gap-2.5 z-10">
          <BrandMark size={32} />
          <Wordmark className="text-lg" />
        </Link>
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <KeralaMist />
          </div>
        </div>
        <blockquote className="max-w-sm mx-auto mt-10 font-display text-2xl text-forest-900 leading-snug">
          “The journey does not end when you leave Kerala.
          <br />
          It begins again, gently, the moment you settle home.”
        </blockquote>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10">
            <Link href="/" className="inline-flex items-center gap-2.5 pl-6">
              <BrandMark size={32} />
              <Wordmark className="text-lg" />
            </Link>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
