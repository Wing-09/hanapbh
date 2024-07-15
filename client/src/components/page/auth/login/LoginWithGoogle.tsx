import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import GoogleSvg from "@/components/svg/GoogleSvg";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export default function LoginWithGoogle() {
  const exit = useSearchParams().get("exit");
  const { toast } = useToast();
  const router = useRouter();

  async function signInWithGoogle() {
    try {
      const response = await signIn("google", {
        redirect: true,
        callbackUrl: !exit ? "/" : exit === "null" ? "/" : exit,
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
