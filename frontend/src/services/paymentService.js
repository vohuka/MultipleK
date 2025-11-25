// services/answerService.js
import api from "./api";

const paymentService = {
  createPayment: (paymentData) => {
    return api.post("/payment/create", paymentData);
  },
  verifyPayment: (verificationData) => {
    return api.post("/payment/verify", verificationData);
  }
};

export default paymentService;
