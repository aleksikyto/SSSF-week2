import {Document} from 'mongoose';

// TODO: user interface
interface User extends Document {
  user_name: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
}

interface UserOutput {
  _id?: string;
  user_name: string;
  email: string;
}

interface UserTest {
  _id?: string;
  user_name?: string;
  email?: string;
  role?: string;
  password?: string;
}

interface LoginUser {
  user_name: string;
  email: string;
  role: string;
  password: string;
}

export {User, UserOutput, UserTest, LoginUser};
