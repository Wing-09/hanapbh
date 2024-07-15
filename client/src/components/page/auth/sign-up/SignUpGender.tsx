import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/types/data-type";
import React, { Dispatch, SetStateAction, useState } from "react";

type Gender = NonNullable<User["gender"]>;

export default function SignUPGender({
  form_data,
  setFormData,
}: {
  form_data: Omit<User, "id">;
  setFormData: Dispatch<SetStateAction<Omit<User, "id">>>;
}) {
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
            type="button"
            variant={
              form_data.gender?.type === item.value ? "default" : "secondary"
            }
            className="grow"
            onClick={() =>
              setFormData((prev) => ({
                ...prev!,
                gender: { ...prev.gender!, type: item.value },
              }))
            }
          >
            {item.name}
          </Button>
        ))}
      </div>
      {form_data.gender!.type === "OTHER" && (
        <Input
          placeholder="Specify gender"
          className="text-base h-10"
          value={form_data.gender?.other}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              gender: { ...prev.gender!, other: e.target.value.toUpperCase() },
            }))
          }
        />
      )}
    </div>
  );
}
