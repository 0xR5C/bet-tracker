"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { createBetAction } from "@/actions/bets";

type Props = {
  user: User | null;
}

function NewBetButton({ user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClickNewBetButton = async () => {
    if (!user) {
      router.push("/login");
    } else {
      setLoading(false);
      const uuid = uuidv4();
      await createBetAction(uuid);
      router.push(`/?betId=${uuid}`);

      toast.success("New bet created");

      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClickNewBetButton}
      className="w-24"
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : "New Bet"}
    </Button>
  )
}

export default NewBetButton

