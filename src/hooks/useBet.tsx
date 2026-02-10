"use client"

import { BetProviderContext } from "@/providers/BetProvider";
import { useContext } from "react";

function useBet() {
  const context = useContext(BetProviderContext);

  if (!context) throw new Error("useNote must be used with a BetProvider")

  return context;
}

export default useBet;