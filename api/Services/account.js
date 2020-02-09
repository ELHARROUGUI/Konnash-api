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

class AccountService {

  static async get(params) {
    try {
      const { fields, ...where } = params
      const { columns, conditions } = getSelectVariables({ fields, where });
      const select = `select ${columns} from account where ${conditions}`;
      const { rows: data, rowCount: count } = await db.query(select);
      return { data, count };
    } catch (error) {
      console.log('Error account service get method: ', params, error)
      throw error;
    }
  }

  static async add({ title, accountid }) {
    try {
      const accountid = cuid();
      const account = {
        id: accountid,
        title,
        accountid,
        deleted: false,
      }
      const insert = `INSERT INTO account (id, title, accountid, deleted, createdat, updatedat) VALUES ('${account.id}', '${account.title}', '${account.accountid}', ${account.deleted}, NOW(), NOW())`;
      await db.query(insert);
      return account;
    } catch (error) {
      console.log('Error account service add method: ', error)
      throw error;
    }
  }

  static async update({ id, account }) {
    try {
      const columns = getUpdateVariables(account);
      const update = `UPDATE account SET ${columns} WHERE id='${id}'`;
      await db.query(update);
      return ({ id, ...account });
    } catch (error) {
      console.log('Error account service update method: ', error)
      throw error;
    }
  }

  static async delete({ id }) {
    try {
      const { count } = await this.get({ id });
      if (count >= 1) {
        await this.update({ id, account: { deleted: true } })
        return ({ id });
      }
      return null;
    } catch (error) {
      console.log('Error account service delete method: ', error)
      throw error;
    }
  }

}

export default AccountService;
