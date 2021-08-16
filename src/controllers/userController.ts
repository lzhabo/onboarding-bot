import { User } from "../models/User";

export const createUser = async (chatId: string) => {
  const user = await User.findOne((user) => user.chatId === chatId);
  if (user == null) {
    const createdUser = await User.create({ chatId });
  }
  console.log(user);
};

export const getUserById = (id: number) =>
  User.findOne((user) => (user ? user.id === id : false));
