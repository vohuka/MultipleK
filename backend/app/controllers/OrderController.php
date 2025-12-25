<?php
session_start();
class OrderController
{
    private $orderModel;
    private $orderItemModel;
    private $billModel;

    public function __construct()
    {
        $db = (new Database())->connect();
        $this->orderModel = new Order($db);
        $this->orderItemModel = new OrderItem($db);
        $this->billModel = new Bill($db);
    }

    public function buy()
    {
        // Ensure JSON response
        header('Content-Type: application/json');

        if (!AuthMiddleware::verifyToken()) {
            return;
        }
        
        $input = file_get_contents("php://input");
        $data = json_decode($input, true);

        if (!$data) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
            return;
        }

        //xu ly tạo hóa đơn
        if (!isset($data['bill'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Missing bill data']);
            return;
        }

        $billData = json_decode($data['bill'], true);
        
        if (!$billData) {
            // Fallback if bill is already an object (not stringified) or invalid
            if (is_array($data['bill'])) {
                $billData = $data['bill'];
            } else {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid bill data format']);
                return;
            }
        }

        $bill_id = $this->billModel->create($billData);
        if (!$bill_id) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to create bill']);
            return;
        }

        // xư lý tạo đơn hàng
        $user_id = $_SERVER['HTTP_USER_ID'];
        $transaction_id = $data['transaction_id'] ?? null;
        $status = $data['status'] ?? 'pending';

        $order_id = $this->orderModel->createOrder($user_id, $status, $transaction_id, $bill_id);
        if (!$order_id) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to create order']);
            return;
        }

        foreach ($data["items"] as $item) {
            $this->orderItemModel->createOrderItem($order_id, $item['id'], $item['quantity'], $item['price']);
        }
        http_response_code(200);
        echo json_encode(['success' => true, 'order_id' => $order_id]);
    }
    // View user's order history
    public function getOrderByUser()
    {
        AuthMiddleware::verifyToken();
        if (!isset($_SERVER['HTTP_USER_ID'])) {
            http_response_code(401);
            echo json_encode(['message' => 'Unauthorized']);
            return;
        }
        $user_id = $_SERVER['HTTP_USER_ID'];
        $orders = $this->orderModel->getOrderByUser($user_id);
        if (!$orders) {
            http_response_code(404);
            echo json_encode(['message' => 'No orders found']);
            return;
        }

        echo json_encode(['success' => true, 'orders' => $orders]);
    }

    public function index()
    {
        $result = $this->orderModel->getAllOrder();
        $numRow = $result->rowCount();

        if ($numRow > 0) {
            $rows = [];
            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                $rows[] = $row;
            }

            http_response_code(200);
            echo json_encode(["status" => "success", "data" => $rows]);
        } else {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Not found content'
            ]);
        }
    }

    public function getOrderById()
    {
        $id = $_GET['id'] ?? null;
        $id = intval($id);

        $result = $this->orderModel->getOrderById($id);
        $numRow = $result->rowCount();

        if ($numRow > 0) {
            $data = $result->fetch(PDO::FETCH_ASSOC);
            http_response_code(200);
            echo json_encode(["status" => "success", "data" => $data]);
        } else {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Not found content'
            ]);
        }
    }

    public function update()
    {
        $data = json_decode(file_get_contents('php://input'));

        if ($this->orderModel->updateStatus($data->id, $data->status)) {
            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Update successfully"
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Update failed"
            ]);
        }
    }

    public function getOrderItemOfOrderId()
    {
        $id = $_GET['id'] ?? null;
        $id = intval($id);

        $result = $this->orderItemModel->getOrderItemsByOrderId($id);
        $numRow = $result->rowCount();

        if ($numRow > 0) {
            $rows = [];
            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                $rows[] = $row;
            }

            http_response_code(200);
            echo json_encode(["status" => "success", "data" => $rows]);
        } else {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Not found content'
            ]);
        }
    }

    // Get order items for user (with security check)
    public function getUserOrderDetail() {
        AuthMiddleware::verifyToken();
        if(!isset($_SERVER['HTTP_USER_ID'])) {
            http_response_code(401);
            echo json_encode(['message' => 'Unauthorized']);
            return;
        }

        $id = $_GET['id'] ?? null;
        $user_id = $_SERVER['HTTP_USER_ID'];

        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Order ID is required']);
            return;
        }

        // Get complete order detail with items and billing info
        $orderDetail = $this->orderModel->getUserOrderDetail($user_id, intval($id));

        if (!$orderDetail) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Order not found or access denied']);
            return;
        }

        echo json_encode(['success' => true, 'data' => $orderDetail]);
    }
}
