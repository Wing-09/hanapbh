"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import SignUpName from "./SignUpName";
import SignUpEmail from "./SignUpEmail";
import SignUpPassword from "./SignUpPassword";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/lib/types/data-type";
import SignUpBirthday from "./SignUpBirthDay";
import SignUPGender from "./SignUpGender";
import SignUpOTP from "./SignUpOtp";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
      <DialogContent className="w-screen sm:w-[25rem] h-screen sm:h-auto p-0">
        <div className="relative">
          <DialogClose className="absolute top-2 right-3 z-10" asChild>
            <Button variant="ghost" className="h-fit w-auto p-1 rounded-full">
              <X className="h-5" />
            </Button>
          </DialogClose>
          <ScrollArea className="h-[90dvh]">
            <div className="p-6 space-y-5 flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-xl text-center">
                  Sign up
                </DialogTitle>
              </DialogHeader>
              <form className="space-y-5 p-1">
                <SignUpName form_data={form_data} setFormData={setFormData} />
                <SignUpEmail form_data={form_data} setFormData={setFormData} />
                <SignUpBirthday setFormData={setFormData} />
                <SignUPGender form_data={form_data} setFormData={setFormData} />
                <SignUpPassword
                  form_data={form_data}
                  setFormData={setFormData}
                />
                <SignUpOTP form_data={form_data} setFormData={setFormData} />
              </form>
              <section className="justify-center flex flex-nowrap space-x-5 h-10">
                <p>Already have an account ?</p>
                <Link
                  href={"/login?exit=" + exit}
                  as={"/login?exit=" + exit}
                  prefetch
                  className="font-bold "
                >
                  Login
                </Link>
              </section>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
