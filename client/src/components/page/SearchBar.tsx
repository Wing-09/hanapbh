import { Filter, ListOrdered, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import useMediaQuery from "../hooks/useMediaQuery";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function Filter() {
  const [filter, setFilter] = useState({
    distance: 1000,
    property_type: [],
    amenities: [],
  });

  const [custom_distance, setCustomDistance] = useState({
    display: false,
    value: "",
    items: [] as typeof distance_items,
  });

  const on_desktop = useMediaQuery();

  const distance_items = [
    { name: "Under 1km", value: 10000 },
    { name: "Under 2km", value: 20000 },
    { name: "Under 3km", value: 30000 },
    { name: "Under 4km", value: 40000 },
    { name: "Under 5km", value: 50000 },
  ];

  const property_type_items = [
    { name: "Boarding House", value: "BOARDING_HOUSE" },
    { name: "Bed Spacer", value: "BED_SPACER" },
    { name: "Apartment", value: "APARTMENT" },
    { name: "Pad", value: "PAD" },
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
  ];
  return (
    <div className="flex items-center mx-5 space-x-1">
      {on_desktop ? null : (
        <>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" className="p-1">
                <Filter className="h-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filter by</DrawerTitle>
              </DrawerHeader>
              <div className="space-y-5 p-5">
                <h1>Distance</h1>
                <div className="flex gap-3 flex-wrap">
                  {distance_items.map((item) => (
                    <Button
                      onClick={() =>
                        setFilter((prev) => ({ ...prev, distance: item.value }))
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
                    variant="outline"
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
                  {custom_distance.items.length > 0 &&
                    custom_distance.items.map((item) => (
                      <div className="relative">
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
                            filter.distance === item.value
                              ? "default"
                              : "outline"
                          }
                        >
                          {item.name}
                        </Button>
                        <X className="h-6 absolute -top-2 -right-3 bg-primary rounded-full stroke-2 stroke-background p-1" onClick={()=> set}/>
                      </div>
                    ))}
                </div>

                {custom_distance.display && (
                  <form
                    className="space-y-3"
                    onSubmit={(e) => {
                      e.preventDefault();

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

                      setFilter((prev) => ({
                        ...prev,
                        distance: Number(custom_distance.value),
                      }));
                      setCustomDistance((prev) => ({ ...prev, value: "" }));
                    }}
                  >
                    <Label htmlFor="custom">
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
                      <Button type="submit">Confirm</Button>
                    </div>
                  </form>
                )}
              </div>
            </DrawerContent>
          </Drawer>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" className="p-1">
                <ListOrdered className="h-4" />
              </Button>
            </DrawerTrigger>
          </Drawer>
        </>
      )}
    </div>
  );
}
