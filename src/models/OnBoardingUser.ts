import * as mongoose from "mongoose";
import { Document } from "mongoose";

export interface OnBoardingUser {
  telegramId?: string;
  chatId?: string;
  isRegisteredInwWavesDucks: boolean;
}

export type TOnBoardingUserDocument = Document & OnBoardingUser;

const OnBoardingUserSchema = new mongoose.Schema({
  telegramId: { type: String, required: false },
  chatId: { type: String, required: false },
  registeredInwWavesDucks: { type: Boolean, required: false, default: false },
  isTutorialFinished: { type: Boolean, required: false, default: false },
});

OnBoardingUserSchema.set("toJSON", {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const OnBoardingUser = mongoose.model<TOnBoardingUserDocument>(
  "OnBoardingUser",
  OnBoardingUserSchema
);
