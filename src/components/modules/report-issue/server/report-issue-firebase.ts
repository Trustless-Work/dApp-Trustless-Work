"use server";

import { db } from "@/core/config/firebase/firebase";
import {
  addDoc,
  collection,
  DocumentReference,
  serverTimestamp,
} from "firebase/firestore";
import { formSchema } from "../schema/report-issue-schema";
import { z } from "zod";

interface addReportIssueProps {
  payload: z.infer<typeof formSchema>;
  address: string;
}

const addReportIssue = async ({
  payload,
  address,
}: addReportIssueProps): Promise<{ success: boolean; message: string }> => {
  const collectionRef = collection(db, "api issues");

  try {
    await addDoc(collectionRef, {
      ...payload,
      user: address,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: `Issue reported successfully`,
    };
  } catch (error: any) {
    const errorMessage =
      error.response && error.response.data
        ? error.response.data.message
        : "An error occurred";

    return { success: false, message: errorMessage };
  }
};

export { addReportIssue };
