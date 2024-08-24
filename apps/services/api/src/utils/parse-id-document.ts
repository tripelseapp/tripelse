import { Document } from 'mongoose';

const parseIdsFromDocument = (document: Document<unknown>) => {
  const obj = document.toObject();

  // Put the id field in the first position of the object

  const id = obj._id.toString();

  const newObj = {
    id,
    ...obj,
  };

  delete newObj._id;
  delete newObj.__v;

  return newObj;
};

export default parseIdsFromDocument;
