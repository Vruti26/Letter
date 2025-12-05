import { LoginForm } from '@/components/login-form';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LoginPage() {
  const bgImage = PlaceHolderImages.find(p => p.id === 'login-background');

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {bgImage && (
        <Image
          src={bgImage.imageUrl}
          alt={bgImage.description}
          fill
          className="object-cover scale-110"
          quality={80}
          priority
          data-ai-hint={bgImage.imageHint}
          id="parallax-bg"
        />
      )}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      <LoginForm />
    </div>
  );
}
