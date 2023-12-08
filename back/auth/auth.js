const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
//const bcrypt = require("bcrypt");

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
                const email = req.body.email;
                const user = await prisma.users.create({
                    data: {
                        email: email,
                        username: username,
                        password: password,
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
)

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

                const user = await prisma.users.findFirst({
                    where: {
                        email,
                        password,
                    },
                });

                return done(null, user, { message: "Logged in Successfully" });
            } catch (error) {
                console.log(error);
                return done(error);
            }
        }
    )
)
    
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