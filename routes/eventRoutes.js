const express = require('express');
const {check,validationResult}= require ('express-validator')

let Events = require('../models/Events')
const authMiddleware=require('../middlewares/authMiddleware');
const router = express.Router();

//route Get api/event
//desc Get all event
//access public
router.get(
  '/',

 async (req, res) => {
    try {      
         const event= await Events.find();
       res.send(event);
    } catch (error) {
        res.status(500).send('server error');
    }
  
});

//route Get api/event/:id
//desc Get raise by id
//access public
router.get('/:id', async(req, res) => {
  
    try {
        const findEvent= await Events.findById(req.params.id);
        if (!findEvent) {
            return res.status(404).send('Event not found');
          } else {
            res.send(findEvent);
          }
    } catch (error) {
        res.status(500).send('Server Error')
    }   
});

//route Post api/event
//desc Add a event
//access public
router.post(
  '/',
 //authMiddleware,
  [
    check('title','Title is required').not().isEmpty(),
    check('description','Description is required').not().isEmpty(),
] , 
  async(req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }


    if (!req.files || Object.keys(req.files).length === 0) {       
      console.log("error image");
      res.status(400).send('No image uploaded.');
      return;
    }

    const file = req.files.myFile;
    const upath = 'public/uploads/' + file.name;


    const newEvent = await Events.create({
        user:req.user.id,
        title: req.body.title,
        description: req.body.description,
       eImage:file.name
       })

       file.mv(upath, function (err) {
        if (err) return res.status(500).send(err);
     });      
  } catch (error) {
    console.log(error);
   // return res.status(500).json({ error:'server error' });
  }
 res.send('New Event added');
});

//route Delete api/event/
//desc delete event by id
//access public
router.delete(
  '/:id', 
  authMiddleware,
  async(req, res) => {
    try {      
        const delEvent= await Events.findOneAndRemove({_id: req.params.id});
        if (!delEvent) {
            return res.status(404).json({errors:'Sorry! You are not allowed to delete this event'});
          } else {
            res.send("Event deleted");
          } 
    } catch (error) {
        res.status(500).send('Server Error')
    } 
});

//route PUT api/event/
//desc update event by id
//access public
router.put(
  '/',
  authMiddleware, 
  async(req, res) => {
  //find the element
try {
    const updateEvent =await Events.findOne({_id:req.body.id,user:req.user.id})
    if (!updateEvent) {
      return res.status(400).json({errors:'Sorry! You are not allowed to edit this event'});
      }   

      console.log("Req- "+req.user.id);
      console.log(updateEvent._id);
    
      console.log(updateEvent);
      updateEvent.title= req.body.title;
      updateEvent.description= req.body.description;
            
      await updateEvent.save();
      res.send (updateEvent);    
} catch (error) {
  return res.status(500).json({ error: error.message });
}
  
});

module.exports = router;