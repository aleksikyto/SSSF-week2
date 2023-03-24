import mongoose from 'mongoose';
import {User} from '../../interfaces/User';

const userSchema = new mongoose.Schema({
  user_name: {type: String, minlength: 2, required: true},
  email: {type: String, minlength: 2, required: true},
  role: {type: String, minlength: 1, required: true},
  password: {type: String, minlength: 1, required: true},
});

export default mongoose.model<User>('User', userSchema);
