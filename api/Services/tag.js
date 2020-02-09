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

class TagService {

  static async get(params) {
    try {
      const { fields, ...where } = params
      const { columns, conditions } = getSelectVariables({ fields, where });
      const select = `select ${columns} from tag where ${conditions}`;
      const { rows: data, rowCount: count } = await db.query(select);
      return { data, count };
    } catch (error) {
      console.log('Error tag service get method: ', params, error)
      throw error;
    }
  }

  static async add({ title, accountid }) {
    try {
      const tagid = cuid();
      const tag = {
        id: tagid,
        title,
        accountid,
        deleted: false,
      }
      const insert = `INSERT INTO tag (id, title, accountid, deleted, createdat, updatedat) VALUES ('${tag.id}', '${tag.title}', '${tag.accountid}', ${tag.deleted}, NOW(), NOW())`;
      await db.query(insert);
      return tag;
    } catch (error) {
      console.log('Error tag service add method: ', error)
      throw error;
    }
  }

  static async update({ id, tag }) {
    try {
      const columns = getUpdateVariables(tag);
      const update = `UPDATE tag SET ${columns} WHERE id='${id}'`;
      await db.query(update);
      return ({ id, ...tag });
    } catch (error) {
      console.log('Error tag service update method: ', error)
      throw error;
    }
  }

  static async delete({ id }) {
    try {
      const { count } = await this.get({ id });
      if (count >= 1) {
        await this.update({ id, tag: { deleted: true } })
        return ({ id });
      }
      return null;
    } catch (error) {
      console.log('Error tag service delete method: ', error)
      throw error;
    }
  }

}

export default TagService;
