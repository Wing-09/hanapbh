import { Input } from "@/components/ui/input";
import { User } from "@/lib/types/data-type";
import { Dispatch, SetStateAction } from "react";

export default function SignUpEmail({
  form_data,
  setFormData,
}: {
  form_data: Omit<User, "id">;
  setFormData: Dispatch<SetStateAction<Omit<User, "id">>>;
}) {
  return (
    <Input
      autoComplete="on"
      placeholder="Email"
      className="h-10 w-full text-base"
      type="email"
      value={form_data.email}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, email: e.target.value }))
      }
    />
  );
}
