import { connection } from "next/server";
import { getServerSession } from "next-auth";
import { MainHeader } from "./main-header";
import { authOptions } from "@/lib/auth";

interface UserWithMetadata {
  name?: string | null;
  deliveryLocation?: string;
  cartCount?: number;
  notificationCount?: number;
}

export async function HeaderServer() {
  await connection();
  const session = await getServerSession(authOptions);
  const user = session?.user as UserWithMetadata | undefined;

  return (
    <MainHeader
      isAuthenticated={!!session?.user}
      userName={user?.name ?? ""}
      deliveryLocation={user?.deliveryLocation ?? ""}
      cartCount={user?.cartCount ?? 0}
      notificationCount={user?.notificationCount ?? 0}
    />
  );
}
