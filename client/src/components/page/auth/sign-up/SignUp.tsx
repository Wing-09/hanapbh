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
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/lib/types/data-type";
import SignUpBirthday from "./SignUpBirthDay";
import SignUPGender from "./SignUpGender";
import SignUpOTP from "./SignUpOtp";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SignUp() {
  const [form_data, setFormData] = useState<Omit<User, "id">>({
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
      url: "",
    },
  });

  const router = useRouter();
  const exit = useSearchParams().get("exit");

  return (
    <Dialog
      defaultOpen
      onOpenChange={(e) =>
        e === false && router.replace(exit && exit !== "null" ? exit : "/")
      }
    >
      <DialogTrigger></DialogTrigger>
      <DialogContent className="w-[clamp(25rem, 25rem, 95vw)] p-0">
        <ScrollArea className="h-[90dvh]">
          <div className="p-6 space-y-5">
            <DialogHeader>
              <DialogTitle className="text-xl text-center">Sign up</DialogTitle>
            </DialogHeader>
            <form className="space-y-5 p-1">
              <SignUpName form_data={form_data} setFormData={setFormData} />
              <SignUpEmail form_data={form_data} setFormData={setFormData} />
              <SignUpBirthday setFormData={setFormData} />
              <SignUPGender form_data={form_data} setFormData={setFormData} />
              <SignUpPassword form_data={form_data} setFormData={setFormData} />
              <SignUpOTP form_data={form_data} setFormData={setFormData} />
            </form>
            <DialogFooter className="text-center mx-auto">
              <p>Already have an account ?</p>
              <Link
                href={"/login?exit=" + exit}
                as={"/login?exit=" + exit}
                prefetch
                className="font-bold"
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
