const { Joi, celebrate } = require("celebrate");

const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "string.empty": `The "weather field" must be filled in`,
    }),
  }),
});

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),

    email: Joi.string().required().email().messages({
      "string.empty": `The "email" field must be filled in`,
      "string.email": `The "email" field must have a valid email address`,
    }),

    password: Joi.string().required().messages({
      "string.empty": `The "password" field must be filled in`,
    }),
  }),
});

const validateUserAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": `The "email" field must be filled in`,
      "string.email": `The "email" field must have a valid email address`,
    }),

    password: Joi.string().required().messages({
      "string.empty": `The "password" field must be filled in`,
    }),
  }),
});

const validateUserAndItemsIds = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().length(24).hex(),
  }),
});

const validateUserAvatar = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

module.exports = {
  validateCardBody,
  validateUserBody,
  validateUserAuthentication,
  validateUserAndItemsIds,
  validateUserAvatar,
};
