"use client";

import useBet from "@/hooks/useBet";
import { Bet } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarMenuButton } from "./ui/sidebar";
import Link from "next/link";

type Props = {
  bet: Bet;
}


function SelectBetButton({ bet }: Props) {
  const betId = useSearchParams().get("betId") || "";


  const { betText: selectedBetText } = useBet();
  const [shouldUseGlobalBetText, setShouldUseGlobalBetText] = useState(false);
  const [localBetText, setLocalBetText] = useState(bet.text);

  useEffect(() => {
    if (betId === bet.id) {
      setShouldUseGlobalBetText(true);
    } else {
      setShouldUseGlobalBetText(false);
    }
  }, [betId, bet.id]);

  useEffect(() => {
    if (shouldUseGlobalBetText) {
      setLocalBetText(selectedBetText);
    }
  }, [selectedBetText, shouldUseGlobalBetText]);

  const blankBetText = "EMPTY BET";
  let betText = localBetText || blankBetText;
  if (shouldUseGlobalBetText) {
    betText = selectedBetText || blankBetText;
  }

  return (
    <SidebarMenuButton asChild className={`items-start gap-0 pr-12 ${bet.id === betId && "bg-sidebar-accent/50"}`}>
      <Link href={`/?betId=${bet.id}`} className="flex h-fit flex-col">
        <p className="w-flow overflow-hidden truncate text-ellipsis whitespace-nowrap">
          {betText}
        </p>
        <p className="text-muted-foreground text-xs">
          {bet.updatedAt.toLocaleDateString()}
        </p>
      </Link>
    </SidebarMenuButton>
  )
}

export default SelectBetButton;