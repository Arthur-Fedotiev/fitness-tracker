import { questions, ROLES } from "./constants";

export type Role = typeof ROLES[keyof typeof ROLES];
export type Questions = typeof questions;
export type Answers = string[];
