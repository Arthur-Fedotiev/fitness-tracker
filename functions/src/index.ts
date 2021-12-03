import * as functions from "firebase-functions";

export const onAddAdminUser =
  functions
    .runWith({
      timeoutSeconds: 300,
      memory: "128MB"
    })
    .firestore.document("users/{userId}")
    .onCreate(async (snap, context) => {
      await (
        await import("./create-admin"))
        .default(snap, context);
    });
