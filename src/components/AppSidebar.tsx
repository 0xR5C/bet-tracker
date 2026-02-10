import { getUser } from "@/auth/server";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { prisma } from "@/prisma/prisma";
import { Bet } from "@prisma/client";
import SidebarGroupContent from "./SidebarGroupContent";
import Link from "next/link";

async function AppSidebar() {
  const user = await getUser();

  let bets: Bet[] = [];

  if (user) {
    bets = await prisma.bet.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  return (
    <Sidebar>
      <SidebarContent className="custom-scroll-bar">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 mt-2 text-lg">
            {user ? (
              "Your Bets"
            ) : (
              <p>
                <Link href="/login" className="underline">Login</Link> to see your bets.
              </p>
            )}
          </SidebarGroupLabel>
          {user && <SidebarGroupContent bets={bets} />}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar;