import {Request, Response, NextFunction} from 'express';
import DBMessageResponse from '../../interfaces/DBMessageResponse';
import catModel from '../models/userModel';
import {validationResult} from 'express-validator';
import CustomError from '../../classes/CustomError';
import rectangleBounds from '../../utils/rectangleBounds';
import {Cat} from '../../interfaces/Cat';
import {User} from '../../interfaces/User';

// TODO: create following functions:
// - catGetByUser - get all cats by current user id
const catGetByUser = async (
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
    const cat = await catModel.find().populate('owner').findById(req.params.id);
    if (!cat) {
      next(new CustomError('No cat found', 404));
      return;
    }
    res.json(cat);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// - catGetByBoundingBox - get all cats by bounding box coordinates (getJSON)
const catGetByBoundingBox = async (
  req: Request<{}, {}, {}, {topRight: string; bottomLeft: string}>,
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

    const {topRight, bottomLeft} = req.query;
    const [trLat, trLng] = topRight.split(',');
    const [blLat, blLng] = bottomLeft.split(',');
    const bounds = rectangleBounds(
      {lat: parseInt(trLat), lng: parseInt(trLng)},
      {lat: parseInt(blLat), lng: parseInt(blLng)}
    );

    const cat = await catModel.find({
      location: {
        $geoWithin: {
          $geometry: bounds,
        },
      },
    });
    if (!cat) {
      next(new CustomError('No cat found', 404));
      return;
    }
    res.json(cat);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// - catPutAdmin - only admin can change cat owner
const catPutAdmin = async (
  req: Request<{id: string}, {}, {user: string}>,
  res: Response,
  next: NextFunction
) => {};

// - catDeleteAdmin - only admin can delete cat
const catDeleteAdmin = async (
  req: Request<{id: string}>,
  res: Response,
  next: NextFunction
) => {};

// - catDelete - only owner can delete cat
const catDelete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }

    const cat = await catModel
      .findByIdAndDelete(req.params.id)
      .populate('owner');
    if (!cat) {
      next(new CustomError('No cat found', 404));
      return;
    }
    const output: DBMessageResponse = {
      message: 'Cat deleted',
      data: cat,
    };
    res.json(output);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// - catPut - only owner can update cat
const catPut = async (
  req: Request<{id: string}, {}, Cat>,
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
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// - catGet - get cat by id
const catGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      throw new CustomError(messages, 400);
    }
    const cat = await catModel.findById(req.params.id).populate('owner');
    if (!cat) {
      next(new CustomError('No cat found', 404));
      return;
    }
    res.json(cat);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// - catListGet - get all cats
const catListGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cat = await catModel.find().populate('owner');
    if (!cat) {
      next(new CustomError('No cat found', 404));
      return;
    }
    res.json(cat);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// - catPost - create new cat
const catPost = async (
  req: Request<{}, {}, Cat>,
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

    console.log('req.body: ', req.body);
    console.log('req.body.owner: ', (req.user as User)._id);

    if (!req.file) {
      const err = new CustomError('file not valid', 400);
      throw err;
    }

    const cat2 = req.body;
    cat2.owner = (req.user as User)._id;
    cat2.filename = req.file.filename;
    cat2.location = res.locals.coords[0];

    const cat = await catModel.create(cat2);
    await cat.populate({path: 'user'});
    const output: DBMessageResponse = {
      message: 'Cat created',
      data: cat,
    };
    res.json(output);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {
  catGetByUser,
  catGetByBoundingBox,
  catDelete,
  catGet,
  catListGet,
  catPost,
  catPut,
  catPutAdmin,
  catDeleteAdmin,
};
