"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { MainHeader } from "@/features/header/components/main-header";
import { SecondaryNav } from "@/features/header/components/secondary-nav";

interface Profile {
  firstName: string;
  lastName?: string;
  defaultAddress?: { city: string };
}

interface Cart {
  items: unknown[];
}

async function fetchUserProfile(): Promise<Profile> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        firstName: "mash3L",
        lastName: "",
        defaultAddress: { city: "Cairo" },
      });
    }, 500);
  });
}

async function fetchCart(): Promise<Cart> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ items: [1, 2] });
    }, 500);
  });
}

export function SiteHeader() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const { data: profile } = useQuery<Profile>({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    enabled: isAuthenticated,
  });

  const { data: cart } = useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: isAuthenticated,
  });

  const authData = {
    isAuthenticated,
    userName: profile?.firstName
      ? `${profile.firstName} ${profile.lastName || ""}`.trim()
      : session?.user?.name || "",
    deliveryLocation: profile?.defaultAddress?.city || "Cairo",
    cartCount: cart?.items?.length || 0,
    notificationCount: 5,
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      <MainHeader {...authData} />
      <SecondaryNav />
    </header>
  );
}
