export default class Util {
  constructor() {
    this.statusCode = null;
    this.type = null;
    this.data = null;
    this.count = 0;
    this.message = null;
  }

  setSuccess(statusCode, message, data, count) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.count = count;
    this.type = 'success';
  }

  setError(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
    this.type = 'error';
  }

  send(res) {
    const result = {
      status: this.type,
      message: this.message,
      count: this.count,
      data: this.data,
    };

    if (this.type === 'success') {
      return res.status(this.statusCode).json(result);
    }
    return res.status(this.statusCode).json({
      status: this.type,
      message: this.message,
    });
  }
}
