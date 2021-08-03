const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op, literal } = require("sequelize");
const onlineUsers = require("../../onlineUsers");
const db = require("../../db");
const conversationCompare = (convo1, convo2) => {
  return (
    convo2.messages[convo2.messages.length - 1].createdAt -
    convo1.messages[convo1.messages.length - 1].createdAt
  );
};

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }

    console.log("routes start");
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        {
          model: Message,
        },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    // const testConversation = await Conversation.findAll({
    //   attributes: {
    //     include: [
    //       [
    //         literal(`(
    //           SELECT COUNT(*)
    //           FROM messages AS msg
    //           WHERE
    //               msg.isRead != conversation.id

    //       )`),
    //         "unReadChatCount",
    //       ],
    //     ],
    //   },
    // });

    // console.log(JSON.stringify(testConversation, null, 2));

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      const unReadChats = convo.messages.reduce(
        (acc, msg) => (msg.senderId !== userId && !msg.isRead ? ++acc : acc),
        0
      );
      convoJSON.unReadChats = unReadChats;
      // set properties for notification count and latest message preview
      convoJSON.latestMessageText =
        convoJSON.messages[convoJSON.messages.length - 1].text;
      conversations[i] = convoJSON;
    }

    //sort the conversation in descending order by its last message's createdAt attribute
    conversations.sort(
      (convo1, convo2) =>
        convo2.messages[convo2.messages.length - 1].createdAt -
        convo1.messages[convo1.messages.length - 1].createdAt
    ); //

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
