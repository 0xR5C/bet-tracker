"use client"

import { useSearchParams } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { debounceTimeout } from "@/lib/constants";
import { ChangeEvent, useEffect } from "react";
import useBet from "@/hooks/useBet";
import { updateBetAction } from "@/actions/bets";

type Props = {
  betId: string;
  startingBetText: string;
}

let updateTimeout: NodeJS.Timeout;

function BetTextInput({ betId, startingBetText }: Props) {
  const betIdParam = useSearchParams().get("betId") || "";
  const { betText, setBetText } = useBet();

  useEffect(() => {
    if (betIdParam === betId) {
      setBetText(startingBetText);
    }
  }, [startingBetText, betIdParam, betId, setBetText]);

  const handleUpdateBet = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;

    setBetText(text);

    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      updateBetAction(betId, text)
    }, debounceTimeout);
  };

  return (
    <Textarea
      value={betText}
      onChange={handleUpdateBet}
      placeholder="Place your text here..."
      className="custom-scrollbar placeholder:text-muted-foreground mb-4 h-full max-w-4xl resize-none border p-4 focus-visible:ring-0 focus-visible:ring-offset-0"
    />
  )
}

export default BetTextInput;