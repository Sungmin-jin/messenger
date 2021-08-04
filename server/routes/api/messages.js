const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { Op } = require("sequelize");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id,
    // check if the conversations exists and found conversation belongs to the sender
    if (conversationId) {
      const conversation = await Conversation.findByPk(conversationId);
      if (
        !conversation ||
        (conversation.dataValues.user1Id !== senderId &&
          conversation.dataValues.user2Id !== senderId)
      ) {
        return res.sendStatus(405);
      }

      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

// excepts {conversationId} in body
router.post("/read", async (req, res) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const { conversationId } = req.body;

    //if there is no conversationId, send bad request status
    if (!conversationId) {
      return res.sendStatus(400);
    }

    const senderId = req.user.id;

    //check if conversation does not belong to the user
    const conversation = await Conversation.findByPk(conversationId);
    if (
      conversation.user1Id !== senderId &&
      conversation.user2Id !== senderId
    ) {
      return res.sendStatus(403);
    }
    //update all the unread
    const result = await Message.update(
      {
        isRead: true,
      },
      {
        where: {
          conversationId,
          senderId: {
            [Op.not]: senderId,
          },
        },
      }
    );
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
