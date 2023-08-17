const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const app = express();

//CallBack URL定義
const callbakURL =
  "http://" +
  process.env.HOST_NAME +
  ":" +
  process.env.SERVER_PORT +
  "/auth/google/callback";

// 環境変数読み込み
require("dotenv").config();
// Google ログインキー
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

//passort初期化及びセッション連携
app.use(passport.initialize());
app.use(passport.session());

//loginが成功した最初のみ呼ばれる
//done(null, user.id)でセッションを初期化する
passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

//Google login
//ログイン成功時、callbackでrequest, accessToken, refreshToken, profileなどが出る
//該当Callbackから使用者が誰かdone(null, user)形式で入れればOK
//今回は受け取ったprofileを渡す
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: callbakURL,
      passReqToCallback: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      //console.log(profile);
      //console.log(accessToken);

      done(null, profile);
    }
  )
);

module.exports = app;
