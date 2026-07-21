const Contact = require("../models/Contact");
const asyncHandler = require("../utils/asyncHandler");
const respond = require("../utils/respond");
const validate = require("../utils/validate");

exports.submit = asyncHandler(async (req, res) => {
  const { name, email, message } = validate.normalize(req.body, ["name", "email", "message"]);
  validate.required({ name, email, message }, ["name", "email", "message"]);
  validate.email(email);

  await Contact.create({ name, email, message });
  respond.created(res);
});
