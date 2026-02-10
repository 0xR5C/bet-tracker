"use client"

import { Bet } from "@prisma/client";
import { SidebarGroupContent as SidebarGroupContentShadCN, SidebarMenu, SidebarMenuItem } from "./ui/sidebar";
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import SelectBetButton from "./SelectBetButton";
import DeleteBetButton from "./DeleteBetButton";


type Props = {
  bets: Bet[];
};

function SidebarGroupContent({ bets }: Props) {
  const [searchText, setSearchtext] = useState("");
  const [localBets, setLocalBets] = useState(bets);

  useEffect(() => {
    setLocalBets(bets);
  }, [bets]);

  const fuse = useMemo(() => {
    return new Fuse(localBets, {
      keys: ["text"],
      threshold: 0.4
    })
  }, [localBets]);

  const filteredBets = searchText
    ? fuse.search(searchText).map((result) => result.item)
    : localBets;

  const deleteBetLocally = (betId: string) => {
    setLocalBets((prevBets) =>
      prevBets.filter((bet) => bet.id !== betId),
    );
  };

  return (
    <SidebarGroupContentShadCN>
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-2 size-4" />
        <Input
          className="bg-muted pl-8"
          placeholder="Search your bets here..."
          value={searchText}
          onChange={(e) => setSearchtext(e.target.value)}
        />
      </div>

      <SidebarMenu className="mt-4">
        {filteredBets.map((bet) => (
          <SidebarMenuItem key={bet.id} className="group/item">
            <SelectBetButton bet={bet} />

            <DeleteBetButton betId={bet.id} deleteBetLocally={deleteBetLocally} />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContentShadCN>
  )
}

export default SidebarGroupContent;