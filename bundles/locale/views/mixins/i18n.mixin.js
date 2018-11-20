
// Create mixin
riot.mixin('i18n', {

  /**
   * On init function
   */
  init() {
    // Set value
    this.i18n = this.eden.get('i18n') || {};

    // On mount update
    if (!this.eden.frontend) {
      // Set default functions
      this.i18n.lang = () => {
        return this.eden.get('i18n').lng;
      };
    } else {
      // Load store
      this.i18n = require('locale/public/js/bootstrap'); // eslint-disable-line global-require

      // Bind update
      this.i18n.on('update', this.update);

      // On unmount
      this.on('unmount', () => {
        // Remove bind update
        this.i18n.removeListener('update', this.update);
      });
    }
  },

  /**
   * Create translation function
   *
   * @param {String} str
   *
   * @return {String}
   */
  t(...args) {
    const [str] = args;

    // Check helper
    if (this.eden.get('helpers') && this.eden.get('helpers').i18n) {
      // Return helper function
      return this.eden.get('helpers').i18n.t(str);
    }

    // Check i18n
    if (this.i18n && this.i18n.defaults && !this.i18n.initialized) {
      // Check default
      if (this.i18n.defaults[JSON.stringify(args)]) return this.i18n.defaults[JSON.stringify(args)];
    }

    // Check if exists
    if (this.i18n) return this.i18n.t(...args);
  },

  /**
   * Change language function
   *
   * @return {String}
   */
  lang(...args) {
    // Check if exists
    if (this.i18n) return this.i18n.lang(...args);

    return null;
  },
});
