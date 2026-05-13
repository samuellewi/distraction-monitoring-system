import { CategoryType } from "../utils/categoryTypes";
import { prisma } from "../utils/prisma";

type DateRange = {
  from?: Date;
  to?: Date;
  limit?: number;
};

type TypeTotals = Record<CategoryType, number>;

function activityWhere(userId: string, range: DateRange) {
  return {
    userId,
    ...(range.from || range.to
      ? {
          startedAt: {
            ...(range.from ? { gte: range.from } : {}),
            ...(range.to ? { lte: range.to } : {})
          }
        }
      : {})
  };
}

function buildTypeTotals(
  rows: Array<{ category: { type: string } | null; durationSeconds: number }>
) {
  return rows.reduce(
    (acc, row) => {
      const type = isCategoryType(row.category?.type) ? row.category.type : CategoryType.NEUTRAL;
      acc[type] += row.durationSeconds;
      return acc;
    },
    {
      [CategoryType.PRODUCTIVE]: 0,
      [CategoryType.DISTRACTING]: 0,
      [CategoryType.NEUTRAL]: 0
    } satisfies TypeTotals
  );
}

function isCategoryType(value: string | undefined): value is CategoryType {
  return (
    value === CategoryType.PRODUCTIVE ||
    value === CategoryType.DISTRACTING ||
    value === CategoryType.NEUTRAL
  );
}

export async function getSummary(userId: string, range: DateRange) {
  const activities = await prisma.activity.findMany({
    where: activityWhere(userId, range),
    select: {
      durationSeconds: true,
      category: { select: { type: true } }
    }
  });

  const totals = buildTypeTotals(activities);
  const totalTrackedSeconds =
    totals.PRODUCTIVE + totals.DISTRACTING + totals.NEUTRAL;
  const productivityScore =
    totalTrackedSeconds === 0 ? 0 : Math.round((totals.PRODUCTIVE / totalTrackedSeconds) * 100);

  return {
    totalTrackedSeconds,
    productiveSeconds: totals.PRODUCTIVE,
    distractingSeconds: totals.DISTRACTING,
    neutralSeconds: totals.NEUTRAL,
    productivityScore
  };
}

export async function getDaily(userId: string, range: DateRange) {
  const activities = await prisma.activity.findMany({
    where: activityWhere(userId, range),
    select: {
      startedAt: true,
      durationSeconds: true,
      category: { select: { type: true } }
    },
    orderBy: { startedAt: "asc" }
  });

  const byDay = new Map<
    string,
    {
      date: string;
      totalTrackedSeconds: number;
      productiveSeconds: number;
      distractingSeconds: number;
      neutralSeconds: number;
    }
  >();

  for (const activity of activities) {
    const date = activity.startedAt.toISOString().slice(0, 10);
    const row =
      byDay.get(date) ??
      {
        date,
        totalTrackedSeconds: 0,
        productiveSeconds: 0,
        distractingSeconds: 0,
        neutralSeconds: 0
      };
    const type = isCategoryType(activity.category?.type) ? activity.category.type : CategoryType.NEUTRAL;

    row.totalTrackedSeconds += activity.durationSeconds;
    if (type === CategoryType.PRODUCTIVE) row.productiveSeconds += activity.durationSeconds;
    if (type === CategoryType.DISTRACTING) row.distractingSeconds += activity.durationSeconds;
    if (type === CategoryType.NEUTRAL) row.neutralSeconds += activity.durationSeconds;
    byDay.set(date, row);
  }

  return Array.from(byDay.values());
}

export async function getTopApps(userId: string, range: DateRange) {
  const rows = await prisma.activity.groupBy({
    by: ["appName"],
    where: activityWhere(userId, range),
    _sum: { durationSeconds: true },
    _count: { id: true },
    orderBy: { _sum: { durationSeconds: "desc" } },
    take: range.limit ?? 10
  });

  return rows.map((row) => ({
    appName: row.appName,
    totalDurationSeconds: row._sum.durationSeconds ?? 0,
    activityCount: row._count.id
  }));
}

export async function getCategoryBreakdown(userId: string, range: DateRange) {
  const activities = await prisma.activity.findMany({
    where: activityWhere(userId, range),
    select: {
      durationSeconds: true,
      category: { select: { type: true } }
    }
  });

  const totals = buildTypeTotals(activities);
  const total = totals.PRODUCTIVE + totals.DISTRACTING + totals.NEUTRAL;

  return Object.entries(totals).map(([type, totalDurationSeconds]) => ({
    type,
    totalDurationSeconds,
    percentage: total === 0 ? 0 : Math.round((totalDurationSeconds / total) * 100)
  }));
}
