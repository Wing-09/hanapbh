import { ListOrdered } from "lucide-react";
import { Button } from "../ui/button";
import {
  DrawerTitle,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";
import { Dispatch, SetStateAction } from "react";
import useMediaQuery from "../hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function ListSort({
  sort,
  setSort,
}: {
  sort: {
    name: string;
    distance: string;
  };
  setSort: Dispatch<
    SetStateAction<{
      name: string;
      distance: string;
    }>
  >;
}) {
  const on_desktop = useMediaQuery();

  const name_sort_items = [
    { name: "Ascend", value: "ascend" },
    { name: "Descend", value: "descend" },
  ];
  const distance_sort_items = [
    { name: "Ascend", value: "ascend" },
    { name: "Descend", value: "descend" },
  ];

  return on_desktop ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-1">
          <ListOrdered className="h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sort by</DialogTitle>
        </DialogHeader>
        <div className="p-5 space-y-8 pb-10">
          <div className="space-y-5">
            <h1 className="text-lg font-bold">Name</h1>
            <div className="flex gap-3 flex-wrap">
              {name_sort_items.map((item) => (
                <Button
                  onClick={() =>
                    setSort((prev) => ({
                      ...prev,
                      name: item.value === prev.name ? "" : item.value,
                    }))
                  }
                  key={item.name}
                  className="rounded-full"
                  variant={sort.name === item.value ? "default" : "outline"}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <h1 className="text-lg font-bold">Distance</h1>
            <div className="flex gap-3 flex-wrap">
              {distance_sort_items.map((item) => (
                <Button
                  onClick={() =>
                    setSort((prev) => ({
                      ...prev,
                      distance: item.value,
                    }))
                  }
                  key={item.name}
                  className="rounded-full"
                  variant={sort.distance === item.value ? "default" : "outline"}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="p-1">
          <ListOrdered className="h-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Sort by</DrawerTitle>
        </DrawerHeader>
        <div className="p-5 space-y-8 pb-10">
          <div className="space-y-5">
            <h1 className="text-lg font-bold">Name</h1>
            <div className="flex gap-3 flex-wrap">
              {name_sort_items.map((item) => (
                <Button
                  onClick={() =>
                    setSort((prev) => ({
                      ...prev,
                      name: item.value === prev.name ? "" : item.value,
                    }))
                  }
                  key={item.name}
                  className="rounded-full"
                  variant={sort.name === item.value ? "default" : "outline"}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <h1 className="text-lg font-bold">Distance</h1>
            <div className="flex gap-3 flex-wrap">
              {distance_sort_items.map((item) => (
                <Button
                  onClick={() =>
                    setSort((prev) => ({
                      ...prev,
                      distance: item.value,
                    }))
                  }
                  key={item.name}
                  className="rounded-full"
                  variant={sort.distance === item.value ? "default" : "outline"}
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
