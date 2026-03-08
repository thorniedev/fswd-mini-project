import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AppLogoProps {
  href?: string;
  className?: string;
  src?: string;
  width?: number;
  height?: number;
}

export function AppLogo({
  href = '/',
  className,
  src = '/iShop.png',
  width = 180,
  height = 56,
}: AppLogoProps) {
  const content = (
    <span className={cn('inline-flex items-center', className)}>
      <Image src={src} alt="I-Shop logo" width={width} height={height} priority className="h-auto w-auto" />
    </span>
  );

  if (!href) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}
