import {Document, Types} from 'mongoose';
import {Point} from 'geojson';

// TODO: create a cat interface
interface Cat extends Document {
  cat_name: string;
  weight: number;
  filename: string;
  birthdate: Date;
  coords: Point;
  owner: Types.ObjectId;
}

interface CatTest {
  cat_name?: string;
  weight?: number;
  filename?: string;
  birthdate?: Date;
  coords?: Point;
  owner?: Types.ObjectId;
}

export {Cat, CatTest};
