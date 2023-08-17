// ログ処理モジュール
const winston = require("winston");
// ログ日別処理モジュール
const winstonDaily = require("winston-daily-rotate-file");
// ログファイルパス
const logDir = "./logs";

// winston.formatの内部構造を持ち込む
const { combine, timestamp, label, printf } = winston.format;

// ログ出力フォーマット定義
const logFormat = printf(({ level, message, label, timestamp }) => {
  // timestamp: 時間、label: システムネーム、level: 情報、エラー、警告、message: ログメッセージ
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  format: combine(
    label({ label: "Sinaburo_Intranet" }),
    timestamp(),
    logFormat
  ),
  transports: [
    new winstonDaily({
      level: "info",
      datePattern: "YYYY-MM-DD",
      //colorize: false,
      dirname: logDir,
      filename: "%DATE%.log",
      maxsize: "20m",
      maxFiles: "30d",

      //showLevel: true,
      //json: false,
      //timestamp: timeStampFormat,
    }),
    //new winston.transports.Console({
    //  name: "debug-console",
    //  colorize: true,
    //  level: "debug",
    //  showLevel: true,
    //  json: false,
    //  timestamp: timeStampFormat,
    //}),
  ],
  //exceptionHandlers: [
  //  new winstonDaily({
  //    name: "exception-file",
  //    filename: "./log/exception",
  //    datePattern: "YYYY-MM-DD",
  //    colorize: false,
  //    maxsize: 50000000,
  //    maxFiles: 1000,
  //    level: "error",
  //    showLevel: true,
  //    json: false,
  //    timestamp: timeStampFormat,
  //  }),
  //  new winston.transports.Console({
  //    name: "exception-console",
  //    colorize: true,
  //    level: "debug",
  //    showLevel: true,
  //    json: false,
  //    timestamp: timeStampFormat,
  //  }),
  //],
});

if (process.env.NODE_ENV != "prod") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

function getCallStack(err) {
  var errors = err.stack.split("\n");

  return errors[errors.length - 1].split(":").reverse()[1];
}

module.exports = logger;
module.exports.getErrLine = getCallStack;
