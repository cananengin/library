const Joi = require('joi');

const createMemberSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required()
});

module.exports = createMemberSchema;