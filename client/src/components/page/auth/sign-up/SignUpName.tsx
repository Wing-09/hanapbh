import { Input } from "@/components/ui/input";
import { User } from "@/lib/types/data-type";
import { Dispatch, SetStateAction } from "react";

export default function SignUpName({
  form_data,
  setFormData,
}: {
  form_data: User;
  setFormData: Dispatch<SetStateAction<User>>;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Input
        placeholder="First name"
        className="h-10 text-base"
        value={form_data.first_name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, first_name: e.target.value }))
        }
      />
      <Input
        placeholder="Last Name"
        className="h-10 text-base"
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, last_name: e.target.value }))
        }
      />
    </div>
  );
}
