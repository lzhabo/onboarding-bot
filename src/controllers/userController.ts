import { OnBoardingUser } from "../models/OnBoardingUser";

export const createUser = async (chatId: string) => {
  const user = await OnBoardingUser.findOne((user) => user.chatId === chatId);
  if (user == null) {
    const createdUser = await OnBoardingUser.create({ chatId });
  }
  console.log(user);
};
