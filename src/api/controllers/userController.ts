// TODO: create the following functions:
// - checkToken - check if current user token is valid: return data from req.user. No need for database query

import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';
import CustomError from '../../classes/CustomError';
import DBMessageResponse from '../../interfaces/DBMessageResponse';
import userModel from '../models/userModel';
import bcrypt from 'bcryptjs';
import {User} from '../../interfaces/User';

// - userGet - get user by id
const userGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const user = await userModel.findById(req.params.id);
    if (!user) {
      next(new CustomError('No user found', 404));
      return;
    }
    res.json(user);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// - userListGet - get all users
const userListGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.find();
    if (!users) {
      next(new CustomError('No users found', 404));
      return;
    }
    res.json(users);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// - userPost - create new user. Remember to hash password
const userPost = async (
  req: Request<{}, {}, User>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }

    const user = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);

    const result = await userModel.create({
      ...user,
      password: hashPassword,
    });

    const output: DBMessageResponse = {
      message: 'Category created',
      data: result,
    };
    res.json(output);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// - userPutCurrent - update current user
const userPutCurrent = async (
  req: Request<{id: string}, {}, User>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }

    const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      next(new CustomError('No user found', 404));
      return;
    }
    const output: DBMessageResponse = {
      message: 'User updated',
      data: user,
    };
    res.json(output);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// - userDeleteCurrent - delete current user
const userDeleteCurrent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }

    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      next(new CustomError('No user found', 404));
      return;
    }
    const output: DBMessageResponse = {
      message: 'User deleted',
      data: user,
    };
    res.json(output);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {userGet, userListGet, userPost, userPutCurrent, userDeleteCurrent};
