import { Message } from "../data/conversation";
import { conversation01 } from "../data/conversation";

export type VideoConfig = {
  title: string;
  date: string;
  screenshot: string;
  conversation: Message[];
};

export const video20260312Config: VideoConfig = {
  title: "聊聊英伟达的新模型",
  date: "2026年3月12日",
  screenshot: "screenshots/2026031201.jpg",
  conversation: conversation01,
};
