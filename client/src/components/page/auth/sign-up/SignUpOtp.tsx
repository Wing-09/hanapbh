import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { User } from "@/lib/types/data-type";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import useHTTPRequest from "@/components/hooks/useHTTPRequest";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import LoadingSvg from "@/components/svg/LoadingSvg";

export default function SignUpOTP({
  form_data,
  setFormData,
}: {
  form_data: Omit<User, "id">;
  setFormData: Dispatch<SetStateAction<Omit<User, "id">>>;
}) {
  const resend_initial = { time: 30, open: true, interval_id: undefined };
  const [resend, setResend] = useState<{
    time: number;
    open: boolean;
    interval_id?: NodeJS.Timeout;
  }>(resend_initial);
  const [submit, setSubmit] = useState<boolean>(false);
  const [code, setCode] = useState<string>();
  const [creating_otp, setCreatingOtp] = useState(false);

  const http_request = useHTTPRequest();
  const submit_btn_ref = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();
  const exit = useSearchParams().get("exit");

  async function handleResend() {
    const id = setInterval(() => {
      setResend((prev) => ({ ...prev, time: prev.time - 1 }));
    }, 1000);
    setResend((prev) => ({ ...prev, open: false, interval_id: id }));
    await createOTP();
    setResend((prev) => ({ ...prev, interval_id: id }));
  }

  async function createOTP() {
    try {
      setCreatingOtp(true);
      await http_request.POST("/v1/otp", { email: form_data.email });
      setCreatingOtp(false);
    } catch (error) {
      setCreatingOtp(false);
      throw error;
    }
  }

  async function submitForm() {
    setSubmit(true);
    try {
      const { status: otp_status } = await http_request.POST(
        "/v1/otp/authenticate",
        {
          otp: code,
          email: form_data.email,
        }
      );

      if (otp_status !== "OK") {
        setSubmit(false);

        return;
      }

      const { status: new_user_status } = await http_request.POST(
        "/v1/user",
        form_data
      );

      if (new_user_status !== "CREATED") {
        setSubmit(false);
        return;
      }

      const sign_in = await signIn("credentials", {
        email: form_data.email,
        password: form_data.password,
        redirect: true,
        callbackUrl: !exit ? "/" : exit === "null" ? "/" : exit,
      });

      if (sign_in?.error) {
        toast({
          title: "Oops! Something went wrong",
          description: sign_in.error,
          action: <ToastAction altText="OK">OK</ToastAction>,
        });
      }
      setSubmit(false);
    } catch (error) {
      setSubmit(false);
      throw error;
    }
  }
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
          disabled={
            !form_data.first_name ||
            !form_data.last_name ||
            !form_data.email ||
            !form_data.birthday ||
            !form_data.gender?.type ||
            !form_data.password ||
            (form_data.gender.type === "OTHER" && !form_data.gender.other)
          }
          onClick={createOTP}
        >
          Sign up
        </Button>
      </DialogTrigger>
      {creating_otp ? (
        <DialogContent className="grid place-items-center">
          <p className="font-bold text-xl">Sending OTP</p>{" "}
          <LoadingSvg className="h-20" />
        </DialogContent>
      ) : (
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
          <Button
            className="w-full"
            type="submit"
            disabled={!code}
            onClick={submitForm}
          >
            {submit ? <LoadingSvg className="h-8" /> : "Verify"}
          </Button>
        </DialogContent>
      )}
    </Dialog>
  );
}
