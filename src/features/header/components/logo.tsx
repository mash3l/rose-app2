import Image from "next/image";

import { Link } from "@/i18n/routing";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center justify-center">
      <Image
        src="/images/logo.png"
        alt="Rose"
        width={85}
        height={80}
        priority
      />
    </Link>
  );
}
