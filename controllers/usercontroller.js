const {UniqueConstraintError} = require('sequelize');
const router = require("express").Router();
const {UserModel} = require('../models');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {
    const {characterName, username, password} = req.body;
    try {
        const User = await UserModel.create({
            characterName,
            username,
            password: bcrypt.hashSync(password, 13),
        });

        let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: 60*60*12});

        res.status(201).json({
            message: "Audacity user successfully registered!",
            user: User,
            token
        });
    } catch (error) {
        if (error instanceof UniqueConstraintError){
            res.status(409).json({
                message: "Username is already in use",
            });
        } else {
            res.status(500).json({
                message: "Failed to register user.",
            });
        }
    }
    
});


router.post('/login', async (req, res) => {
    let {username, password} = req.body;

    try {
        let userLogin = await UserModel.findOne({
            where: {username: username},
        });

        if (userLogin) {
            let passwordComparison = await bcrypt.compare (password, userLogin.password);
            if (passwordComparison){
                let token = jwt.sign (
                    {id: userLogin.id},
                    process.env.JWT_SECRET,
                    {expiresIn: 60*60*12}
                )

                res.status(200).json({
                    user: userLogin,
                    message: `Welcome ${username}!`,
                    token
                });
            } else {
                res.status(401).json({
                    message: "Incorrect username or password."
                })
            }
        } else {
            res.status(401).json({
                message: "Incorrect username or password."
            });
        }

    } catch (error) {
        res.status(500).json({
            message: "Login failed."
        })
    }
});

module.exports = router;