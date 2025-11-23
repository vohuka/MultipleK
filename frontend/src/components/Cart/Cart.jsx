import { useContext } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Form,
  Image,
  InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../services/api";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart } =
    useContext(CartContext);
  const handleCheckout = async () => {
    // Kiểm tra giỏ hàng có sản phẩm không
    if (cartItems.length === 0) {
      toast.warning("Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi mua hàng.");
      return;
    }
    
    try {
      const accessToken = localStorage.getItem("token");
      console.log(cartItems);

      const response = await fetch(`${BASE_URL}/cart/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(
          Array.isArray(cartItems) ? cartItems : [cartItems]
        ),
      });
      if (response.status === 401) {
        toast.warning(" Vui lòng đăng nhập để mua hàng!");
        navigate("/login");
        return;
      }

      const data = await response.json();
      if (data.success) {
        toast.success("🛒 Mua hàng thành công!");
        clearCart();
      } else {
        toast.error("❌ Mua hàng thất bại!");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("❌ Lỗi khi mua hàng!");
    }
  };
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const shipping = 50000;
  const total = subtotal + shipping;

  return (
    <Container className="my-4">
      <Row>
        {/* Left: Cart List */}
        <Col md={8}>
          <h4>Shopping Cart</h4>
          <p>{totalItems} items</p>
          {cartItems.length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between align-items-center border-bottom py-3"
              >
                <div className="d-flex align-items-center">
                  <Image
                    src={item.images[0].base64}
                    width={60}
                    height={60}
                    rounded
                    className="me-3"
                  />
                  <div>
                    <strong>{item.name}</strong>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    -
                  </Button>
                  <span className="mx-2">{item.quantity}</span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    +
                  </Button>
                </div>
                <div>{(item.price * item.quantity).toLocaleString("vi-VN")} đ</div>
                <Button
                  variant="danger"
                  onClick={() => removeFromCart(item.id)}
                >
                  &times;
                </Button>
              </div>
            ))
          )}
        </Col>

        {/* Right: Summary */}
        <Col md={4}>
          <div className="p-4 border rounded">
            <h5>Summary</h5>
            <hr />
            <div className="d-flex justify-content-between">
              <span>Items:</span>
              <strong>{subtotal.toLocaleString("vi-VN")}₫</strong>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <span>Shipping:</span>
              <strong>{shipping.toLocaleString("vi-VN")}₫</strong>
            </div>
            <Form.Group className="mt-3">
              <Form.Label>Give Code</Form.Label>
              <Form.Control type="text" placeholder="Enter your code" />
            </Form.Group>
            <hr />
            <div className="d-flex justify-content-between">
              <span>Total Price:</span>
              <strong>{total.toLocaleString("vi-VN")}₫</strong>
            </div>
            <Button
              variant="dark"
              className="w-100 mt-3"
              onClick={handleCheckout}
            >
              Buy
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
