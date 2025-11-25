<?php

class PaymentController
{
    private $payment;

    public function __construct()
    {
        $this->payment = new Payment();
        error_log("PaymentController loaded");
    }

    public function create(){
        AuthMiddleware::verifyToken();
        if(!isset($_SERVER['HTTP_USER_ID'])) {
            http_response_code(401);
            echo json_encode(['message' => 'Unauthorized']);
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        $amount = $data['amount'] ?? 0;
        $transaction_id = $data['transaction_id'];

        $result = $this->payment->create($amount, $transaction_id);

        http_response_code(200);
        echo json_encode($result);
    }

    public function verify() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'No data received']);
            return;
        }

        // VNPay verification
        $vnp_HashSecret = "4IDG7HFO5O33J74CQSNMDBY5JVR8L0WK";
        $vnp_SecureHash = $data['vnp_SecureHash'] ?? '';

        // Remove secure hash from data for verification
        unset($data['vnp_SecureHash']);

        // Sort and build hash data
        ksort($data);
        $hashdata = "";
        $i = 0;

        foreach ($data as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        $secureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);

        if ($secureHash == $vnp_SecureHash) {
            if ($data['vnp_ResponseCode'] == '00') {
                // Payment successful
                $amount = $data['vnp_Amount'] / 100; // Convert back from VND cents
                $transaction_id = $data['vnp_TxnRef'];

                echo json_encode([
                    'success' => true,
                    'message' => 'Payment verified successfully',
                    'amount' => $amount,
                    'transaction_id' => $transaction_id
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Payment failed',
                    'code' => $data['vnp_ResponseCode']
                ]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid signature']);
        }
    }
}
?>