import cuid from 'cuid';
import db from '../Database';

const getSelectVariables = ({ fields = '*', where = { deleted: false } }) => {
  const columns = fields;
  const params = !Object.keys(where).length ? { deleted: false } : where;
  const conditions = Object.entries(params).map(([key, value]) => `${key}='${value}'`).join(' and ');
  return ({ columns, conditions });
}

const getUpdateVariables = (fields) => {
  const columns = Object.entries(fields).map(([key, value]) => `${key}='${value}'`).join(', ');
  return (columns);
}

class StickerService {

  static async get(params) {
    try {
      const { fields, ...where } = params
      const { columns, conditions } = getSelectVariables({ fields, where });
      const select = `select ${columns} from sticker where ${conditions}`;
      const { rows: data, rowCount: count } = await db.query(select);
      return { data, count };
    } catch (error) {
      console.log('Error sticker service get method: ', params, error)
      throw error;
    }
  }

  static async add({ title, stickerid }) {
    try {
      const stickerid = cuid();
      const sticker = {
        id: stickerid,
        title,
        stickerid,
        deleted: false,
      }
      const insert = `INSERT INTO sticker (id, title, stickerid, deleted, createdat, updatedat) VALUES ('${sticker.id}', '${sticker.title}', '${sticker.stickerid}', ${sticker.deleted}, NOW(), NOW())`;
      await db.query(insert);
      return sticker;
    } catch (error) {
      console.log('Error sticker service add method: ', error)
      throw error;
    }
  }

  static async update({ id, sticker }) {
    try {
      const columns = getUpdateVariables(sticker);
      const update = `UPDATE sticker SET ${columns} WHERE id='${id}'`;
      await db.query(update);
      return ({ id, ...sticker });
    } catch (error) {
      console.log('Error sticker service update method: ', error)
      throw error;
    }
  }

  static async delete({ id }) {
    try {
      const { count } = await this.get({ id });
      if (count >= 1) {
        await this.update({ id, sticker: { deleted: true } })
        return ({ id });
      }
      return null;
    } catch (error) {
      console.log('Error sticker service delete method: ', error)
      throw error;
    }
  }

}

export default StickerService;
