/* eslint-disable @typescript-eslint/no-explicit-any */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

interface roles {
  escrowId: string;
  role: string;
}

exports.getUserRole = functions.https.onCall(async (wallet: string) => {
  if (!wallet) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      'El campo "wallet" es requerido.',
    );
  }

  try {
    const escrowsSnapshot = await admin.firestore().collection("escrows").get();

    const roles: roles[] = [];

    escrowsSnapshot.forEach((doc: any) => {
      const escrow = doc.data();

      if (escrow.client === wallet) {
        roles.push({ escrowId: doc.id, role: "client" });
      }
      if (escrow.serviceProvider === wallet) {
        roles.push({ escrowId: doc.id, role: "serviceProvider" });
      }
      if (escrow.platform === wallet) {
        roles.push({ escrowId: doc.id, role: "platform" });
      }
    });

    if (roles.length === 0) {
      return { message: "No se encontraron roles para esta wallet." };
    }

    return roles;
  } catch (error) {
    console.error("Error al obtener roles:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Ocurrió un error al obtener los roles.",
    );
  }
});
