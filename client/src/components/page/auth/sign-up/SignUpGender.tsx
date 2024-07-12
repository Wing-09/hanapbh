import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User } from "@/lib/types/data-type";
import React, { Dispatch, SetStateAction, useState } from "react";

type Gender = User["gender"];
export default function SignUPGender({
  form_data,
  setFormData,
}: {
  form_data: User;
  setFormData: Dispatch<SetStateAction<User>>;
}) {
  const [selected, setSelected] = useState<Gender["type"]>("");
  const [other, setOther] = useState("");

  const items = [
    { name: "Male", value: "MALE" },
    { name: "Female", value: "FEMALE" },
    { name: "Other", value: "OTHER" },
  ] as { name: string; value: Gender["type"] }[];

  return (
    <div className="space-y-5">
      <p className="text-center font-semibold">Gender</p>
      <div className="flex justify-between space-x-5">
        {items.map((item) => (
          <Button
            key={item.name}
            variant={selected === item.value ? "default" : "secondary"}
            className="grow"
            onClick={() => setSelected(item.value)}
          >
            {item.name}
          </Button>
        ))}
      </div>
      {selected === "OTHER" && (
        <Input
          placeholder="Specify gender"
          className="text-base h-10"
          value={other}
          onChange={(e) => setOther(e.target.value)}
        />
      )}
    </div>
  );
}
