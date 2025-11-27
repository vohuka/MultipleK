import { useContext, useState, useEffect, useRef } from "react";
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
import { useNavigate, useSearchParams } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../../services/api";
import PaymentModal from "../modal/PaymentModal";
import paymentService from "../../services/paymentService";

export default function Cart() {
	const navigate = useNavigate();
	const { cartItems, updateQuantity, removeFromCart, clearCart } =
		useContext(CartContext);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [searchParams] = useSearchParams();
    const hasProcessedPayment = useRef(false);

    //tra ve sau khi thanh toan
	useEffect(() => {
		const verifyPayment = async () => {
            //chặn xử lý nhiều lần
            if (hasProcessedPayment.current) return;

			// Lấy tất cả parameters từ URL
			const paymentData = {};
			for (const [key, value] of searchParams.entries()) {
				if (key.startsWith("vnp_")) {
					paymentData[key] = value;
				}
			}

			try {
                hasProcessedPayment.current = true;

				const response = await paymentService.verifyPayment(
					paymentData,
				);
				const result = await response.data;
				if (result.success) {
					// Nếu thanh toán thành công thêm đơn hàng
					const accessToken = localStorage.getItem("token");
					const responseOrder = await fetch(`${BASE_URL}/cart/buy`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${accessToken}`,
						},
						body: JSON.stringify({
							items: Array.isArray(cartItems)
								? cartItems
								: [cartItems],
							transaction_id: result.transaction_id,
						}),
					});

					const dataOrder = await responseOrder.json();
					if (dataOrder.success) {
						clearCart();
                        toast.success("Đơn hàng được thanh toán thành công!");
					}
				} else {
                    toast.error("Đơn hàng thanh toán thất bại!");
                }

			} catch (error) {
				console.error("Verification error:", error);
				toast.error("Đơn hàng thanh toán thất bại!");
			}
		};

		if (searchParams.size > 0 && !hasProcessedPayment.current) {
			verifyPayment();
		}
	}, [searchParams, clearCart]);

	const handleCheckout = async () => {
		// Kiểm tra giỏ hàng có sản phẩm không
		if (cartItems.length === 0) {
			toast.warning(
				"Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi mua hàng.",
			);
			return;
		}

		const accessToken = localStorage.getItem("token");
		if (!accessToken) {
			toast.warning(" Vui lòng đăng nhập để mua hàng!");
			navigate("/login");
			return;
		}

		setShowPaymentModal(true);
	};

	const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
	const subtotal = cartItems.reduce(
		(sum, item) => sum + item.quantity * item.price,
		0,
	);
	const shipping = 50000;
	const total = subtotal + shipping;

	return (
		<>
			<Container className='my-4'>
				<Row>
					{/* Left: Cart List */}
					<Col md={8}>
						<h4>Giỏ hàng</h4>
						<p>{totalItems} items</p>
						{cartItems.length === 0 ? (
							<p>Giỏ hàng rỗng</p>
						) : (
							cartItems.map((item) => (
								<div
									key={item.id}
									className='d-flex justify-content-between align-items-center border-bottom py-3'
								>
									<div className='d-flex align-items-center'>
										<Image
											src={item.images[0].base64}
											width={60}
											height={60}
											rounded
											className='me-3'
										/>
										<div>
											<strong>{item.name}</strong>
										</div>
									</div>
									<div className='d-flex align-items-center'>
										<Button
											variant='outline-secondary'
											size='sm'
											onClick={() =>
												updateQuantity(item.id, -1)
											}
										>
											-
										</Button>
										<span className='mx-2'>
											{item.quantity}
										</span>
										<Button
											variant='outline-secondary'
											size='sm'
											onClick={() =>
												updateQuantity(item.id, 1)
											}
										>
											+
										</Button>
									</div>
									<div>
										{(
											item.price * item.quantity
										).toLocaleString("vi-VN")}{" "}
										đ
									</div>
									<Button
										variant='danger'
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
						<div className='p-4 border rounded'>
							<h5>Tóm tắt</h5>
							<hr />
							<div className='d-flex justify-content-between'>
								<span>Mặt hàng:</span>
								<strong>
									{subtotal.toLocaleString("vi-VN")}₫
								</strong>
							</div>
							<div className='d-flex justify-content-between mt-2'>
								<span>Vận chuyển:</span>
								<strong>
									{shipping.toLocaleString("vi-VN")}₫
								</strong>
							</div>
							<Form.Group className='mt-3'>
								<Form.Label>Give Code</Form.Label>
								<Form.Control
									type='text'
									placeholder='Enter your code'
								/>
							</Form.Group>
							<hr />
							<div className='d-flex justify-content-between'>
								<span>Tổng tiền:</span>
								<strong>
									{total.toLocaleString("vi-VN")}₫
								</strong>
							</div>
							<Button
								variant='dark'
								className='w-100 mt-3'
								onClick={handleCheckout}
							>
								Mua
							</Button>
						</div>
					</Col>
				</Row>
			</Container>

			{/* Payment Modal */}
			<PaymentModal
				show={showPaymentModal}
				onHide={() => setShowPaymentModal(false)}
				cartItems={cartItems}
			/>
		</>
	);
}
