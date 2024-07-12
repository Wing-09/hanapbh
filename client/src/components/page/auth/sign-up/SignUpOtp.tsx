import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { User } from "@/lib/types/data-type";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function SignUpOTP({
  form_data,
  setFormData,
}: {
  form_data: User;
  setFormData: Dispatch<SetStateAction<User>>;
}) {
  const resend_initial = { time: 30, open: true, interval_id: undefined };
  const [resend, setResend] = useState<{
    time: number;
    open: boolean;
    interval_id?: NodeJS.Timeout;
  }>(resend_initial);
  const [submit, setSubmit] = useState<boolean>(false);
  const [code, setCode] = useState<string>();

  const submit_btn_ref = useRef<HTMLButtonElement>(null);
  let form_complete = false;
  for (const item in form_data) {
    if (!form_data[item as keyof User]) form_complete = false;
    else form_complete = true;
  }

  async function handleResend() {
    const id = setInterval(() => {
      setResend((prev) => ({ ...prev, time: prev.time - 1 }));
    }, 1000);
    setResend((prev) => ({ ...prev, open: false, interval_id: id }));

    setResend((prev) => ({ ...prev, interval_id: id }));
  }

  // async function submitForm()  {
  //           e.preventDefault();
  //           setSubmitting(true);
  //           try {
  //             const response = await fetch(
  //               development_server + "/authenticate/otp",
  //               {
  //                 method: "POST",
  //                 headers: {
  //                   "Content-Type": "application/json",
  //                 },
  //                 body: JSON.stringify({ otp: value, email: form_data.email }),
  //               }
  //             );
  //             const otp_reponse = await response.json();

  //             if (otp_reponse.status !== "OK") {
  //               toast({
  //                 title: otp_reponse.message,
  //                 action: <ToastAction altText="OK">OK</ToastAction>,
  //               });
  //               setSubmitting(false);
  //               return;
  //             }

  //             const create_user_response = await fetch(
  //               development_server + "/create/v1/user",
  //               {
  //                 method: "POST",
  //                 headers: {
  //                   "Content-Type": "application/json",
  //                 },
  //                 body: JSON.stringify({
  //                   email: form_data.email,
  //                   display_name: form_data.display_name,
  //                   user_name: form_data.user_name,
  //                   password: form_data.password,
  //                   birth_date: form_data.birth_date,
  //                   profile_pic: {
  //                     photo_url: "",
  //                   },
  //                 }),
  //               }
  //             );

  //             const create_user = await create_user_response.json();
  //             if (create_form_data.status !== "OK")
  //               toast({
  //                 title: "Oops! Something went wrong",
  //                 description: create_form_data.message,
  //                 action: <ToastAction altText="OK">OK</ToastAction>,
  //               });

  //             const sign_in = await signIn("credentials", {
  //               email: form_data.email,
  //               password: form_data.password,
  //               redirect: true,
  //               callbackUrl: "/chat",
  //             });

  //             if (sign_in?.error) {
  //               toast({
  //                 title: "Oops! Something went wrong",
  //                 description: sign_in.error,
  //                 action: <ToastAction altText="OK">OK</ToastAction>,
  //               });
  //             }
  //             setSubmitting(false);
  //           } catch (error) {
  //             toast({
  //               title: "Oops! Something went wrong",
  //               action: <ToastAction altText="OK">OK</ToastAction>,
  //             });
  //             setSubmitting(false);
  //           }
  //         }
  if (resend.time < 1) {
    clearInterval(resend.interval_id);
    setResend(resend_initial);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          ref={submit_btn_ref}
          className="w-full"
          type="button"
          disabled={!form_complete}
        >
          Sign up
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="grid">
          <DialogClose asChild>
            <Button variant="link" className="w-fit justify-start p-0 mb-5">
              <ChevronLeftIcon className="h-5" /> back
            </Button>
          </DialogClose>
          <p className="">An OTP was sent to your email:</p>
          <p className="italic">
            {form_data.email ? form_data.email : "user@example.com"}
          </p>
          <p className="my-5"> Please check your inbox.</p>
        </div>
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          value={code}
          onChange={(value) => setCode(value.toUpperCase())}
        >
          <InputOTPGroup className="w-full flex justify-between space-x-5">
            <InputOTPSlot
              index={0}
              className="aspect-square w-11 h-auto text-base border rounded first:rounded-l"
            />
            <InputOTPSlot
              index={1}
              className="aspect-square w-11 h-auto text-base border rounded"
            />
            <InputOTPSlot
              index={2}
              className="aspect-square w-11 h-auto text-base border rounded"
            />
            <InputOTPSlot
              index={3}
              className="aspect-square w-11 h-auto text-base border rounded"
            />
            <InputOTPSlot
              index={4}
              className="aspect-square w-11 h-auto text-base border rounded"
            />
            <InputOTPSlot
              index={5}
              className="aspect-square w-11 h-auto text-base border rounded last:rounded-r"
            />
          </InputOTPGroup>
        </InputOTP>
        <Button
          size="sm"
          variant="ghost"
          className="mx-auto"
          disabled={!resend.open}
          type="button"
          onClick={handleResend}
        >
          resend {!resend.open && "(" + resend.time + ")"}
        </Button>
        <Button className="w-full" type="submit" disabled={!code}>
          Verify
          {/* {submitting ? <LoadingSvg className="h-8" /> : "Verify"} */}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
