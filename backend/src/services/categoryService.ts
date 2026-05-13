import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CategoryType } from "../utils/categoryTypes";
import { conflict, notFound } from "../utils/errors";
import { prisma } from "../utils/prisma";

export async function listCategories(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: [{ type: "asc" }, { name: "asc" }]
  });
}

export async function createCategory(
  userId: string,
  input: { name: string; type: CategoryType }
) {
  try {
    return await prisma.category.create({
      data: {
        name: input.name.trim(),
        type: input.type,
        userId
      }
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      throw conflict("A category with this name already exists.");
    }

    throw error;
  }
}

export async function updateCategory(
  userId: string,
  categoryId: string,
  input: { name?: string; type?: CategoryType }
) {
  await getOwnedCategory(userId, categoryId);

  try {
    return await prisma.category.update({
      where: { id: categoryId },
      data: {
        ...(input.name !== undefined ? { name: input.name.trim() } : {}),
        ...(input.type !== undefined ? { type: input.type } : {})
      }
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      throw conflict("A category with this name already exists.");
    }

    throw error;
  }
}

export async function deleteCategory(userId: string, categoryId: string) {
  await getOwnedCategory(userId, categoryId);
  await prisma.category.delete({ where: { id: categoryId } });
  return { id: categoryId };
}

export async function getOwnedCategory(userId: string, categoryId: string) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId }
  });

  if (!category) {
    throw notFound("Category not found.");
  }

  return category;
}
