const express = require("express");
const session = require("express-session");
const passport = require("passport");

const google = require("./routes/auth/google");
const index = require("./routes/index");
const insInfo = require("./routes/insInfo");
const modInfo = require("./routes/modInfo");
const insPay = require("./routes/insPay");
const viewPay = require("./routes/viewPay");
const payPrint = require("./routes/payPrint");
const setPayment = require("./routes/setPayment");

// セッション管理
const MariaDBStore = require("express-session-mariadb-store");
const cookieParser = require("cookie-parser");

const app = express();

//環境ファイルを使用する
require("dotenv").config();

// サーバーポート番号
const port = process.env.SERVER_PORT;

//app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "snbr_secret_key",
    resave: false,
    saveUninitialized: true,
    store: new MariaDBStore({
      user: "snbrAdmin",
      password: "xho98!v0HG",
    }),
    cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 30 },
  })
);

app.use(express.static("public"));

//HTMLのフレームワークでPugを使用することを宣言
app.set("view engine", "pug");

//Googleログイン
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

//Googleログイン後の認証可否による分岐
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

//「/」処理
app.get("/", async (req, res) => {
  //セッションを確認してログイン済みであれば/indexに分岐
  if (req.session.passport) {
    res.redirect("/index");
    //ログインされてない場合はGoogleログインを行う
  } else {
    res.redirect("/auth/google");
  }
});

//indexに分岐
app.use("/index", index);
//insInfoに分岐
app.use("/insInfo", insInfo);
//modInfoに分岐
app.use("/modInfo", modInfo);
//insPayに分岐
app.use("/insPay", insPay);
//viewPayに分岐
app.use("/viewPay", viewPay);
//payPrintに分岐
app.use("/payPrint", payPrint);
//setPaymentに分岐
app.use("/setPayment", setPayment);

//404エラー以外のエラー処理ミドルウェア
app.use((err, req, res, next) => {
  var errCode = err.errCode;
  console.log(errCode);

  if (!errCode) errCode = "500";

  res.render("./errors/error", {
    errorCode: errCode,
    errorTitle: process.env[errCode],
  });

  return;
});

//404エラー処理ミドルウェア
app.use((req, res) => {
  res.render("./errors/error", {
    errorCode: "404",
    errorTitle: process.env["404"],
  });

  return;
});

// app.listen()関数を使用してサーバーを実行させる
// クライアントは'host:port'でNodeサーバーへ要請を送られる。
app.listen(port, () => {
  console.log("サーバーが実行されます。http://localhost:" + port);
});

module.exports = app;
