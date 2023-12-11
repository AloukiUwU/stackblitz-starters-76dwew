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
        const reminder = await prisma.groups.findMany({});
        res.json(reminder);
    }
);

app.get(
    "/group/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { id } = req.params;
        const reminder = await prisma.groups.findUnique({
            where: {
                id: Number(id),
            }
        });
        res.json(reminder);
    }
);

app.post(
    "/group",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { name, deadline, idUser } = req.body;
        const date = new Date(deadline);
        const reminder = await prisma.groups.create({
            data: {
                name: name,
                deadline: date,
                idUser,
            }
        })
        res.json(reminder);
    }
);

app.patch(
    "/group/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { id } = req.params;
        const { name, description, color, deadline } = req.body;
        const date = new Date(deadline);
        const reminder = await prisma.groups.update({
            where: {
                id: Number(id),
            },
            data: {
                name: name,
                description: description,
                color: color,
                deadline: date,
            }
        })
        res.json(reminder);
    }
);

app.delete(
    "/group/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { id } = req.params;
        const reminder = await prisma.groups.delete({
            where: {
                id: Number(id),
            },
        })
        res.json(reminder);
    }
);

module.exports = app;