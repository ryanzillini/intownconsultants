import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function Logo({ className, imageClassName, priority = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center", className)}
      aria-label="Intown Consultants home"
    >
      <Image
        src="/brand/logo.png"
        alt="Intown Consultants"
        width={169}
        height={153}
        priority={priority}
        className={cn("h-11 w-auto sm:h-12", imageClassName)}
      />
    </Link>
  );
}
