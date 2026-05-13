import { badRequest, notFound } from "../utils/errors";
import { prisma } from "../utils/prisma";

export type ActivityInput = {
  appName: string;
  windowTitle: string;
  url?: string | null;
  startedAt: Date;
  endedAt?: Date | null;
  durationSeconds?: number;
  categoryId?: string | null;
};

export type ActivityFilters = {
  from?: Date;
  to?: Date;
  categoryId?: string;
  appName?: string;
  limit: number;
  page: number;
};

function resolveDuration(input: Pick<ActivityInput, "startedAt" | "endedAt" | "durationSeconds">) {
  if (input.durationSeconds !== undefined) {
    return input.durationSeconds;
  }

  if (!input.endedAt) {
    return 0;
  }

  const seconds = Math.max(0, Math.round((input.endedAt.getTime() - input.startedAt.getTime()) / 1000));
  return seconds;
}

async function assertCategoryBelongsToUser(userId: string, categoryId?: string | null) {
  if (!categoryId) {
    return;
  }

  const category = await prisma.category.findFirst({ where: { id: categoryId, userId } });
  if (!category) {
    throw badRequest("categoryId must refer to one of your categories.");
  }
}

export async function listActivities(userId: string, filters: ActivityFilters) {
  const where = {
    userId,
    ...(filters.from || filters.to
      ? {
          startedAt: {
            ...(filters.from ? { gte: filters.from } : {}),
            ...(filters.to ? { lte: filters.to } : {})
          }
        }
      : {}),
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
    ...(filters.appName ? { appName: { contains: filters.appName } } : {})
  };

  const [items, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      include: { category: true },
      orderBy: { startedAt: "desc" },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit
    }),
    prisma.activity.count({ where })
  ]);

  return {
    items,
    pagination: {
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit)
    }
  };
}

export async function createActivity(userId: string, input: ActivityInput) {
  await assertCategoryBelongsToUser(userId, input.categoryId);

  if (input.endedAt && input.endedAt < input.startedAt) {
    throw badRequest("endedAt must be after startedAt.");
  }

  return prisma.activity.create({
    data: {
      appName: input.appName.trim(),
      windowTitle: input.windowTitle.trim(),
      url: input.url?.trim() || null,
      startedAt: input.startedAt,
      endedAt: input.endedAt ?? null,
      durationSeconds: resolveDuration(input),
      categoryId: input.categoryId ?? null,
      userId
    },
    include: { category: true }
  });
}

export async function getActivity(userId: string, activityId: string) {
  const activity = await prisma.activity.findFirst({
    where: { id: activityId, userId },
    include: { category: true }
  });

  if (!activity) {
    throw notFound("Activity not found.");
  }

  return activity;
}

export async function updateActivity(userId: string, activityId: string, input: Partial<ActivityInput>) {
  const existing = await getActivity(userId, activityId);
  await assertCategoryBelongsToUser(userId, input.categoryId);

  const startedAt = input.startedAt ?? existing.startedAt;
  const endedAt = input.endedAt !== undefined ? input.endedAt : existing.endedAt;

  if (endedAt && endedAt < startedAt) {
    throw badRequest("endedAt must be after startedAt.");
  }

  const shouldRecalculateDuration =
    input.durationSeconds === undefined &&
    (input.startedAt !== undefined || input.endedAt !== undefined) &&
    endedAt !== null;

  return prisma.activity.update({
    where: { id: activityId },
    data: {
      ...(input.appName !== undefined ? { appName: input.appName.trim() } : {}),
      ...(input.windowTitle !== undefined ? { windowTitle: input.windowTitle.trim() } : {}),
      ...(input.url !== undefined ? { url: input.url?.trim() || null } : {}),
      ...(input.startedAt !== undefined ? { startedAt } : {}),
      ...(input.endedAt !== undefined ? { endedAt } : {}),
      ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
      ...(input.durationSeconds !== undefined
        ? { durationSeconds: input.durationSeconds }
        : shouldRecalculateDuration
          ? { durationSeconds: resolveDuration({ startedAt, endedAt }) }
          : {})
    },
    include: { category: true }
  });
}

export async function deleteActivity(userId: string, activityId: string) {
  await getActivity(userId, activityId);
  await prisma.activity.delete({ where: { id: activityId } });
  return { id: activityId };
}
