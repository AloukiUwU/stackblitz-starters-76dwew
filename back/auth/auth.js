const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

// Configuration de la stratégie d'inscription locale avec Passport
passport.use(
  "signup",
  new localStrategy(
    {
      // Les champs du formulaire d'inscription sont configurés ici
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        delete req.body.passwordConfirmation;

        const saltRounds = 10;
        // Hashage du mot de passe dans la base de données
        const cryptPassword = await bcrypt.hash(password, saltRounds);

        const email = req.body.email;
        // Recherche de l'utilisateur dans la base de données par email
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

// Configuration de la stratégie d'authentification locale avec Passport
passport.use(
  "login",
  new localStrategy(
    {
      // Les champs du formulaire de connexion sont configurés ici
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        console.log(email, password);
        // Recherche de l'utilisateur dans la base de données par email
        const existingUser = await prisma.users.findFirst({
          where: {
            email: email,
          },
        });
        console.log(existingUser);
        // Si l'utilisateur n'est pas trouvé, retourne un message d'erreur
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
        // Si le mot de passe ne correspond pas, retourne un message d'erreur
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

        console.log(password, existingUser.password);

        // Trouve l'utilisateur par email
        const user = await prisma.users.findFirst({
          where: {
            email,
          },
        });

        // Si tout est bon, renvoie l'utilisateur avec un message de connexion réussie
        return done(null, user, { message: "Connecté avec succès" });
      } catch (error) {
        //Sinon, retourne l'erreur
        console.log(error);
        return done(error);
      }
    }
  )
);

// Configuration de la stratégie JWT avec Passport
passport.use(
  new JWTstrategy(
    {
      // Configuration de la clé secrète utilisée pour signer les JWT
      secretOrKey: "TOP_SECRET",
      // Configuration pour extraire le JWT de la requête HTTP
      jwtFromRequest: ExtractJWT.fromExtractors([
        ExtractJWT.fromUrlQueryParameter("auth"), // Extrait le JWT des paramètres de requête URL
        ExtractJWT.fromAuthHeaderAsBearerToken(), // Extrait le JWT du champ Authorization dans l'en-tête HTTP
      ]),
    },
    async (token, done) => {
      try {
        // Retourne l'utilisateur associé au JWT
        return done(null, token.user);
      } catch (error) {
        // En cas d'erreur, affiche l'erreur dans la console
        console.log(error);
        // Appelle la fonction 'done' avec l'erreur
        done(error);
      }
    }
  )
);
