export default class BaseController {
  constructor() {
    this._autoBind();
  }

  _autoBind() {
    let proto = Object.getPrototypeOf(this);

    while (proto && proto !== Object.prototype) {
      for (const key of Object.getOwnPropertyNames(proto)) {
        const val = this[key];

        if (key !== "constructor" && typeof val === "function") {
          if (val.constructor.name === "AsyncFunction") {
            this[key] = (...args) => {
              const next = args[2];
              return val.apply(this, args).catch(err => next?.(err));
            };
          } else {
            this[key] = val.bind(this);
          }
        }
      }

      proto = Object.getPrototypeOf(proto);
    }
  }
}