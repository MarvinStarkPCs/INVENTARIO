import { pool } from "../database.js";

export const renderAddArticle = (req, res) => res.render("articles/add");

export const addArticle = async (req, res) => {
  const {codigoBarra, nombreproducto, marca, descripcion, cantidad, entrada, salida, totalstock, preciocosto,precioventa } = req.body;
  console.log(codigoBarra)
  await pool.query("INSERT INTO articles set ?", [
    {
      codigoBarra,
      nombreproducto,
      marca,
      descripcion,
      cantidad,
      entrada,
      salida,
      totalstock,
      preciocosto,
      precioventa,   
      user_id: req.user.id
    },
  ]);
  req.flash("success", "Artículo guardado con éxito");
  res.redirect("/articles");
};
export const renderArticle = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM articles WHERE user_id = ?", [
    req.user.id,
  ]);
  res.render("articles/list", { article: rows });
};

export const deleteArticle = async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM articles WHERE ID = ?", [id]);
  req.flash("success", "Artículo eliminado con éxito");
  res.redirect("/articles");
};

export const renderEditarticle = async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query("SELECT * FROM articles WHERE id = ?", [id]);
  res.render("articles/edit", { article: rows[0] });
};

export const editArticle = async (req, res) => {
  const { id } = req.params;
  const { codigoBarra, nombreproducto, marca, descripcion, cantidad, entrada, salida, totalstock, preciocosto,precioventa  } = req.body;
  const newArticulo = {
    codigoBarra,
    nombreproducto,
    marca,
    descripcion,
    cantidad,
    entrada,
    salida,
    totalstock,
    preciocosto,
    precioventa,
    
  };
  await pool.query("UPDATE articles set ? WHERE id = ?", [newArticulo, id]);
  req.flash("success", "Artículo actualizado con éxito");
  res.redirect("/articles");
};
