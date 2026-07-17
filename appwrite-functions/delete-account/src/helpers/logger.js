export const createLogger = (logCallback, errorCallback) => {
  return {
    log: (msg) => logCallback?.(msg) || console.log(msg),
    error: (msg) => errorCallback?.(msg) || console.error(msg),
  };
};
