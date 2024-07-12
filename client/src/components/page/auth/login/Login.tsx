"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoginWithCredentials from "./LoginWithCredentials";
import LoginWithGoogle from "./LoginWithGoogle";

export default function Login() {
  const router = useRouter();
  const search_params = useSearchParams();
  const exit = search_params.get("exit");

  return (
    <Dialog
      defaultOpen
      onOpenChange={(e) =>
        e === false && router.replace(exit && exit !== "null" ? exit : "/")
      }
    >
      <DialogContent className="space-y-5 w-[clamp(25rem,_25rem,_95vw)]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Log in</DialogTitle>
        </DialogHeader>
        {/* login with email & password */}
        <LoginWithCredentials />
        <div className="flex items-center w-full space-x-5">
          <hr className="h-[1px] w-1/2 bg-secondary" />
          <p>or</p>
          <hr className="h-[1px] w-1/2 bg-secondary" />
        </div>
        {/* login with google OAuth */}
        <LoginWithGoogle />
        <DialogFooter className="w-full flex justify-center">
          <Button className="mx-auto" variant="ghost">
            <Link
              href={"/sig-nup?exit=" + exit}
              as={"/sign-up?exit=" + exit}
              prefetch
              className="font-bold"
            >
              Create new account
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
