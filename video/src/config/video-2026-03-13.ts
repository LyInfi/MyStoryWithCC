import { Message } from "../data/conversation";
import { conversation03 } from "../data/conversation";

export type VideoConfig = {
  title: string;
  date: string;
  screenshot: string;
  conversation: Message[];
};

export const video20260313Config: VideoConfig = {
  title: "如何活得洒脱一些？",
  date: "2026年3月13日",
  screenshot: "screenshots/2026031301.jpg",
  conversation: conversation03,
};
