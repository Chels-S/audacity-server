const router = require('express').Router();
const {RaidModel, UserModel} = require('../models');
const validateSession = require('../middleware/validateSession');
const roleAuth = require('../middleware/roleAuth');






// ! GET ALL RAIDS

router.get('/', validateSession, async (req, res) => {
    try{
        const allRaids = await RaidModel.findAll();
        res.status(200).json(allRaids);
    }catch(error){
        res.status(500).json({error: error})
    }
})


// ! GET ONE RAID BY ID 
router.get('/:id', validateSession, async (req, res) => {
    try{
        const singleRaid = await RaidModel.findOne({
            where: {id: req.params.id}
        });
        res.status(200).json(singleRaid)
    } catch (error) {
        res.status(500).json({error: error})
    }
})




// ! CREATE RAID - ADMINS ONLY

router.post('/create', roleAuth, async (req, res) => {
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

router.put('/edit/:id', roleAuth, async (req, res) => {
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

router.delete('/delete/:id', roleAuth, async (req, res) => {
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