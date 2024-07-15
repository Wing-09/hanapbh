"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

export function ThemeToggler() {
  const { setTheme, theme } = useTheme();
  const [is_light, setIsLight] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      setIsLight(false);
    }
    if (theme === "light") {
      setIsLight(true);
    }
  }, [theme]);

  return (
    <div className="flex items-center justify-center py-3 space-x-5 md:py-2">
      <motion.label
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        key={theme}
        htmlFor="toggle"
        className="cursor-pointer"
      >
        {is_light ? (
          <SunIcon className="w-auto h-5" />
        ) : (
          <MoonIcon className="w-auto h-5" />
        )}
      </motion.label>
      <Switch
        id="toggle"
        checked={is_light}
        onCheckedChange={(e) => {
          setIsLight(e);
          setTheme(e ? "light" : "dark");
        }}
      />
    </div>
  );
}
