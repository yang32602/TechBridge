import db from '../config/db.js';

export const obtenerTodosLosTechpoints = async () => {
  const sql = `SELECT * FROM techpoints`;
  const [rows] = await db.query(sql);
  return rows;
};

export const obtenerPrecioPuntos = async(id_techPoint)=>{
  const sql = `SELECT precio FROM techpoints where id = ?)`

}