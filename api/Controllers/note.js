import Util from '../Utils/util';
import noteService from '../Services/note';

const util = new Util();

class NoteController {
  static async get(req, res) {
    try {
      const { data, count } = await noteService.get(req.query);
      if (data.length > 0) {
        util.setSuccess(200, 'Notes retrieved', data, count);
      } else {
        util.setSuccess(200, 'No note found');
      }
      return util.send(res);
    } catch (error) {
      console.log('Error NoteController get: ', error)
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async add(req, res) {
    if (!req.body.title || !req.body.accountid) {
      util.setError(400, 'Please provide complete note details');
      return util.send(res);
    }
    try {
      const note = req.body;
      const createdNote = await noteService.add(note);
      util.setSuccess(201, 'Note Added!', createdNote);
      return util.send(res);
    } catch (error) {
      console.log('Error NoteController add: ', error)
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async update(req, res) {
    const note = req.body;
    const { id } = req.params;
    if (!id) {
      util.setError(400, 'Please input a valid id value');
      return util.send(res);
    }
    try {
      const updatedNote = await noteService.update({ id, note });
      if (!updatedNote) {
        util.setError(404, `Cannot find note with the id: ${id}`);
      } else {
        util.setSuccess(200, 'Note updated', updatedNote);
      }
      return util.send(res);
    } catch (error) {
      console.log('Error NoteController update: ', error)
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
      const note = await noteService.delete({ id });

      if (note) {
        util.setSuccess(200, 'Note deleted');
      } else {
        util.setError(404, `Note with the id ${id} cannot be found`);
      }
      return util.send(res);
    } catch (error) {
      console.log('Error NoteController delete: ', error)
      util.setError(400, error);
      return util.send(res);
    }
  }
}

export default NoteController;
