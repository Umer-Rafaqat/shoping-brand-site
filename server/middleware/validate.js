const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false, // collect every invalid field, not just the first
      stripUnknown: true, // drop fields the schema doesn't know about
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        path: detail.path.join("."),
        msg: detail.message.replace(/"/g, ""),
      }));
      return res.status(422).json({ errors });
    }

    req[source] = value;
    next();
  };

module.exports = { validate };
