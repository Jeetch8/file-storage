const { init } = require("@paralleldrive/cuid2");

const generate_url_cuid = init({ length: 30 });

module.exports = { generate_url_cuid };
