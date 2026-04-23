"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // No login required - redirect to admin
    router.push("/admin");
  }, [router]);

  return null;
}
