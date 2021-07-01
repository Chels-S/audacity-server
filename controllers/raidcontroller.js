const router = require('express').Router();
const {RaidModel} = require('../models');
const middleware = require ('../middleware/');
const validateSession = require('../middleware/validateSession');





// ! GET ALL RAIDS

router.get('/', middleware.validateSession, async (req, res) => {
    try{
        const allRaids = await RaidModel.findAll();
        res.status(200).json(allRaids);
    }catch(error){
        res.status(500).json({error: error})
    }
})


// ! GET ONE RAID BY ID 
router.get('/:id', middleware.validateSession, async (req, res) => {
    try{
        const singleRaid = await RaidModel.findOne({
            where: {id: req.params.id}
        });
        res.status(200).json(singleRaid)
    } catch (error) {
        res.status(500).json({error: error})
    }
})




// ! CREATE RAID

router.post('/create', middleware.validateSession, async (req, res) => {
    const {expansion, nameOfFight, bossName, description, videoLink} = req.body;

    try{
        const newRaid = await RaidModel.create({
            expansion, nameOfFight, bossName, description, videoLink
        });
        res.status(201).json({
            message: "Raid successfully created.",
            newRaid
        })
    }catch (error) {
        res.status(500).json({error: error});
    }
})


//! EDIT RAID - MUST REQUIRE ADMIN ACCESS

router.put('/edit/:id', middleware.validateSession, async (req, res) => {
    const {expansion, nameOfFight, bossName, description, videoLink} = req.body;

    try {
        const raidUpdate = await RaidModel.update({expansion, nameOfFight, bossName, description, videoLink},
            {where: {id: req.params.id}})

            res.status(200).json({
                message: "Raid has been successfully updated",
                raidUpdate
            })
    } catch (error){
        res.status(500).json({
            message: `Failed to update raid: ${error}`
        })
    }
})


//! DELETE RAID - MUST REQUIRE ADMIN ACCESS

router.delete('/delete/:id', middleware.validateSession, async (req, res) => {
    try {
        const raidDeleted = await RaidModel.destroy({
            where: {id: req.params.id}
        })

        res.status(200).json({
            message: "Raid has been successfully deleted.",
            raidDeleted
        })
    }catch (error){
        res.status(500).json({
            message: `Failed to delete raid: ${error}`
        })
    }
});



module.exports = router;