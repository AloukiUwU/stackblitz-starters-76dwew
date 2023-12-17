const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const saltRounds = 10;

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        delete req.body.passwordConfirmation;

        const saltRounds = 10;
        const cryptPassword = await bcrypt.hash(password, saltRounds);

        const email = req.body.email;

        const existingUser = await prisma.users.findFirst({
          where: {
            email: email,
          },
        });

        if (existingUser) {
          const message = "L'adresse mail est déjà associée à un compte";
          const error = new Error(message);
          error.status = 409;
          error.code = "ACCOUNT_ALREADY_EXISTS";
          error.details = {
            field: "email",
            message: message,
          };
          return done(error, false);
        }

        const existingUsername = await prisma.users.findFirst({
          where: {
            username: username,
          },
        });

        if (existingUsername) {
          const message = "Le nom d'utilisateur est déjà pris";
          const error = new Error(message);
          error.status = 409;
          error.code = "USERNAME_ALREADY_TAKEN";
          error.details = {
            field: "username",
            message: message,
          };
          return done(error, false);
        }

        const user = await prisma.users.create({
          data: {
            email: email,
            username: username,
            password: cryptPassword,
          },
        });

        console.log(email, username, password);
        console.log(user);

        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        console.log(email, password);

        const existingUser = await prisma.users.findFirst({
          where: {
            email: email,
          },
        });
        console.log(existingUser);
        if (!existingUser) {
          const message = "Utilisateur non trouvé ou adresse e-mail incorrecte";
          const error = new Error(message);
          error.status = 401;
          error.code = "USER_NOT_FOUND_OR_INCORRECT_EMAIL";
          error.details = {
            field: "email",
            message: message,
          };
          return done(error, false);
        }

        // Compare le mot de passe fourni avec le mot de passe haché dans la base de données
        const passwordMatch = await bcrypt.compare(
          password,
          existingUser.password
        );
        console.log(passwordMatch);
        if (!passwordMatch) {
          const message = "Mot de passe incorrect.";
          const error = new Error(message);
          error.status = 401;
          error.code = "INCORRECT_PASSWORD";
          error.details = {
            field: "password",
            message: message,
          };
          return done(error, false);
        }

        console.log(password,existingUser.password);

        // Trouve l'utilisateur par email
        const user = await prisma.users.findFirst({
          where: {
            email,
          },
        });

        // Si tout est bon, renvoie l'utilisateur avec un message de connexion réussie
        return done(null, user, { message: "Connecté avec succès" });
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);

const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

passport.use(
  new JWTstrategy(
    {
      secretOrKey: "TOP_SECRET",
      jwtFromRequest: ExtractJWT.fromExtractors([
        ExtractJWT.fromUrlQueryParameter("auth"),
        ExtractJWT.fromAuthHeaderAsBearerToken(),
      ]),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);
