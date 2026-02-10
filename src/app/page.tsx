import { getUser } from '@/auth/server'
import AskAIButton from '@/components/AskAIButton';
import BetTextInput from '@/components/BetTextInput';
import NewBetButton from '@/components/NewBetButton';
import { prisma } from '@/prisma/prisma';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function HomePage({ searchParams }: Props) {
  const betIdParam = (await searchParams).betId;
  const user = await getUser();

  const betId = Array.isArray(betIdParam)
    ? betIdParam![0]
    : betIdParam || "";

  const bet = await prisma.bet.findUnique({
    where: { id: betId, authorId: user?.id },
  });

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="flex w-full max-w-4xl justify-end gap-2">
        <AskAIButton user={user} />
        <NewBetButton user={user} />
      </div>

      <BetTextInput betId={betId} startingBetText={bet?.text || ""} />
    </div>
  )
}

export default HomePage