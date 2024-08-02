import LoadingSvg from "@/components/svg/LoadingSvg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { FormEvent, useState } from "react";

export default function LoginWithCredentials() {
  const [email, setEmail] = useState("");
  const [see_password, setSeePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const exit = useSearchParams().get("exit");
  async function submitForm(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: !exit ? "/" : exit === "null" ? "/" : exit,
      });

      if (response?.error) {
        toast({ description: response.error });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  return (
    <form className="space-y-5" onSubmit={submitForm}>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="relative">
        <Input
          placeholder="Password"
          type={see_password ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="button"
          tabIndex={-1}
          variant="ghost"
          size="sm"
          className="p-1 aspect-square w-auto rounded-full absolute top-1/2 -translate-y-1/2 right-3"
          onClick={() => setSeePassword((prev) => !prev)}
        >
          {see_password ? (
            <Eye className="h-full w-auto" />
          ) : (
            <EyeOff className="h-full w-auto" />
          )}
        </Button>
      </div>
      <Button type="submit" className="w-full">
        {loading ? <LoadingSvg className="h-5" /> : "Login"}
      </Button>
    </form>
  );
}
