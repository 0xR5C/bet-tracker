"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { startTransition, useState } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteBetAction } from "@/actions/bets";

type Props = {
  betId: string;
  deleteBetLocally: (betId: string) => void;
}

function DeleteBetButton({ betId, deleteBetLocally }: Props) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const betIdParams = useSearchParams().get("betId") || "";

  const handleDeleteBet = () => {


    startTransition(async () => {
      const { errorMessage } = await deleteBetAction(betId);

      if (!errorMessage) {
        toast.success("Bet Deleted", {
          description: "You have succesfulyl deleted the bet!"
        });

        deleteBetLocally(betId)

        if (betId === betIdParams) {
          router.replace("/");
        }
      } else {
        toast.error("Error", {
          description: errorMessage
        });
      }


    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="absolute right-2 top-1/2 -translate-y-1/2 size-7 p-0 opacity-0 group-hover/item:opacity-100 [&_svg]:size-3"
          variant="ghost"
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this bet?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your bet from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteBet}
            className="w-24 bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {isPending ? <Loader2 className="animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog >
  )
}

export default DeleteBetButton;