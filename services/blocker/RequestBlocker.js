/* eslint-disable no-restricted-syntax */

class RequestBlocker {
  constructor(request) {
    this.request = request;
    this.strategyList = [];
  }

  setBlocker(...blocker) {
    this.strategyList.push(...blocker);
    return this;
  }

  getErrorData() {
    // eslint-disable-next-line guard-for-in
    for (const blockerFunc of this.strategyList) {
      const trueOrErrorData = blockerFunc(this.request);
      if (trueOrErrorData !== true) return trueOrErrorData;
    }

    return null;
  }
}

module.exports = RequestBlocker;
