import Util from '../Utils/util';
import stickerService from '../Services/sticker';

const util = new Util();

class StickerController {
  static async get(req, res) {
    try {
      const { data, count } = await stickerService.get(req.query);
      if (data.length > 0) {
        util.setSuccess(200, 'Stickers retrieved', data, count);
      } else {
        util.setSuccess(200, 'No sticker found');
      }
      return util.send(res);
    } catch (error) {
      console.log('Error StickerController get: ', error)
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async add(req, res) {
    if (!req.body.title || !req.body.stickerid) {
      util.setError(400, 'Please provide complete sticker details');
      return util.send(res);
    }
    try {
      const sticker = req.body;
      const createdSticker = await stickerService.add(sticker);
      util.setSuccess(201, 'Sticker Added!', createdSticker);
      return util.send(res);
    } catch (error) {
      console.log('Error StickerController add: ', error)
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async update(req, res) {
    const sticker = req.body;
    const { id } = req.params;
    if (!id) {
      util.setError(400, 'Please input a valid id value');
      return util.send(res);
    }
    try {
      const updatedSticker = await stickerService.update({ id, sticker });
      if (!updatedSticker) {
        util.setError(404, `Cannot find sticker with the id: ${id}`);
      } else {
        util.setSuccess(200, 'Sticker updated', updatedSticker);
      }
      return util.send(res);
    } catch (error) {
      console.log('Error StickerController update: ', error)
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
      const sticker = await stickerService.delete({ id });

      if (sticker) {
        util.setSuccess(200, 'Sticker deleted');
      } else {
        util.setError(404, `Sticker with the id ${id} cannot be found`);
      }
      return util.send(res);
    } catch (error) {
      console.log('Error StickerController delete: ', error)
      util.setError(400, error);
      return util.send(res);
    }
  }
}

export default StickerController;
