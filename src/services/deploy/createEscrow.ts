import http from "@/core/axios/http";

export const fetchCreateEscrow = async () => {
  try {
    const response = await http.post("/create-escrow", {
      name: "create-escrow",
      job: "Engineer",
    });
    console.log("Response from endpoint:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error while fetching:", error);
    return { success: false, message: "Failed to fetch data from endpoint" };
  }
};
