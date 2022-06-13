const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const path = require("path");
const okta = require("@okta/okta-sdk-nodejs");
const session = require("express-session");
const { ExpressOIDC } = require('@okta/oidc-middleware');

const auth = require("./auth");
const blogRouter = require("./routes/blog");
const usersRouter = require("./routes/users");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const oidc = new ExpressOIDC({
  appBaseUrl: "http://localhost:3000",
  issuer: "https://dev-29442551.okta.com/oauth2/default",
  client_id: "0oa5crqexb5eIpqRf5d7",
  client_secret: "MW57ln6s2O_WCsaDfJ0XK14v5cKRkb-v3Bv38PqJ",
  scope: "openid profile",
  routes: {
    login: {
      path: "/users/login"
    },
    loginCallback: {
      afterCallback: "/dashboard"
    }
  }
});

app.use(session({
  secret: "nfxdrtyuohg-tenlasjndyyyjmecad--ouio",
  resave: true,
  saveUninitialized: false
}));

app.use(oidc.router);

app.use((req, res, next) => {
  if (!req.userContext) {
    return next();
  }

  auth.client.getUser(req.userContext.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;
      next();
    });
});

// Routes
app.use("/", blogRouter);
app.use("/users", usersRouter);

// Error handlers
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;