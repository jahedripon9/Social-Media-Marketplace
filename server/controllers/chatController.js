import prisma from "../configs/prisma";

// Controller for getting chat (creating if not exist)
export const getChat = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { listingId, chatId } = req.body;

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });
    if (!listing) {
      return res.status(404).json({ message: "listing not found" });
    }

    // Find Existing Chat
    let existingChat = null;
    if (chatId) {
      existingChat = await prisma.chat.findFirst({
        where: {
          id: chatId,
          OR: [{ chatUserId: userId }, { ownerUserId: userId }],
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
          chatUserId: userId,
          ownerUserId: listing.userId,
        },
        include: {
          listing: true,
          ownerUser: true,
          chatUser: true,
          messages: true,
        },
      });
    }
    if (existingChat) {
      res.json({ chat: existingChat });
      if (existingChat.isLastMessageRead === false) {
        const lastMessage =
          existingChat.messages[existingChat.messages.length - 1];
        const isLastMessageSentByMe = lastMessage.sender_id === userId;

        if (!isLastMessageSentByMe) {
          await prisma.chat.update({
            where: { id: existingChat.id },
            data: { isLastMessageRead: true },
          });
        }
      }
      return null;
    }
    const newChat = await prisma.chat.create({
      data: {
        listingId,
        chatUserId: userId,
        ownerUserId: listing.userId,
      },
    });

    const chatWithData = await prisma.chat.findUnique({
      where: { id: newChat.id },
      include: {
        listing: true,
        ownerUser: true,
        chatUser: true,
      },
    });
    res.json({ chat: chatWithData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
