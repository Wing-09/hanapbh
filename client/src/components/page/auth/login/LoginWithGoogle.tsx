import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import GoogleSvg from "@/components/svg/GoogleSvg";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function LoginWithGoogle() {
  const cb_url = useSearchParams().get("cb_url");
  const exit = useSearchParams().get("exit");
  const { toast } = useToast();
  const router = useRouter();

  async function signInWithGoogle() {
    let callbackUrl = "/";

    if (cb_url) {
      callbackUrl = cb_url;
    } else if (exit) {
      callbackUrl = exit;
    }

    
    try {
      const response = await signIn("google", {
        redirect: true,
        callbackUrl,
      });

      if (response?.error) {
        toast({
          description: response.error,
        });
        return;
      }
    } catch (error) {
      throw error;
    }
  }
  return (
    <Button
      variant="secondary"
      onClick={signInWithGoogle}
      className="space-x-5"
    >
      <GoogleSvg className="h-5 w-auto" /> <strong>Continue with GOOGLE</strong>
    </Button>
  );
}
