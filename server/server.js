const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fulafia', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['student', 'counselor'], required: true },
  age: Number,
  gender: String,
  department: String,
  specialty: String,
  bio: String,
  availability: String,
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now }
}, { timestamps: true });

// Message Schema
const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);

// Store active socket connections
const activeUsers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins with their ID
  socket.on('join', async (userId) => {
    activeUsers.set(userId, socket.id);
    socket.userId = userId;
    
    // Update user online status
    await User.findByIdAndUpdate(userId, { 
      isOnline: true, 
      lastSeen: new Date() 
    });
    
    // Notify others about online status
    socket.broadcast.emit('userOnline', userId);
  });

  // Handle sending messages
  socket.on('sendMessage', async (messageData) => {
    try {
      const { from, to, content } = messageData;
      
      // Save message to database
      const message = new Message({
        from,
        to,
        content,
        timestamp: new Date()
      });
      
      await message.save();
      
      // Populate sender info
      await message.populate('from', 'name email userType');
      
      // Send to recipient if online
      const recipientSocketId = activeUsers.get(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('newMessage', {
          id: message._id,
          from: message.from,
          to,
          content,
          timestamp: message.timestamp
        });
      }
      
      // Confirm to sender
      socket.emit('messageDelivered', {
        id: message._id,
        timestamp: message.timestamp
      });
      
    } catch (error) {
      socket.emit('messageError', error.message);
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    const recipientSocketId = activeUsers.get(data.to);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('userTyping', {
        from: data.from,
        isTyping: data.isTyping
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    if (socket.userId) {
      activeUsers.delete(socket.userId);
      
      // Update user offline status
      await User.findByIdAndUpdate(socket.userId, { 
        isOnline: false, 
        lastSeen: new Date() 
      });
      
      // Notify others about offline status
      socket.broadcast.emit('userOffline', socket.userId);
    }
    console.log('User disconnected:', socket.id);
  });
});

// REST API Routes

// Get all users (filtered by role)
app.get('/api/users/:userType', async (req, res) => {
  try {
    const { userType } = req.params;
    const targetType = userType === 'student' ? 'counselor' : 'student';
    
    const users = await User.find({ userType: targetType })
      .select('-password')
      .sort({ isOnline: -1, lastSeen: -1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get conversation history
app.get('/api/messages/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    
    const messages = await Message.find({
      $or: [
        { from: userId1, to: userId2 },
        { from: userId2, to: userId1 }
      ]
    })
    .populate('from', 'name email userType')
    .sort({ timestamp: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark messages as read
app.put('/api/messages/read/:userId/:fromUserId', async (req, res) => {
  try {
    const { userId, fromUserId } = req.params;
    
    await Message.updateMany(
      { from: fromUserId, to: userId, read: false },
      { read: true }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});