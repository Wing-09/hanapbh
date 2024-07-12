"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import SignUpName from "./SignUpName";
import SignUpEmail from "./SignUpEmail";
import SignUpPassword from "./SignUpPassword";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/lib/types/data-type";
import SignUpBirthday from "./SignUpBirthDay";
import SignUPGender from "./SignUpGender";
import SignUpOTP from "./SignUpOtp";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SignUp() {
  const [form_data, setFormData] = useState<User>({
    first_name: "",
    last_name: "",
    email: "",
    gender: {
      type: "",
      other: "",
    },
    password: "",

    photo: {
      height: 0,
      width: 0,
      type: "PROFILE_PIC",
      url: "",
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const exit = searchParams.get("exit");
  const url_callback = searchParams.get("url_callback");

  return (
    <Dialog
      defaultOpen
      onOpenChange={(e) =>
        e === false && router.replace(exit && exit !== "null" ? exit : "/")
      }
    >
      <DialogContent className="w-[clamp(25rem, 25rem, 95vw)]  p-0">
        <ScrollArea className="h-[90dvh]">
          <div className="p-6 space-y-5">
            <DialogHeader>
              <DialogTitle className="text-xl text-center">Sign up</DialogTitle>
            </DialogHeader>
            <form className="space-y-5 p-1">
              <SignUpName form_data={form_data} setFormData={setFormData} />
              <SignUpEmail form_data={form_data} setFormData={setFormData} />
              <SignUpBirthday form_data={form_data} setFormData={setFormData} />
              <SignUPGender form_data={form_data} setFormData={setFormData} />
              <SignUpPassword form_data={form_data} setFormData={setFormData} />
              <SignUpOTP form_data={form_data} setFormData={setFormData} />
            </form>
            <DialogFooter className="text-center justify-self-center ">
              <p>Already have an account ?</p>
              <Link
                href={"/login?exit=" + exit}
                as={"/login?exit=" + exit}
                prefetch
                className="font-bold mx-3"
              >
                Login
              </Link>
            </DialogFooter>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
