import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";

export default function LoginWithCredentials() {
  const [email, setEmail] = useState("");
  const [see_password, setSeePassword] = useState(false);
  const [password, setPassword] = useState("");
  return (
    <form className="space-y-5">
      <Input
        placeholder="Email"
        type="email"
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
            <EyeOpenIcon className="h-full w-auto" />
          ) : (
            <EyeClosedIcon className="h-full w-auto" />
          )}
        </Button>
      </div>
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
}
