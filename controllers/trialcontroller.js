const router = require('express').Router();
const {TrialModel} = require('../models');
const middleware = require ('../middleware');


// ! GET ALL TRIALS

router.get('/', async (req, res) => {
    try{
        const allTrials = await TrialModel.findAll();
        res.status(200).json(allTrials);
    }catch(error){
        res.status(500).json({error: error})
    }
})


// ! GET ONE TRIAL BY ID 
router.get('/:id', async (req, res) => {
    try{
        const singleTrial = await TrialModel.findOne({
            where: {id: req.params.id}
        });
        res.status(200).json(singleTrial)
    } catch (error) {
        res.status(500).json({error: error})
    }
})



// !CREATE TRIAL

router.post('/create', async (req, res) => {
    const {expansion, nameOfFight, bossName, description, videoLink} = req.body;

    try{
        const newTrial = await TrialModel.create({
            expansion, nameOfFight, bossName, description, videoLink
        });
        res.status(201).json({
            message: "Trial successfully created.",
            newTrial
        })
    }catch (error) {
        res.status(500).json({error: error});
    }
})



//! EDIT TRIAL - MUST REQUIRE ADMIN ACCESS

router.put('/edit/:id', async (req, res) => {
    const {expansion, nameOfFight, bossName, description, videoLink} = req.body;

    try {
        const trialUpdate = await TrialModel.update({expansion, nameOfFight, bossName, description, videoLink},
            {where: {id: req.params.id}})

            res.status(200).json({
                message: "Trial has been successfully updated",
                trialUpdate
            })
    } catch (error){
        res.status(500).json({
            message: `Failed to update trial: ${error}`
        })
    }
})


//! DELETE TRIAL - MUST REQUIRE ADMIN ACCESS

router.delete('/delete/:id', async (req, res) => {
    try {
        const trialDeleted = await TrialModel.destroy({
            where: {id: req.params.id}
        })

        res.status(200).json({
            message: "Trial has been successfully deleted.",
            trialDeleted
        })
    }catch (error){
        res.status(500).json({
            message: `Failed to delete trial: ${error}`
        })
    }
});

module.exports = router;