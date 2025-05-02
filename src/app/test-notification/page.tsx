"use client";

import { NotificationService } from "@/services/notificationService";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TestNotificationPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const createTestNotification = async () => {
    setLoading(true);
    setSuccess(false);
    const walletAddress =
      "GC26M5T4D34Z5BNETO5MIC4J2RFVQBIOHECGH2IFKVEIUQ76TSNM5SVJ";

    const notificationData = {
      contractId: "test-contract",
      type: "info",
      title: "Welcome to Trustless Work",
      message: "The escrow is ready to be released",
      entities: {
        receiver: walletAddress,
      },
      url: "/dashboard",
    };

    try {
      const id = await NotificationService.createNotification(notificationData);
      await NotificationService.assignNotificationToUser(id, walletAddress);
      console.log("Notification created with ID:", id);
      setSuccess(true);
    } catch (err) {
      console.error("Error in create notification:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">Notification Test</h1>
      <Button onClick={createTestNotification} disabled={loading}>
        {loading ? "Creating..." : "Create notification test"}
      </Button>
      {success && (
        <p className="mt-4 text-green-600">
          Notification test created correctly.
        </p>
      )}
    </div>
  );
}
