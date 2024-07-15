import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/lib/types/data-type";
import { cn } from "@/lib/utils";
import { Span } from "next/dist/trace";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type DateType = {
  year: number;
  month:
    | "January"
    | "February"
    | "March"
    | "April"
    | "May"
    | "June"
    | "July"
    | "August"
    | "September"
    | "October"
    | "November"
    | "December";
  day: number;
};
export default function SignUpBirthday({
  setFormData,
}: {
  setFormData: Dispatch<SetStateAction<Omit<User, "id">>>;
}) {
  const [date, setDate] = useState<DateType>();
  const [year_list, setYearList] = useState<number[]>([]);
  const [days, setDays] = useState<number>();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ] as DateType["month"][];

  useEffect(() => {
    if (!date?.day) return;

    const bd = new Date(`${date?.month} ${date?.day}, ${date?.year}`);
    // const date_now = new Date();
    // const age =
    //   (date_now.getTime() - bd.getTime()) / (1000 * 60 * 60 * 24 * 365);

    // if(age < 18)
    setFormData((prev) => ({ ...prev!, birthday: bd }));
  }, [date?.day]);

  useEffect(() => {
    const y = [] as number[];
    const current_year = new Date().getUTCFullYear();

    for (let i = 0; i < 100; i++) {
      y.push(current_year - i);
    }
    setYearList(y);
  }, []);

  useEffect(() => {
    if (!date?.month && !date?.year) return;
    if (date?.month === "February") {
      if (date.year % 4 === 0) setDays(29);
      else setDays(28);
    } else if (
      date?.month === "April" ||
      date?.month === "June" ||
      date?.month === "September" ||
      date?.month === "November"
    )
      setDays(30);
    else setDays(31);
  }, [date?.month, date?.year]);
  return (
    <div className="space-y-3">
      <p className="text-center font-semibold">Birthday</p>

      <div className="flex justify-evenly space-x-5">
        {/* Year */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="text-base  h-10 grow"
              variant={date?.year ? "default" : "secondary"}
            >
              {date?.year ? date!.year : "Year"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" scroll" asChild>
            <ScrollArea className="h-[50vh] ">
              {year_list.length > 0 &&
                year_list.map((year, index) => (
                  <div key={year}>
                    <DropdownMenuItem
                      key={index}
                      className="cursor-pointer"
                      onClick={() => setDate((prev) => ({ ...prev!, year }))}
                    >
                      {year}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>
                ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Month */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="text-base  h-10 grow"
              variant={date?.month ? "default" : "secondary"}
            >
              {date?.month ? date?.month : "Month"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent asChild>
            <ScrollArea className={date?.year ? "h-[40vh]" : ""}>
              {date?.year ? (
                months.map((month) => (
                  <div key={month}>
                    <DropdownMenuItem
                      className=" cursor-pointer"
                      onClick={() => setDate((prev) => ({ ...prev!, month }))}
                    >
                      {month}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a year first
                </p>
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Day */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="text-base  h-10 grow"
              variant={date?.day ? "default" : "secondary"}
            >
              {date?.day ? date?.day : "Day"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent asChild>
            <ScrollArea className={days ? "h-[40vh]" : ""}>
              {days ? (
                Array.from({ length: days }).map((_, index) => (
                  <div key={index}>
                    <DropdownMenuItem
                      className=" cursor-pointer"
                      onClick={() =>
                        setDate((prev) => ({
                          ...prev!,
                          day: index + 1,
                        }))
                      }
                    >
                      {index + 1}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a Month first
                </p>
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* {age < 18 && (
        <p className="text-red-600 text-xs mx-auto w-full flex justify-center">
          user must not be under 18
        </p>
      )} */}
      </div>
    </div>
  );
}
