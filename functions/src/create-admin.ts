import * as functions from "firebase-functions";
// import { auth } from "./init";

// import { firestore } from 'firebase-admin/lib/firestore';
// import FieldValue = firestore.FieldValue;


export default async (snap: any, context: any) => {

  functions.logger.debug(
    `Running add course trigger for courseId ${context.params.courseId}`);
}
