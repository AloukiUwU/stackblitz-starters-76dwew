const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

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
                const user = await prisma.user.create({
                    data: {
                        email: email,
                        username: username,
                        password: password,
                    },
                });

                console.log(email, username, password);

                //   const existingUser = await prisma.user.findFirst({
                //     where: {
                //       email: email,
                //     },
                //   });

                //   if (existingUser) {
                //     const message = "L'adresse mail est déjà associée à un compte";
                //     const error = new Error(message);
                //     error.status = 409;
                //     error.code = "ACCOUNT_ALREADY_EXISTS";
                //     error.details = {
                //       field: "email",
                //       message: message,
                //     };
                //     return done(error, false);
                //   }

                //   const existingUsername = await prisma.user.findFirst({
                //     where: {
                //       username: username,
                //     },
                //   });

                //   if (existingUsername) {
                //     const message = "Le nom d'utilisateur est déjà pris";
                //     const error = new Error(message);
                //     error.status = 409;
                //     error.code = "USERNAME_ALREADY_TAKEN";
                //     error.details = {
                //       field: "username",
                //       message: message,
                //     };
                //     return done(error, false);
                //   }


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

                const user = await prisma.user.findFirst({
                    where: {
                        email,
                        password,
                    },
                });
                
                // const existingUser = await prisma.user.findFirst({
                //     where: {
                //         email: email,
                //     },
                // });
                // console.log(existingUser);
                // if (!existingUser) {
                //     const message = "Utilisateur non trouvé ou adresse e-mail incorrecte";
                //     const error = new Error(message);
                //     error.status = 401;
                //     error.code = "USER_NOT_FOUND_OR_INCORRECT_EMAIL";
                //     error.details = {
                //         field: "email",
                //         message: message,
                //     };
                //     return done(error, false);
                // }

                // const passwordMatches = await bcrypt.compare(
                //     password,
                //     existingUser.password
                // );
                // console.log(passwordMatches);
                // if (password !== existingUser.password) {
                //     const message = "Mot de passe incorrect.";
                //     const error = new Error(message);
                //     error.status = 401;
                //     error.code = "INCORRECT_PASSWORD";
                //     error.details = {
                //         field: "password",
                //         message: message,
                //     };
                //     return done(error, false);
                // }


                return done(null, user, { message: "Logged in Successfully" });
            } catch (error) {
                console.log(error);
                return done(error);
            }
        }
    ))