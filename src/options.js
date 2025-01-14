const { validate } = require('schema-utils');

const schema = require('./options.json');

/** @typedef {import("stylelint")} stylelint */
/** @typedef {import("stylelint").LinterOptions} StylelintOptions */
/** @typedef {import("stylelint").FormatterType} FormatterType */

/**
 * @typedef {Object} OutputReport
 * @property {string=} filePath
 * @property {FormatterType=} formatter
 */

/**
 * @typedef {Object} PluginOptions
 * @property {string} context
 * @property {boolean} emitError
 * @property {boolean} emitWarning
 * @property {string|string[]=} exclude
 * @property {string|string[]} extensions
 * @property {boolean} failOnError
 * @property {boolean} failOnWarning
 * @property {string|string[]} files
 * @property {FormatterType} formatter
 * @property {boolean} lintDirtyModulesOnly
 * @property {boolean} quiet
 * @property {string} stylelintPath
 * @property {OutputReport} outputReport
 * @property {number|boolean=} threads
 */

/** @typedef {Partial<PluginOptions & StylelintOptions>} Options */

/**
 * @param {Options} pluginOptions
 * @returns {Partial<PluginOptions>}
 */
function getOptions(pluginOptions) {
  const options = {
    extensions: ['css', 'scss', 'sass'],
    emitError: true,
    emitWarning: true,
    failOnError: true,
    ...pluginOptions,
    ...(pluginOptions.quiet ? { emitError: true, emitWarning: false } : {}),
  };

  // @ts-ignore
  validate(schema, options, {
    name: 'Stylelint Webpack Plugin',
    baseDataPath: 'options',
  });

  return options;
}

/**
 * @param {Options} pluginOptions
 * @returns {Partial<StylelintOptions>}
 */
function getStylelintOptions(pluginOptions) {
  const stylelintOptions = { ...pluginOptions };

  // Keep the files and formatter option because it is common to both the plugin and Stylelint.
  const { files, formatter, ...stylelintOnlyOptions } = schema.properties;

  // No need to guard the for-in because schema.properties has hardcoded keys.
  // eslint-disable-next-line guard-for-in
  for (const option in stylelintOnlyOptions) {
    // @ts-ignore
    delete stylelintOptions[option];
  }

  return stylelintOptions;
}

module.exports = {
  getOptions,
  getStylelintOptions,
};
