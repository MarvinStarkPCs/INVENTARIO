import passport from "passport";
import { encryptPassword } from "../lib/helpers.js";
import { pool } from "../database.js";

export const renderSignUp = (req, res) => res.render("auth/signup");

export const signUp = async (req, res, next) => {
  const { fullname, email, password1 } = req.body;

  const password = await encryptPassword(password1);

  // Saving in the Database
  const [result] = await pool.query("INSERT INTO users SET ? ", {
    fullname,
    email,
    password,
  });

  req.login(
    {
      id: result.insertId,
      fullname,
      email,
    },
    (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/articles");
    }
  );
};

///// registro de usuarios
export const renderSignIn = (req, res) => res.render("auth/signin");

export const signIn = passport.authenticate("local.signin", {
  successRedirect: "/articles",
  failureRedirect: "/signin",
  failureMessage: true,
  failureFlash: true,
});

export const logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
};





 ///en prueba

import { v4 as uuidv4 } from "uuid";
import { sendPasswordResetEmail } from "../lib/mail.js";

export const renderForgotPassword = (req, res) => res.render("auth/forgot-password");

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Verificar si el usuario existe en la base de datos
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = users[0];
    if (!user) {
      req.flash("error", "No se encontró ningún usuario con ese correo electrónico.");
      return res.redirect("/forgot-password");
    }

    // Generar un token de restablecimiento de contraseña
    const token = uuidv4();

    // Guardar el token en la base de datos junto con la fecha de expiración
    const expires = Date.now() + 60 * 60 * 1000; // Token válido por una hora
    await pool.query("INSERT INTO reset_password_tokens SET ?", {
      email: user.email,
      token,
      expires,
    });

    // Enviar un correo electrónico al usuario con el enlace de restablecimiento de contraseña
    const resetLink = `${req.protocol}://${req.headers.host}/reset-password/${token}`;
    await sendPasswordResetEmail(user.email, resetLink);

    req.flash("success", "Se ha enviado un correo electrónico con un enlace para restablecer la contraseña.");
    res.redirect("/forgot-password");
  } catch (err) {
    next(err);
  }
};

export const renderResetPassword = (req, res) => res.render("auth/reset-password");

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password1, password2 } = req.body;

    // Verificar si el token es válido y aún no ha caducado
    const [tokens] = await pool.query("SELECT * FROM reset_password_tokens WHERE token = ?", [token]);
    const resetToken = tokens[0];
    if (!resetToken || resetToken.expires < Date.now()) {
      req.flash("error", "El enlace de restablecimiento de contraseña no es válido o ha caducado.");
      return res.redirect("/forgot-password");
    }

    // Verificar si las contraseñas coinciden
    if (password1 !== password2) {
      req.flash("error", "Las contraseñas no coinciden.");
      return res.redirect(`/reset-password/${token}`);
    }

    // Encriptar la nueva contraseña y actualizarla en la base de datos
    const password = await encryptPassword(password1);
    await pool.query("UPDATE users SET password = ? WHERE email = ?", [password, resetToken.email]);

    // Eliminar el token de restablecimiento de contraseña de la base de datos
    await pool.query("DELETE FROM reset_password_tokens WHERE token = ?", [token]);

    req.flash("success", "La contraseña se ha restablecido correctamente.");
    res.redirect("/signin");
  } catch (err) {
    next(err);
  }
};
