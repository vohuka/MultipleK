import { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { BASE_URL } from "../../services/api";
import paymentService from "../../services/paymentService";

const PaymentModal = ({ show, onHide, cartItems }) => {
	const [isProcessing, setIsProcessing] = useState(false);

	const subtotal = cartItems.reduce(
		(sum, item) => sum + item.quantity * item.price,
		0,
	);
	const shipping = 50000;
	const total = subtotal + shipping;

	const transaction_id = `TXN_${Date.now()}_${Math.random()
		.toString(36)
		.substr(2, 9)}`;

	const paymentData = {
		transaction_id: transaction_id,
		amount: total,
	};

	const handlePayment = async () => {
		setIsProcessing(true);
		try {
			const response = await paymentService.createPayment(paymentData);

			const data = await response.data;
			window.location.href = data.data;
		} catch (error) {
			console.error("Payment error:", error);
			toast.error("❌ Lỗi trong quá trình thanh toán!");
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<Modal show={show} onHide={onHide} centered size='md'>
			<Modal.Header closeButton>
				<Modal.Title>Xác nhận thanh toán</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className='mb-3'>
					<h6>Thông tin giao dịch:</h6>
					<p>
						<strong>Mã giao dịch:</strong> {transaction_id}
					</p>
					<p>
						<strong>Tổng tiền hàng:</strong>{" "}
						{subtotal.toLocaleString("vi-VN")}₫
					</p>
					<p>
						<strong>Phí vận chuyển:</strong>{" "}
						{shipping.toLocaleString("vi-VN")}₫
					</p>
					<hr />
					<p>
						<strong>Tổng thanh toán:</strong>{" "}
						<span className='text-danger fs-5'>
							{total.toLocaleString("vi-VN")}₫
						</span>
					</p>
				</div>

				<div className='mb-3'>
					<h6>Danh sách sản phẩm:</h6>
					{cartItems.map((item) => (
						<div
							key={item.id}
							className='d-flex justify-content-between py-1'
						>
							<span>
								{item.name} x {item.quantity}
							</span>
							<span>
								{(item.price * item.quantity).toLocaleString(
									"vi-VN",
								)}
								₫
							</span>
						</div>
					))}
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant='secondary'
					onClick={onHide}
					disabled={isProcessing}
				>
					Hủy
				</Button>
				<Button
					variant='primary'
					onClick={handlePayment}
					disabled={isProcessing}
				>
					{isProcessing ? (
						<>
							<Spinner
								animation='border'
								size='sm'
								className='me-2'
							/>
							Đang xử lý...
						</>
					) : (
						"Thanh toán"
					)}
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default PaymentModal;
