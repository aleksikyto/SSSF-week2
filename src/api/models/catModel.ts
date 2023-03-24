import mongoose from 'mongoose';
import {Cat} from '../../interfaces/Cat';

const catSchema = new mongoose.Schema({
  cat_name: {type: String, minlength: 2, required: true},
  weight: {type: Number, required: true},
  filename: {type: String, required: true},
  birthdate: {type: Date, required: true},
  coords: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
});

export default mongoose.model<Cat>('Cat', catSchema);
