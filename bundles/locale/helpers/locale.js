
// Require dependencies
const path       = require('path');
const deepMerge  = require('deepmerge');
const Helper     = require('helper');
const backend    = require('i18next-node-fs-backend');
const i18next    = require('i18next');
const sprintf    = require('i18next-sprintf-postprocessor');
const middleware = require('i18next-express-middleware');

// Require local dependencies
const config = require('config');

// Require compiled conf
const compiled = cache('locale');

/**
 * Build locale controller class
 */
class LocaleHelper extends Helper {
  /**
   * Construct locale controller class
   */
  constructor() {
    // Run super
    super();

    // Bind methods
    this.t = this.t.bind(this);
    this.build = this.build.bind(this);

    // Build
    this.building = this.build();
  }

  /**
   * Translates i18n by user
   *
   * @param  {user}   User
   * @param  {String} str
   * @param  {Object} opts
   *
   * @return {String}
   */
  t(User, str, opts) {
    // Check opts
    opts = opts || {};// eslint-disable-line no-param-reassign

    // Set lang
    // eslint-disable-next-line no-param-reassign
    opts.lng = opts.lang || (User ? (User.get('lang') || config.get('i18n.fallbackLng')) : config.get('i18n.fallbackLng'));

    // Check locale
    return this.locale.t(str, opts);
  }

  /**
   * Build locale controller
   */
  async build() {
    // Set langs and namespaces
    config.set('i18n.ns', compiled.namespaces);
    config.set('i18n.lngs', config.get('i19n.lngs') || compiled.locales);
    config.set('i18n.cache.versions', {});

    // Set whitelist
    if (config.get('i18n.lngs')) config.set('i18n.whitelist', config.get('i18n.lngs'));

    // Set cache versions for i18n
    for (let i = 0; i < config.get('i18n.lngs').length; i += 1) {
      // Set versions
      config.set(`i18n.cache.versions.${config.get('i18n.lngs')[i]}`, config.get('version'));
    }

    // Init
    i18next
      .use(middleware.LanguageDetector)
      .use(backend)
      .use(sprintf)
      .init(deepMerge({
        preload : config.get('i18n.lngs'),
        backend : {
          loadPath : path.join(global.appRoot, 'data', 'www', 'locales', '{{ns}}.{{lng}}.json'),
        },
      }, config.get('i18n') || {}));

    this.locale = i18next;
  }
}

/**
 * Export locale controller class
 *
 * @type {locale}
 */
module.exports = new LocaleHelper();
