import * as mongoose from "mongoose";
import { Document } from "mongoose";

export interface ITelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}
export enum STAGE {
  START,
}

export interface IUserParams {
  stage: STAGE;
}

export type TUserDocument = Document & ITelegramUser & IUserParams;

const userSchema = new mongoose.Schema({
  stage: { type: String, required: true },
  id: { type: Number, required: true },
  is_bot: { type: Boolean, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: false },
  username: { type: String, required: false },
  language_code: { type: String, required: false },
});

export const User = mongoose.model<TUserDocument>("User", userSchema);
