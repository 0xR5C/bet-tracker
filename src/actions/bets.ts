"use server"

import { getUser } from "@/auth/server";
import { handleError } from "@/lib/utils";
import { prisma } from "@/prisma/prisma";


export const createBetAction = async (betId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to create a bet");

    await prisma.bet.create({
      data: {
        id: betId,
        authorId: user.id,
        text: "",
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const updateBetAction = async (betId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to update a bet");

    await prisma.bet.update({
      where: { id: betId },
      data: { text },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteBetAction = async (betId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to update a bet");

    await prisma.bet.delete({
      where: { id: betId, authorId: user.id },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};