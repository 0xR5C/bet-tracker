"use client"

import { createContext, useState } from "react";

type BetProviderContextType = {
  betText: string;
  setBetText: (betText: string) => void;
}


export const BetProviderContext = createContext<BetProviderContextType>({
  betText: "",
  setBetText: () => { }
});

function BetProvider({ children }: { children: React.ReactNode }) {
  const [betText, setBetText] = useState("");

  return (
    <BetProviderContext.Provider value={{ betText, setBetText }}>
      {children}
    </BetProviderContext.Provider>
  );
}

export default BetProvider;