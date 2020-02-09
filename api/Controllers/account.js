import Util from '../Utils/util';
import accountService from '../Services/account';

const util = new Util();

class AccountController {
  static async get(req, res) {
    try {
      const { data, count } = await accountService.get(req.query);
      if (data.length > 0) {
        util.setSuccess(200, 'Accounts retrieved', data, count);
      } else {
        util.setSuccess(200, 'No account found');
      }
      return util.send(res);
    } catch (error) {
      console.log('Error AccountController get: ', error)
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async add(req, res) {
    if (!req.body.title || !req.body.accountid) {
      util.setError(400, 'Please provide complete account details');
      return util.send(res);
    }
    try {
      const account = req.body;
      const createdAccount = await accountService.add(account);
      util.setSuccess(201, 'Account Added!', createdAccount);
      return util.send(res);
    } catch (error) {
      console.log('Error AccountController add: ', error)
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async update(req, res) {
    const account = req.body;
    const { id } = req.params;
    if (!id) {
      util.setError(400, 'Please input a valid id value');
      return util.send(res);
    }
    try {
      const updatedAccount = await accountService.update({ id, account });
      if (!updatedAccount) {
        util.setError(404, `Cannot find account with the id: ${id}`);
      } else {
        util.setSuccess(200, 'Account updated', updatedAccount);
      }
      return util.send(res);
    } catch (error) {
      console.log('Error AccountController update: ', error)
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      util.setError(400, 'Please provide a numeric value');
      return util.send(res);
    }
    try {
      const account = await accountService.delete({ id });

      if (account) {
        util.setSuccess(200, 'Account deleted');
      } else {
        util.setError(404, `Account with the id ${id} cannot be found`);
      }
      return util.send(res);
    } catch (error) {
      console.log('Error AccountController delete: ', error)
      util.setError(400, error);
      return util.send(res);
    }
  }
}

export default AccountController;
