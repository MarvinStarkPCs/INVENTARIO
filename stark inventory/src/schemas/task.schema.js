import { z } from "zod";

export const createArticleSchema = z.object({
  title: z
    .string({
      message: "El título debe ser una cadena",
    })
    .min(3, {
      message: "El título debe tener al menos 3 caracteres",
    })
    .max(100),
 precio: z
    .string({
      message: "ingrese un valor de 3 digitos",
    }),
  description: z
    .string({
      message: "La descripción debe ser una texto",
    })
    .max(1000)
    .optional(),
});
