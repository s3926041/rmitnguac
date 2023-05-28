const router = require("express").Router();
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Student = require("../models/Student");

router.get("/all", async (req, res) => {
  try {
    const conversation = await Conversation.find({});
    console.log(conversation);
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//new conv
router.post("/", async (req, res) => {
  try {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] }, 
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
    // console.log('sdad')
  }
});
router.get("/student/:userId", async (req, res) => {
  try {
    const student = await Student.find({ _id: req.params.userId });
    console.log(student);
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/deleteall",async(req,res)=>{
  const delC = await Conversation.deleteMany({})
  const delM = await Message.deleteMany({})
  res.status(200).json("deleted")
})


//check who available
router.get("/available/:userId", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] }, 
    });

    const talkedToIds = conversations.flatMap((conversation) =>
    conversation.members.filter((member) => member !== req.params.userId)
    );

    talkedToIds.push(req.params.userId);
    // console.log(talkedToIds);

    const unTalkedToPeople = await Student.find({ _id: { $nin: talkedToIds } });
    // console.log(unTalkedToPeople);

    res.status(200).json(unTalkedToPeople);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/delete/:id",async(req,res)=>{
  const delC = await Conversation.deleteOne({_id : req.params.id})
  const delM = await Message.deleteMany({conversationId : req.params.id})
  res.status(200).json(delM)
})




module.exports = router;
