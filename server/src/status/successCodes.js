/**
 * Response data formatted as per JSend specification
 * see https://github.com/omniti-labs/jsend for more details
 */

class SuccessCode {
  constructor(data, status) {
    this.status = status || 200;
    this.data = data || {};

    // Define getters and setters to read and manipulate data without drilling
    Object.keys(this.data).forEach(key =>
      Object.defineProperty(this, key, {
        get: () => this.data[key],
        set: (value) => {
          this.data[key] = value;
        },
      }));
  }

  get() {
    return this.data;
  }

  set(data) {
    this.data = data;
  }
}

export class CreatedResource extends SuccessCode {
  constructor(data) {
    super(data, 201);
  }
}

export class RetrievedResource extends SuccessCode {
  constructor(data) {
    super(data, 200);
  }
}

export class UpdatedResource extends SuccessCode {
  constructor(data) {
    super(data, 200);
  }
}

export class DeletedResource extends SuccessCode {
  constructor(data) {
    super(data, 204);
  }
}
