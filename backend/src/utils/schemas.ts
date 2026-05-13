import { z } from "zod";
import { categoryTypes } from "./categoryTypes";

const idParams = z.object({
  id: z.string().min(1)
});

const isoDate = z
  .string()
  .datetime({ offset: true })
  .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
  .transform((value) => new Date(value));

const optionalIsoDate = z
  .preprocess((value) => (value === "" ? undefined : value), isoDate.optional());

const positiveIntFromQuery = (defaultValue: number, max: number) =>
  z
    .preprocess((value) => (value === undefined ? defaultValue : Number(value)), z.number().int().min(1).max(max));

export const authSchemas = {
  register: z.object({
    body: z.object({
      name: z.string().trim().min(1, "Name is required.").max(120),
      email: z.string().trim().email().max(255),
      password: z.string().min(8, "Password must be at least 8 characters.")
    })
  }),
  login: z.object({
    body: z.object({
      email: z.string().trim().email().max(255),
      password: z.string().min(1, "Password is required.")
    })
  })
};

export const categorySchemas = {
  create: z.object({
    body: z.object({
      name: z.string().trim().min(1, "Category name is required.").max(120),
      type: z.enum(categoryTypes)
    })
  }),
  update: z.object({
    params: idParams,
    body: z
      .object({
        name: z.string().trim().min(1, "Category name is required.").max(120).optional(),
        type: z.enum(categoryTypes).optional()
      })
      .refine((value) => value.name !== undefined || value.type !== undefined, {
        message: "Provide at least one field to update."
      })
  }),
  id: z.object({
    params: idParams
  })
};

export const activitySchemas = {
  list: z.object({
    query: z.object({
      from: optionalIsoDate,
      to: optionalIsoDate,
      categoryId: z.string().min(1).optional(),
      appName: z.string().trim().min(1).optional(),
      limit: positiveIntFromQuery(50, 200),
      page: positiveIntFromQuery(1, 100000)
    })
  }),
  create: z.object({
    body: z.object({
      appName: z.string().trim().min(1, "appName is required.").max(180),
      windowTitle: z.string().trim().min(1, "windowTitle is required.").max(500),
      url: z.string().trim().url().optional().nullable(),
      startedAt: isoDate,
      endedAt: isoDate.optional().nullable(),
      durationSeconds: z.number().int().min(0).optional(),
      categoryId: z.string().min(1).optional().nullable()
    })
  }),
  update: z.object({
    params: idParams,
    body: z
      .object({
        appName: z.string().trim().min(1).max(180).optional(),
        windowTitle: z.string().trim().min(1).max(500).optional(),
        url: z.string().trim().url().optional().nullable(),
        startedAt: isoDate.optional(),
        endedAt: isoDate.optional().nullable(),
        durationSeconds: z.number().int().min(0).optional(),
        categoryId: z.string().min(1).optional().nullable()
      })
      .refine((value) => Object.keys(value).length > 0, {
        message: "Provide at least one field to update."
      })
  }),
  id: z.object({
    params: idParams
  })
};

export const dashboardSchemas = {
  range: z.object({
    query: z.object({
      from: optionalIsoDate,
      to: optionalIsoDate,
      limit: positiveIntFromQuery(10, 50).optional()
    })
  })
};
