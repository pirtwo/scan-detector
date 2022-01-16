/**
 * Detects barcode scanner and keyboard inputs
 * @param {any} options
 * @returns object
 */
function ScanDetector(options = {}) {
  let obj = {};
  obj.element = document;
  obj.prefix = [];
  obj.suffix = [9, 13];
  obj.avgCharTime = 30;
  obj.minCodeLength = 6;
  obj.preventDefault = false;
  obj.stopPropagation = false;
  obj.customEncoder = null;
  obj.onScanFinish = null;
  obj.debugMode = false;
  obj._timer = null;
  obj._buffer = [];
  obj._attached = false;
  obj = { ...obj, ...options };

  obj.getOptions = function () {
    return {
      element: obj.element,
      prefix: obj.prefix,
      suffix: obj.suffix,
      avgCharTime: obj.avgCharTime,
      minCodeLength: obj.minCodeLength,
      preventDefault: obj.preventDefault,
      stopPropagation: obj.stopPropagation,
      customEncoder: obj.customEncoder,
      onScanFinish: obj.onScanFinish,
      debugMode: obj.debugMode,
    };
  };

  obj.setOptions = function (options) {
    obj = { ...this, ...options };
  };

  obj._dispatch = function (event, payload) {
    this.element.dispatchEvent(new CustomEvent(event, { detail: payload }));
  };

  obj._isPrefix = function (keycode) {
    return this.prefix.indexOf(keycode) > -1;
  };

  obj._isSuffix = function (keycode) {
    return this.suffix.indexOf(keycode) > -1;
  };

  obj._hasMinLen = function () {
    return this._buffer.length > this.minCodeLength;
  };

  obj._flush = function () {
    this._timer = null;
    this._buffer = [];
  };

  obj._onKeydown = function (e) {
    if (this.debugMode) console.log(e);
    if (this.preventDefault) e.preventDefault();
    if (this.stopPropagation) e.stopPropagation();

    this._buffer.push(
      this.customEncoder != null ? this.customEncoder(e) : e.key
    );

    if (this._timer != null) {
      // input speed meets avg char time
      clearTimeout(this._timer);
      if (this._isPrefix(e.keyCode)) {
        this._buffer.pop();
        return;
      }
      if (this._isSuffix(e.keyCode) && this._hasMinLen()) {
        this._buffer.pop();
        this._dispatch(
          "scanner",
          this.onScanFinish != null
            ? this.onScanFinish(this._buffer.join(""))
            : this._buffer.join("")
        );
        this._flush();
        return;
      }
    }

    // set timer for next input
    this._timer = setTimeout(
      function (e) {
        // input speed dose not meet avg char time
        this._dispatch("keyboard", e);
        this._flush();
      }.bind(this),
      this.avgCharTime,
      e
    );
  };

  obj.attach = function () {
    if (this._attached) this.detach();
    this._attached = true;
    this.element.addEventListener("keydown", this._onKeydown.bind(this));
  };

  obj.detach = function () {
    this._attached = false;
    this.element.removeEventListener("keydown", this._onKeydown.bind(this));
  };

  return obj;
}
