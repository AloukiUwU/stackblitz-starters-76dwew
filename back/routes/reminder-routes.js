const express = require("express");
const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const { connect } = require("./secure-routes");
const router = express.Router();

app.get(
    "/reminder",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
      const reminder = await prisma.reminders.findMany({});
      res.json(reminder);
    }
  );

app.post(
    "/reminder",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { name, deadline, username } = req.body;
        const reminder = await prisma.reminders.create({
            data: {
                name: name,
                deadline: deadline,
                username: username,
                idUser: {
                    connect: {
                      where: {
                        username: username
                      }
                    }
                  }
            },
        })
        res.json(reminder);
    }
)