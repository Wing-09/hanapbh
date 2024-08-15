import { Filter, ListOrdered, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import useMediaQuery from "../hooks/useMediaQuery";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function ListFilter({
  filter,
  setFilter,
}: {
  filter: {
    distance: number;
    property_type: Map<string, string>;
    amenities: Map<string, string>;
  };
  setFilter: Dispatch<
    SetStateAction<{
      distance: number;
      property_type: Map<string, string>;
      amenities: Map<string, string>;
    }>
  >;
}) {
  const [custom_distance, setCustomDistance] = useState({
    display: false,
    value: "",
    items: [] as typeof distance_items,
  });

  const on_desktop = useMediaQuery();

  const distance_items = [
    { name: "Under 100m", value: 100 },
    { name: "Under 200m", value: 200 },
    { name: "Under 300m", value: 300 },
    { name: "Under 400m", value: 400 },
    { name: "Under 500m", value: 500 },
  ];

  const property_type_items = [
    { name: "Boarding House", value: "BOARDING_HOUSE" },
    { name: "Bed Spacer", value: "BED_SPACER" },
    { name: "Apartment", value: "APARTMENT" },
    { name: "Pad", value: "PAD" },
    { name: "Any", value: "ANY" },
  ];

  const amenities_items = [
    { name: "Free water", value: "FREE_WATER" },
    { name: "Free WIFI", value: "FREE_WIFI" },
    { name: "Free electricity", value: "FREE_ELECTRICITY" },
    { name: "Laundry area", value: "LAUNDRY_AREA" },
    { name: "kitchen area", value: "KITCHEN_AREA" },
    { name: "Air condition", value: "AIR_CONDITION" },
    { name: "Private Bathroom", value: "PRIVATE_BATHROOM" },
    { name: "Common bathroom", value: "COMMON_BATHROOM" },
    { name: "Television", value: "TELEVISION" },
    { name: "Lockers", value: "LOCKERS" },
    { name: "CCTV", value: "CCTV" },
    { name: "Parking Lot", value: "PARKING_LOT" },
    { name: "Any", value: "ANY" },
  ];
  return on_desktop ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-1">
          <Filter className="h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter By</DialogTitle>
        </DialogHeader>
        <div className="space-y-8">
          <div className="space-y-5">
            <h1 className="text-lg font-bold">Distance</h1>
            <div className="flex gap-4 flex-wrap">
              {distance_items.map((item) => (
                <Button
                  onClick={() =>
                    setFilter((prev) => ({
                      ...prev,
                      distance: item.value,
                    }))
                  }
                  key={item.name}
                  className="rounded-full"
                  variant={
                    filter.distance === item.value ? "default" : "outline"
                  }
                >
                  {item.name}
                </Button>
              ))}
              <Button
                variant={custom_distance.display ? "default" : "outline"}
                className="rounded-full"
                onClick={() => {
                  setFilter((prev) => ({ ...prev, distance: 0 }));
                  setCustomDistance((prev) => ({
                    ...prev,
                    display: !prev.display,
                  }));
                }}
              >
                Custom
              </Button>
              {!!custom_distance.items.length &&
                custom_distance.items.map((item, index) => (
                  <div key={item.name} className="relative">
                    <Button
                      onClick={() =>
                        setFilter((prev) => ({
                          ...prev,
                          distance: item.value,
                        }))
                      }
                      key={item.name}
                      className="rounded-full"
                      variant={
                        filter.distance === item.value ? "default" : "outline"
                      }
                    >
                      {item.name}
                    </Button>
                    <X
                      className="h-6 absolute -top-2 -right-3 bg-primary rounded-full stroke-2 stroke-background p-1 cursor-pointer"
                      onClick={() => {
                        setCustomDistance((prev) => ({
                          ...prev,
                          display: !(prev.items.length === 1),
                          items: prev.items.toSpliced(index, 1),
                        }));

                        if (custom_distance.items.length === 1)
                          setFilter((prev) => ({ ...prev, distance: 500 }));
                      }}
                    />
                  </div>
                ))}
            </div>
            {custom_distance.display && (
              <form
                autoComplete="off"
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setFilter((prev) => ({
                    ...prev,
                    distance: Number(custom_distance.value),
                  }));

                  if (
                    custom_distance.value === "1000" ||
                    custom_distance.value === "2000" ||
                    custom_distance.value === "3000" ||
                    custom_distance.value === "4000" ||
                    custom_distance.value === "5000"
                  )
                    return;

                  setCustomDistance((prev) => ({
                    ...prev,
                    items: [
                      ...prev.items,
                      {
                        name: "under " + custom_distance.value + "m",
                        value: Number(custom_distance.value),
                      },
                    ],
                  }));

                  setCustomDistance((prev) => ({ ...prev, value: "" }));
                }}
              >
                <Label htmlFor="custom" className="font-bold">
                  Input Custom distance by meter
                </Label>
                <div className="flex items-center space-x-5">
                  <Input
                    type="text"
                    inputMode="numeric"
                    id="custom"
                    className="rounded-full"
                    max={50000}
                    value={custom_distance.value}
                    onChange={(e) =>
                      setCustomDistance((prev) => ({
                        ...prev,
                        value: e.target.value,
                      }))
                    }
                    placeholder="Up to 50000 meters"
                    pattern="^[0-4]?\d{0,4}$|50000"
                    title="Give a valid number"
                  />
                  <Button
                    type="submit"
                    className="rounded-full"
                    disabled={!custom_distance.value}
                  >
                    Confirm
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="p-1">
          <Filter className="h-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter by</DrawerTitle>
          <DrawerClose className="absolute top-0 right-0 w-full flex justify-end h-8"></DrawerClose>
        </DrawerHeader>
        <ScrollArea className="h-[80dvh]">
          <div className="p-5 space-y-8 pb-10">
            <div className="space-y-5">
              <h1 className="text-lg font-bold">Distance</h1>
              <div className="flex gap-3 flex-wrap">
                {distance_items.map((item) => (
                  <Button
                    onClick={() =>
                      setFilter((prev) => ({
                        ...prev,
                        distance: item.value,
                      }))
                    }
                    key={item.name}
                    className="rounded-full"
                    variant={
                      filter.distance === item.value ? "default" : "outline"
                    }
                  >
                    {item.name}
                  </Button>
                ))}

                <Button
                  variant={custom_distance.display ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => {
                    setFilter((prev) => ({ ...prev, distance: 0 }));
                    setCustomDistance((prev) => ({
                      ...prev,
                      display: !prev.display,
                    }));
                  }}
                >
                  Custom
                </Button>
                {!!custom_distance.items.length &&
                  custom_distance.items.map((item, index) => (
                    <div key={item.name} className="relative">
                      <Button
                        onClick={() =>
                          setFilter((prev) => ({
                            ...prev,
                            distance: item.value,
                          }))
                        }
                        key={item.name}
                        className="rounded-full"
                        variant={
                          filter.distance === item.value ? "default" : "outline"
                        }
                      >
                        {item.name}
                      </Button>
                      <X
                        className="h-6 absolute -top-2 -right-3 bg-primary rounded-full stroke-2 stroke-background p-1 cursor-pointer"
                        onClick={() => {
                          setCustomDistance((prev) => ({
                            ...prev,
                            display: !(prev.items.length === 1),
                            items: prev.items.toSpliced(index, 1),
                          }));

                          if (custom_distance.items.length === 1)
                            setFilter((prev) => ({ ...prev, distance: 500 }));
                        }}
                      />
                    </div>
                  ))}
              </div>
              {custom_distance.display && (
                <form
                  autoComplete="off"
                  className="space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFilter((prev) => ({
                      ...prev,
                      distance: Number(custom_distance.value),
                    }));

                    if (
                      custom_distance.value === "1000" ||
                      custom_distance.value === "2000" ||
                      custom_distance.value === "3000" ||
                      custom_distance.value === "4000" ||
                      custom_distance.value === "5000"
                    )
                      return;

                    setCustomDistance((prev) => ({
                      ...prev,
                      items: [
                        ...prev.items,
                        {
                          name: "under " + custom_distance.value + "m",
                          value: Number(custom_distance.value),
                        },
                      ],
                    }));

                    setCustomDistance((prev) => ({ ...prev, value: "" }));
                  }}
                >
                  <Label htmlFor="custom" className="font-bold">
                    Input Custom distance by meter
                  </Label>
                  <div className="flex items-center space-x-5">
                    <Input
                      type="text"
                      inputMode="numeric"
                      id="custom"
                      className="rounded-full"
                      max={50000}
                      value={custom_distance.value}
                      onChange={(e) =>
                        setCustomDistance((prev) => ({
                          ...prev,
                          value: e.target.value,
                        }))
                      }
                      placeholder="Up to 50000 meters"
                      pattern="^[0-4]?\d{0,4}$|50000"
                      title="Give a valid number"
                    />
                    <Button
                      type="submit"
                      className="rounded-full"
                      disabled={!custom_distance.value}
                    >
                      Confirm
                    </Button>
                  </div>
                </form>
              )}
            </div>
            <div className="space-y-5">
              <h1 className="text-lg font-bold">Property Type</h1>
              <div className="flex gap-3 flex-wrap">
                {property_type_items.map((item) => (
                  <Button
                    onClick={() => {
                      const new_map = filter.property_type;
                      if (new_map.has(item.value)) {
                        new_map.delete(item.value);
                      } else {
                        new_map.set(item.value, item.value);
                      }
                      setFilter((prev) => ({
                        ...prev,
                        property_type: new_map,
                      }));
                    }}
                    key={item.name}
                    className="rounded-full"
                    variant={
                      filter.property_type.has(item.value)
                        ? "default"
                        : "outline"
                    }
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <h1 className="text-lg font-bold">Amenities</h1>
              <div className="flex gap-3 flex-wrap">
                {amenities_items.map((item) => (
                  <Button
                    onClick={() => {
                      const new_map = filter.amenities;
                      if (new_map.has(item.value)) {
                        new_map.delete(item.value);
                      } else {
                        new_map.set(item.value, item.value);
                      }
                      setFilter((prev) => ({
                        ...prev,
                        amenities: new_map,
                      }));
                    }}
                    key={item.name}
                    className="rounded-full"
                    variant={
                      filter.amenities.has(item.value) ? "default" : "outline"
                    }
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
