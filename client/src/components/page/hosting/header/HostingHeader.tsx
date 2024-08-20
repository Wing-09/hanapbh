"use client";

import HostingAsideMobile from "../aside/HostingAsideMobile";
import HostingPathCrumb from "./HostingPathCrumb";
import HeaderDropdownMenu from "../../layout/header/HeaderDropdownMenu";

export default function HostingHeader() {
  return (
    <header className="grow flex items-center justify-between p-5 ">
      <span className="flex">
        <HostingAsideMobile />
        <HostingPathCrumb />
      </span>
      <HeaderDropdownMenu />
    </header>
  );
}
