import * as functions from "firebase-functions";
import { createUserApp } from "./create-user-app";

export const createUser = functions.https.onRequest(createUserApp);
