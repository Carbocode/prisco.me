import pino from "pino";

console.log("[logger] module loaded");

const isWorkers = typeof process === "undefined";

const baseConfig: pino.LoggerOptions = {
  level: (isWorkers ? "info" : process.env.LOG_LEVEL) || "info",
  base: { service: "prisco-website-backend" },
};

const workerConfig: pino.LoggerOptions = {
  ...baseConfig,
  browser: {
    asObject: true,
    write(log) {
      if (log.level >= 50) console.error(log);
      else if (log.level >= 40) console.warn(log);
      else if (log.level >= 30) console.info(log);
      else console.debug(log);
    },
  },
};

const localConfig: pino.LoggerOptions = {
  ...baseConfig,
  // In locale possiamo usare pino-pretty
  transport: isWorkers
    ? {
        target: "pino-pretty",
        options: { colorize: true },
      }
    : undefined,
};

export const logger = pino(isWorkers ? workerConfig : localConfig);
