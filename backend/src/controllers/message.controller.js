import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
        console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

        const userExists = await User.findById(userToChatId);
        if (!userExists) {
            return res.status(404).json({ error: "User not found" });
        }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    // Форматируем сообщения для фронтенда
    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      content: msg.text,
      imageUrl: msg.image,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      createdAt: msg.createdAt
    }));

    res.status(200).json(formattedMessages);
  } catch (error) {
        console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { content } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let imageUrl;

    // Проверяем, есть ли файл изображения
    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload(req.file.path);
      imageUrl = uploadResponse.secure_url;
    }

    if (!content && !imageUrl) {
      return res.status(400).json({ error: "Message content or image is required" });
    }

    const receiverExists = await User.findById(receiverId);
    if (!receiverExists) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: content,
      image: imageUrl,
    });

    await newMessage.save();

    res.status(201).json({
      _id: newMessage._id,
      content: newMessage.text,
      imageUrl: newMessage.image,
      senderId: newMessage.senderId,
      receiverId: newMessage.receiverId,
      createdAt: newMessage.createdAt
    });
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};