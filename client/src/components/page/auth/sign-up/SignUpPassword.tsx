import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/types/data-type";
import { cn } from "@/lib/utils";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction, useState } from "react";

export default function SignUpPassword({
  form_data,
  setFormData,
}: {
  form_data: User;
  setFormData: Dispatch<SetStateAction<User>>;
}) {
  const [see_password, setSeePassword] = useState([false, false]);
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");

  return (
    <div className="space-y-5">
      <div>
        <div className="flex relative w-full">
          <Input
            minLength={8}
            placeholder="Password"
            className="h-10 text-base md:w-full"
            type={see_password[0] ? "text" : "password"}
            value={password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <Button
            type="button"
            variant="ghost"
            tabIndex={-1}
            className="absolute p-1 h-fit w-auto rounded-full right-2 top-1/2 -translate-y-1/2"
            onClick={() => setSeePassword((prev) => [!prev[0], prev[1]])}
          >
            {see_password[0] ? (
              <EyeOpenIcon className="h-5 w-auto" />
            ) : (
              <EyeClosedIcon className="h-5 w-auto " />
            )}
          </Button>
        </div>
        {password !== "" && password.length < 8 && (
          <p className="text-red-600 text-xs my-2">
            Password must be at least 8 characters long
          </p>
        )}
      </div>
      <div className="flex relative w-full">
        <Input
          minLength={8}
          placeholder="Confirm Password"
          className={cn(
            "h-10  text-base md:w-full",
            confirm_password !== "" && confirm_password !== password
              ? "border-destructive focus-visible:ring-destructive "
              : ""
          )}
          type={see_password[1] ? "text" : "password"}
          value={confirm_password}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              confirm_password: e.target.value,
            }))
          }
        />
        <Button
          variant="ghost"
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer h-fit w-auto p-1 "
          onClick={() => setSeePassword((prev) => [prev[0], !prev[1]])}
        >
          {see_password[1] ? (
            <EyeOpenIcon className="h-5 w-auto" />
          ) : (
            <EyeClosedIcon className="h-5 w-auto " />
          )}
        </Button>
      </div>
      {confirm_password !== "" && confirm_password !== password && (
        <p className="text-red-600 text-xs my-2">Password does not match.</p>
      )}
    </div>
  );
}
