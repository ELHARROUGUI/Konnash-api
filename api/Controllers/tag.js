import Util from '../Utils/util';
import tagService from '../Services/tag';

const util = new Util();

class TagController {
  static async get(req, res) {
    try {
      const { data, count } = await tagService.get(req.query);
      if (data.length > 0) {
        util.setSuccess(200, 'Tags retrieved', data, count);
      } else {
        util.setSuccess(200, 'No tag found');
      }
      return util.send(res);
    } catch (error) {
      console.log('Error TagController get: ', error)
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async add(req, res) {
    if (!req.body.title || !req.body.accountid) {
      util.setError(400, 'Please provide complete tag details');
      return util.send(res);
    }
    try {
      const tag = req.body;
      const createdTag = await tagService.add(tag);
      util.setSuccess(201, 'Tag Added!', createdTag);
      return util.send(res);
    } catch (error) {
      console.log('Error TagController add: ', error)
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async update(req, res) {
    const tag = req.body;
    const { id } = req.params;
    if (!id) {
      util.setError(400, 'Please input a valid id value');
      return util.send(res);
    }
    try {
      const updatedTag = await tagService.update({ id, tag });
      if (!updatedTag) {
        util.setError(404, `Cannot find tag with the id: ${id}`);
      } else {
        util.setSuccess(200, 'Tag updated', updatedTag);
      }
      return util.send(res);
    } catch (error) {
      console.log('Error TagController update: ', error)
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
      const tag = await tagService.delete({ id });

      if (tag) {
        util.setSuccess(200, 'Tag deleted');
      } else {
        util.setError(404, `Tag with the id ${id} cannot be found`);
      }
      return util.send(res);
    } catch (error) {
      console.log('Error TagController delete: ', error)
      util.setError(400, error);
      return util.send(res);
    }
  }
}

export default TagController;
