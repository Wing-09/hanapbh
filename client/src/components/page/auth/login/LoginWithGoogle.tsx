import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function LoginWithGoogle() {
  const url_callback = useSearchParams().get("url_callback");

  async function signInWithGoogle() {

  }
  return (
    <Button variant="secondary" onClick={signInWithGoogle} className="font-bold">
      Continue with GOOGLE
    </Button>
  );
}
