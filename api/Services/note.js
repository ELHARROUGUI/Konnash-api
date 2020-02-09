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

class NoteService {

  static async get(params) {
    try {
      const { fields, ...where } = params
      const { columns, conditions } = getSelectVariables({ fields, where });
      const select = `select ${columns} from note where ${conditions}`;
      const { rows: data, rowCount: count } = await db.query(select);
      return { data, count };
    } catch (error) {
      console.log('Error note service get method: ', params, error)
      throw error;
    }
  }

  static async add({ title, accountid }) {
    try {
      const noteid = cuid();
      const note = {
        id: noteid,
        title,
        accountid,
        deleted: false,
      }
      const insert = `INSERT INTO note (id, title, accountid, deleted, createdat, updatedat) VALUES ('${note.id}', '${note.title}', '${note.accountid}', ${note.deleted}, NOW(), NOW())`;
      await db.query(insert);
      return note;
    } catch (error) {
      console.log('Error note service add method: ', error)
      throw error;
    }
  }

  static async update({ id, note }) {
    try {
      const columns = getUpdateVariables(note);
      const update = `UPDATE note SET ${columns} WHERE id='${id}'`;
      await db.query(update);
      return ({ id, ...note });
    } catch (error) {
      console.log('Error note service update method: ', error)
      throw error;
    }
  }

  static async delete({ id }) {
    try {
      const { count } = await this.get({ id });
      if (count >= 1) {
        await this.update({ id, note: { deleted: true } })
        return ({ id });
      }
      return null;
    } catch (error) {
      console.log('Error note service delete method: ', error)
      throw error;
    }
  }

}

export default NoteService;
