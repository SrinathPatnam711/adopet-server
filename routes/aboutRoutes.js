const express = require('express');
const {check,validationResult}= require ('express-validator')

let About = require('../models/About')
const authMiddleware=require('../middlewares/authMiddleware');
const router = express.Router();

//route Get api/experience
//access public
router.get(
  '/',
authMiddleware,
 async (req, res) => {
    try {      
         const about= await About.find();
       res.send(about);
    } catch (error) {
        res.status(500).send('server error');
    }
  
});

//route Get api/exp/:id
//desc Get exp by id
//access public
router.get('/:id', async(req, res) => {
  
    try {
        const findAbout= await About.findById(req.params.id);
        if (!findAbout) {
            return res.status(404).send('Experience not found');
          } else {
            res.send(findAbout);
          }
    } catch (error) {
        res.status(500).send('Server Error')
    }   
});

//route Post api/exp
//desc Add an exp
//access public
router.post(
  '/',
 authMiddleware,
  [
    check('ptype','Pet Type is required').not().isEmpty(),
    check('pbreed','Pet Breed is required').not().isEmpty(),
    check('pneeds','Pet needs are required').not().isEmpty(),
    check('phabbits','Pet habbits are required').not().isEmpty(),
    check('experience','Experience need to be at least 30 chars').isLength({ min: 30, }),
] , 
  async(req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }
      const newAbout = await About.create({
        user:req.user.id,
        ptype: req.body.ptype,
        pbreed: req.body.pbreed,
        pneeds: req.body.pneeds,
        phabbits: req.body.phabbits,
        experience: req.body.experience,
       })
  } catch (error) {
    //console.log(error);
    return res.status(500).json({ error:'server error' });
  }
 res.send('New experience added');
});

//route Delete api/about/
//desc delete about by id
//access public
router.delete(
  '/:id', 
  authMiddleware,
  async(req, res) => {
    try {      
        const delAbout= await About.findOneAndRemove({_id: req.params.id});
        if (!delAbout) {
            return res.status(404).send('Post not found');
          } else {
            res.send("Post deleted");
          }
    } catch (error) {
        res.status(500).send('Server Error')
    } 
});


module.exports = router;