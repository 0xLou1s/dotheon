import mongoose, { Schema, Document } from 'mongoose';

interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolName?: string;
}

export interface IChatMessage extends Document {
  walletAddress: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  toolName: {
    type: String,
    required: false,
    sparse: true
  }
}, { _id: true });

const ChatMessageSchema = new Schema<IChatMessage>({
  walletAddress: {
    type: String,
    required: true,
    index: true
  },
  messages: [MessageSchema]
}, {
  timestamps: true,
  strict: true,
  strictQuery: true
});

// Delete existing model if it exists
if (mongoose.models.ChatMessage) {
  delete mongoose.models.ChatMessage;
}

// Create new model
export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema); 