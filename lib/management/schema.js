const Joi = require('joi');

const pathSchema = Joi.string().regex(
  /^\/(([A-z0-9\-\%]+\/)*[A-z0-9\-\%]+$)?/gm,
  'path'
);

const proxySchema = Joi.object().keys({
  conf: Joi.object().keys({
    context: Joi.array()
      .items(pathSchema)
      .required(),
    target: Joi.string().required(),
    secure: Joi.boolean(),
    autoRewrite: Joi.boolean(),
    pathRewrite: Joi.object(),
    changeOrigin: Joi.boolean(),
    rewriteHeaders: Joi.object(),
    enforceAutoRewrite: Joi.boolean(),
    cookieDomainRewrite: Joi.object()
  })
});

module.exports = {
  validateProxy(proxy) {
    return Joi.validate(proxy, proxySchema, { abortEarly: false });
  }
};
