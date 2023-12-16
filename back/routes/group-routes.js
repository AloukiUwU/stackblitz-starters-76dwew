const express = require("express");
const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const { connect } = require("./secure-routes");
const app = express.Router();

//TODO : Modify the routes to manage groupes

app.get(
    "/group",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const group = await prisma.groups.findMany({});
        res.json(group);
    }
);

app.get(
    "/group/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { id } = req.params;
        const group = await prisma.groups.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                users: true,
                reminders: true,
              }
        });
        res.json(group);
    }
);

//Lorsqu'un group est créé, on doit ajouter l'utilisateur qui l'a créé 
//juste après dans le groupe
app.post(
    "/group",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { name, users } = req.body;
        const group = await prisma.groups.create({
            data: {
                name: name,
                users: {
                    connect: users.map((user) => ({
                        username: user.username
                    }))
                },
            }
        })
        res.json(group);
    }
);

app.patch(
    "/group/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { id } = req.params;
        const { name, users } = req.body;
        const group = await prisma.groups.update({
            where: {
                id: Number(id),
            },
            data: {
                name: name,
                users: {
                    connect: users.map((user) => ({
                        username: user.username
                    }))
                },
            },
            include: {
                users: true,
            }
        })
        res.json(group);
    }
);

app.delete(
    "/group/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { id } = req.params;
        const group = await prisma.groups.delete({
            where: {
                id: Number(id),
            },
        })
        res.json(group);
    }
);

module.exports = app;