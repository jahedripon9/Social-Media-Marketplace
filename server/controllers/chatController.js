import prisma from "../configs/prisma.js";

// Controller for getting chat (creating if not exist)

export const getChat = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { listingId, chatId } = req.body;

    console.log("Clerk userId:", userId);

    // 1. Find listing
    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
    });

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    // 2. Check current user in Prisma
    const chatUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    console.log("Prisma chatUser:", chatUser);

    if (!chatUser) {
      return res.status(404).json({
        message: "Current user does not exist in Prisma User table",
        userId,
      });
    }

    // 3. Check listing owner
    const ownerUser = await prisma.user.findUnique({
      where: {
        id: listing.ownerId,
      },
    });

    console.log("Prisma ownerUser:", ownerUser);

    if (!ownerUser) {
      return res.status(404).json({
        message: "Listing owner does not exist in Prisma User table",
        ownerId: listing.ownerId,
      });
    }

    // 4. Find existing chat
    let existingChat = null;

    if (chatId) {
      existingChat = await prisma.chat.findFirst({
        where: {
          id: chatId,
          OR: [
            { chatUserId: userId },
            { ownerUserId: userId },
          ],
        },
        include: {
          listing: true,
          ownerUser: true,
          chatUser: true,
          messages: true,
        },
      });
    } else {
      existingChat = await prisma.chat.findFirst({
        where: {
          listingId,
          chatUserId: chatUser.id,
          ownerUserId: ownerUser.id,
        },
        include: {
          listing: true,
          ownerUser: true,
          chatUser: true,
          messages: true,
        },
      });
    }

    // 5. Existing chat
    if (existingChat) {
      if (
        existingChat.isLastMessageRead === false &&
        existingChat.messages.length > 0
      ) {
        const lastMessage =
          existingChat.messages[existingChat.messages.length - 1];

        const isLastMessageSentByMe =
          lastMessage.sender_id === userId;

        if (!isLastMessageSentByMe) {
          await prisma.chat.update({
            where: {
              id: existingChat.id,
            },
            data: {
              isLastMessageRead: true,
            },
          });
        }
      }

      return res.json({
        chat: existingChat,
      });
    }

    // 6. Create new chat
    const newChat = await prisma.chat.create({
      data: {
        listingId: listing.id,
        chatUserId: chatUser.id,
        ownerUserId: ownerUser.id,
      },
    });

    // 7. Get newly created chat with relations
    const chatWithData = await prisma.chat.findUnique({
      where: {
        id: newChat.id,
      },
      include: {
        listing: true,
        ownerUser: true,
        chatUser: true,
        messages: true,
      },
    });

    return res.json({
      chat: chatWithData,
    });
  } catch (error) {
    console.log("Get Chat Error:", error);

    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};

// Controller for getting chat (creating if not exist)
// export const getChat = async (req, res) => {
//   try {
//     const { userId } = await req.auth();
//     const { listingId, chatId } = req.body;

//     if (!listingId) {
//       return res.status(400).json({
//         message: "Listing ID is required",
//       });
//     }

//     // Make sure current user exists in Prisma
//     const chatUser = await prisma.user.findUnique({
//       where: {
//         id: userId,
//       },
//     });

//     if (!chatUser) {
//       return res.status(404).json({
//         message: "User not found in database",
//       });
//     }

//     const listing = await prisma.listing.findUnique({
//       where: {
//         id: listingId,
//       },
//     });

//     if (!listing) {
//       return res.status(404).json({
//         message: "Listing not found",
//       });
//     }

//     // Make sure listing owner exists
//     const ownerUser = await prisma.user.findUnique({
//       where: {
//         id: listing.ownerId,
//       },
//     });

//     if (!ownerUser) {
//       return res.status(404).json({
//         message: "Listing owner not found in database",
//       });
//     }

//     console.log("Clerk userId:", userId);
//     console.log("Prisma chatUser:", chatUser);
//     console.log("Prisma ownerUser:", ownerUser);

//     // Don't allow owner to create chat with himself
//     if (userId === listing.ownerId) {
//       return res.status(400).json({
//         message: "You cannot chat with your own listing",
//       });
//     }

//     // Find existing chat
//     let existingChat = null;

//     if (chatId) {
//       existingChat = await prisma.chat.findFirst({
//         where: {
//           id: chatId,
//           OR: [{ chatUserId: userId }, { ownerUserId: userId }],
//         },
//         include: {
//           listing: true,
//           ownerUser: true,
//           chatUser: true,
//           messages: {
//             orderBy: {
//               createdAt: "asc",
//             },
//           },
//         },
//       });
//     } else {
//       existingChat = await prisma.chat.findFirst({
//         where: {
//           listingId,
//           chatUserId: userId,
//           ownerUserId: listing.ownerId,
//         },
//         include: {
//           listing: true,
//           ownerUser: true,
//           chatUser: true,
//           messages: {
//             orderBy: {
//               createdAt: "asc",
//             },
//           },
//         },
//       });
//     }

//     if (existingChat) {
//       if (
//         existingChat.isLastMessageRead === false &&
//         existingChat.messages.length > 0
//       ) {
//         const lastMessage =
//           existingChat.messages[existingChat.messages.length - 1];

//         const isLastMessageSentByMe = lastMessage.sender_id === userId;

//         if (!isLastMessageSentByMe) {
//           await prisma.chat.update({
//             where: {
//               id: existingChat.id,
//             },
//             data: {
//               isLastMessageRead: true,
//             },
//           });
//         }
//       }

//       return res.json({
//         chat: existingChat,
//       });
//     }

//     // Create new chat
//     const newChat = await prisma.chat.create({
//       data: {
//         listingId,
//         chatUserId: userId,
//         ownerUserId: listing.ownerId,
//       },
//     });

//     const chatWithData = await prisma.chat.findUnique({
//       where: {
//         id: newChat.id,
//       },
//       include: {
//         listing: true,
//         ownerUser: true,
//         chatUser: true,
//         messages: {
//           orderBy: {
//             createdAt: "asc",
//           },
//         },
//       },
//     });

//     return res.json({
//       chat: chatWithData,
//     });
//   } catch (error) {
//     console.log("Get Chat Error:", error);

//     return res.status(500).json({
//       message: error.code || error.message,
//     });
//   }
// };
// Controller For Getting All Chats for User
export const getAllUserChats = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const chats = await prisma.chat.findMany({
      where: {
        OR: [{ chatUserId: userId }, { ownerUserId: userId }],
      },
      include: {
        listing: true,
        ownerUser: true,
        chatUser: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!chats || chats.length === 0) {
      return res.json({ chats: [] });
    }
    return res.json({ chats });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

// Controller For adding Message to Chat
export const sendChatMessage = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { chatId, message } = req.body;
    const chat = await prisma.chat.findFirst({
      where: {
        AND: [
          { id: chatId },
          { OR: [{ chatUserId: userId }, { ownerUserId: userId }] },
        ],
      },
      include: {
        listing: true,
        ownerUser: true,
        chatUser: true,
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    } else if (chat.listing.status !== "active") {
      return res
        .status(400)
        .json({ message: `Listing is ${chat.listing.status}` });
    }

    const newMessage = {
      message,
      sender_id: userId,
      chatId,
      createdAt: new Date(),
    };

    await prisma.message.create({
      data: newMessage,
    });

    res.json({ message: "Message sent Successfully", newMessage });

    await prisma.chat.update({
      where: { id: chatId },
      data: {
        lastMessage: newMessage.message,
        isLastMessageRead: false,
        lastMessageSenderId: userId,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
