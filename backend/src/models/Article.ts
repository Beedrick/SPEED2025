
import { Schema, model, Document } from 'mongoose';

interface IArticle extends Document {
  title: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  submitter: Schema.Types.ObjectId;
  reviewer?: Schema.Types.ObjectId;
  rejectionReason?: string;
  reviewedAt?: Date;
}

const ArticleSchema = new Schema<IArticle>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submitter: { 
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: String,
  reviewedAt: Date
}, { timestamps: true });

export default model<IArticle>('Article', ArticleSchema);