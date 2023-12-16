const express = require("express");
const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const { connect } = require("./secure-routes");
const app = express.Router();

app.get(
    "/reminder",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const reminder = await prisma.reminders.findMany({});
        res.json(reminder);
    }
);

app.get(
    "/reminder/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { id } = req.params;
        const reminder = await prisma.reminders.findUnique({
            where: {
                id: Number(id),
            }
        });
        res.json(reminder);
    }
);

//Créer un reminder avec une couleur ?
app.post(
    "/reminder",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { name, deadline, idUser, idGroup } = req.body;
        const date = new Date(deadline);
        date.toLocaleDateString("fr");
        const reminder = await prisma.reminders.create({
            data: {
                name: name,
                deadline: date,
                idUser,
                idGroup,
            }
        })
        res.json(reminder);
    }
);

app.patch(
    "/reminder/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { id } = req.params;
        const { name, description, color, deadline, idGroup } = req.body;
        const updateFields = {};
        if (name) updateFields.name = name;
        if (description) updateFields.description = description;
        if (color) updateFields.color = color;
        if (deadline) updateFields.deadline = new Date(deadline);
        if (idGroup) updateFields.idGroup = idGroup;
        const reminder = await prisma.reminders.update({
            where: {
                id: Number(id),
            },
            data: 
                updateFields,
        })
        res.json(reminder);
    }
);

app.delete(
    "/reminder/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { id } = req.params;
        const reminder = await prisma.reminders.delete({
            where: {
                id: Number(id),
            },
        })
        res.json(reminder);
    }
);

module.exports = app;