const NodeEnvironment = require('jest-environment-node').default;
const util = require('util');

class CustomEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.global.TextEncoder = TextEncoder;
    this.global.TextDecoder = TextDecoder;
  }

  async setup() {
    await super.setup();
    
    // Override JSON.stringify to handle circular references
    this.global.JSON.stringify = (obj, replacer, space) => {
      const seen = new WeakSet();
      return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular]';
          }
          seen.add(value);
        }
        return value;
      }, space);
    };

    // Override util.inspect to handle circular references
    this.global.util = {
      ...util,
      inspect: (obj, options = {}) => {
        return util.inspect(obj, { ...options, depth: 2, maxStringLength: 100 });
      }
    };
  }

  async teardown() {
    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

module.exports = CustomEnvironment; 