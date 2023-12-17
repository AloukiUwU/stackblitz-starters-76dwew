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
  
          // Trouve l'utilisateur par email
          const user = await prisma.users.findFirst({
            where: {
              email,
            },
          });
  
          // Si l'utilisateur n'existe pas, renvoie un message d'erreur
          if (!user) {
            return done(null, false, { message: "Utilisateur non trouvé" });
          }
  
          // Compare le mot de passe fourni avec le mot de passe haché dans la base de données
          const passwordMatch = await bcrypt.compare(password, user.password);
  
          // Si les mots de passe ne correspondent pas, renvoie un message d'erreur
          if (!passwordMatch) {
            return done(null, false, { message: "Mot de passe incorrect" });
          }
  
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
