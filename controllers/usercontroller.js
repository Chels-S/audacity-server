const {UniqueConstraintError} = require('sequelize');
const router = require("express").Router();
const {UserModel} = require('../models');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const roleAuth = require('../middleware/roleAuth');


router.post('/register', async (req, res) => {
    const {characterName, username, password, role} = req.body;
    try {
        const User = await UserModel.create({
            characterName,
            username,
            password: bcrypt.hashSync(password, 13),
            role,
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
                message: "Username or Character Name is already in use",
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
                    {id: userLogin.id, role: userLogin.role},
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


//! GET ALL USERS
router.get('/', roleAuth, async (req, res) =>{
    try{
        const allUsers = await UserModel.findAll();
        res.status(200).json(allUsers);
    }catch(error){
        res.status(500).json({error: error})
    }
})


//! UPDATE USER BY ADMIN

router.put('/edit/:id', roleAuth, async (req, res) => {
    const {characterName, username, password, role} = req.body;
    const {id} = req.params

    try {
        const userUpdate = await UserModel.update({characterName, username, password, role},
            {where: {id: id}})

            res.status(200).json({
                message: "User has been successfully updated",
                userUpdate: userUpdate === 0 ? `no user to update` : userUpdate
            })
    }catch (error) {
        res.status(500).json({
            message: `Failed to update user: ${error}`
        })
    }
});


//! DELETE USER BY ADMIN

router.delete('/delete/:id', roleAuth, async (req, res)=> {
    const {id} = req.params
    try {
        const userDeleted = await UserModel.destroy({
            where: {id: id}
        })

        res.status(200).json({
            message: "User has been successfully deleted.",
            userDeleted: userDeleted === 0 ? `no user to delete` : userDeleted
        })
    } catch (error) {
        res.status(500).json({
            message: `Failed to delete user: ${error}`
        })
    }
});



 
module.exports = router;