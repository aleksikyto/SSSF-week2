import {Document, Types} from 'mongoose';
import {Point} from 'geojson';

// TODO: create a cat interface
interface Cat extends Document {
  cat_name: string;
  weight: number;
  filename: string;
  birthdate: Date;
  location: Point;
  owner: Types.ObjectId;
}

interface CatTest {
  _id?: string;
  cat_name?: string;
  weight?: number;
  filename?: string;
  birthdate?: Date;
  location?: Point;
  owner?: Types.ObjectId;
}

export {Cat, CatTest};
