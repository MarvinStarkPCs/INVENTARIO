import { format } from "timeago.js";

// función para obtener una fecha en formato legible
export const timeago = (timestamp) => {
  const date = new Date(timestamp);
  const options = { locale: "es" }; // indicamos que queremos el formato en español
  return format(date, options); // retornamos la fecha formateada
};
