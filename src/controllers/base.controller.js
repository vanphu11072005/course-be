export default class BaseController {
  constructor() {
    this._autoBind();
  }

  _autoBind() {
    let proto = Object.getPrototypeOf(this);

    while (proto && proto !== Object.prototype) {
      for (const key of Object.getOwnPropertyNames(proto)) {
        const val = this[key];

        // Chỉ bind function, không bind constructor
        if (key !== "constructor" && typeof val === "function") {
          // Nếu là async, wrap tự catch lỗi và gọi next()
          if (val.constructor.name === "AsyncFunction") {
            this[key] = (...args) => {
              const next = args[2]; // args = [req, res, next]
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
