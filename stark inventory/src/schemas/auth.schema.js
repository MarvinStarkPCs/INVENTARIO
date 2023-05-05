import { z } from "zod";

export const signupSchema = z
  .object({
    fullname: z
      .string({
        required_error: "Ingrese nombre completo",
      })
      .min(3, {
        message: "El nombre debe tener al menos 3 caracteres",
      }),
    email: z
      .string({
        required_error: "Es necesario el email",
      })
      .email({
        message: "El Email no es valido",
      }),
    password1: z
      .string({
        required_error: "Contraseña es Necesaria",
      })
      .min(6, {
        message: "La contraseña debe contener 6 caracteres como mínimo",
      }),
    password2: z.string({
      required_error: "",
    }),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "La contraseña no coincide",
    path: ["password2"],
  });

export const signinSchema = z.object({
  email: z
    .string({
      required_error: "Es necesario el email",
    })
    .email({
      message: "El Email no es valido",
    }),
  password: z
    .string({
      required_error: "Contraseña es Necesaria",
    })
    .min(6, {
      message: "La contraseña debe contener 6 caracteres como mínimo",
    }),
});
export const resetPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Es necesario el email",
    })
    .email({
      message: "El Email no es valido",
    }),
  password: z
    .string({
      required_error: "Contraseña es Necesaria",
    })
    .min(6, {
      message: "La contraseña debe contener 6 caracteres como mínimo",
    }),
});
