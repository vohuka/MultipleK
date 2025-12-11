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
	Card,
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

	// State để quản lý bước hiện tại
	const [currentStep, setCurrentStep] = useState("cart"); // "cart" | "billing" | "payment"
	const [errors, setErrors] = useState({});
	const [billingInfo, setBillingInfo] = useState({
		full_name: "",
		email: "",
		phone: "",
		address: "",
		note: "",
	});
	const [paymentMethod, setPaymentMethod] = useState("cod");

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
					// Lấy billing info từ sessionStorage
					const billingData =
						sessionStorage.getItem("pending_billing");

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
							bill: billingData,
							status: "ordered",
						}),
					});

					const dataOrder = await responseOrder.json();
					if (dataOrder.success) {
						clearCart();
						setCurrentStep("cart"); // Reset về bước đầu
						sessionStorage.removeItem("pending_billing");

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

		// Chuyển sang bước điền thông tin thanh toán
		setCurrentStep("billing");
	};

	// Validation function
	const validateBillingInfo = () => {
		const newErrors = {};

		if (!billingInfo.full_name.trim()) {
			newErrors.full_name = "Họ và tên không được để trống";
		}

		if (!billingInfo.email.trim()) {
			newErrors.email = "Email không được để trống";
		} else if (!/\S+@\S+\.\S+/.test(billingInfo.email)) {
			newErrors.email = "Email không hợp lệ";
		}

		if (!billingInfo.phone.trim()) {
			newErrors.phone = "Số điện thoại không được để trống";
		} else if (
			!/^[0-9]{10,11}$/.test(billingInfo.phone.replace(/\s/g, ""))
		) {
			newErrors.phone = "Số điện thoại phải có 10-11 chữ số";
		}

		if (!billingInfo.address.trim()) {
			newErrors.address = "Địa chỉ không được để trống";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Xử lý khi hoàn tất điền thông tin
	const handleBillingComplete = () => {
		// Validate thông tin bắt buộc
		if (!validateBillingInfo()) {
			toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
			return;
		}

		// Chuyển sang bước thanh toán
		if (paymentMethod === "vnpay") {
			// Lưu billing info vào sessionStorage cho VNPAY
			const billingData = {
				...billingInfo,
				payment_method: paymentMethod,
			};

			sessionStorage.setItem("pending_billing", JSON.stringify(billingData));
			setShowPaymentModal(true);
		} else {
			// Xử lý thanh toán COD
			handleCODPayment();
		}
	};

	// Clear errors when user types
	const handleBillingChange = (e) => {
		const { name, value } = e.target;
		setBillingInfo((prev) => ({ ...prev, [name]: value }));

		// Clear error for this field
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	// Xử lý thanh toán COD
	const handleCODPayment = async () => {
		try {
			const billingData = {
				...billingInfo,
				payment_method: paymentMethod,
			};

			const accessToken = localStorage.getItem("token");

			const response = await fetch(`${BASE_URL}/cart/buy`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify({
					items: Array.isArray(cartItems) ? cartItems : [cartItems],
					status: "ordered",
					bill: JSON.stringify(billingData),
                    transaction_id: '',
				}),
			});

			const data = await response.json();
			if (data.success) {
				clearCart();
				setCurrentStep("cart");
				setBillingInfo({
					full_name: "",
					email: "",
					phone: "",
					address: "",
					note: "",
				});
				toast.success(
					"Đơn hàng được tạo thành công! Bạn sẽ thanh toán khi nhận hàng.",
				);
			} else {
				toast.error("Có lỗi xảy ra khi tạo đơn hàng!");
			}
		} catch (error) {
			console.error("COD payment error:", error);
			toast.error("Có lỗi xảy ra khi tạo đơn hàng!");
		}
	};

	const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
	const subtotal = cartItems.reduce(
		(sum, item) => sum + item.quantity * item.price,
		0,
	);
	const shipping = 50000;
	const total = subtotal + shipping;

	// Render theo bước hiện tại
	const renderContent = () => {
		switch (currentStep) {
			case "cart":
				return (
					<CartView
						cartItems={cartItems}
						updateQuantity={updateQuantity}
						removeFromCart={removeFromCart}
						totalItems={totalItems}
						subtotal={subtotal}
						shipping={shipping}
						total={total}
						onCheckout={handleCheckout}
					/>
				);
			case "billing":
				return (
					<BillingView
						billingInfo={billingInfo}
						setBillingInfo={setBillingInfo}
						paymentMethod={paymentMethod}
						setPaymentMethod={setPaymentMethod}
						cartItems={cartItems}
						total={total}
						onComplete={handleBillingComplete}
						onBackToCart={() => setCurrentStep("cart")}
						errors={errors}
						handleChange={handleBillingChange}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<>
			<Container className='my-4'>
				{/* Progress indicator */}
				<ProgressIndicator currentStep={currentStep} />

				{renderContent()}
			</Container>

			{/* Payment Modal */}
			<PaymentModal
				show={showPaymentModal}
				onHide={() => {
					setShowPaymentModal(false);
					setCurrentStep("billing");
				}}
				cartItems={cartItems}
			/>
		</>
	);
}

// Component hiển thị progress
function ProgressIndicator({ currentStep }) {
	const steps = [
		{ key: "cart", label: "Giỏ hàng" },
		{ key: "billing", label: "Thông tin thanh toán" },
	];

	return (
		<div className='mb-4'>
			<Row className='justify-content-center'>
				{steps.map((step, index) => (
					<Col key={step.key} xs='auto' className='text-center'>
						<div
							className={`d-flex align-items-center ${
								index < steps.length - 1 ? "me-3" : ""
							}`}
						>
							<div
								className={`rounded-circle d-flex align-items-center justify-content-center ${
									currentStep === step.key
										? "bg-primary text-white"
										: "bg-light text-muted"
								}`}
								style={{
									width: "40px",
									height: "40px",
									fontSize: "14px",
								}}
							>
								{index + 1}
							</div>
							<span
								className={`ms-2 ${
									currentStep === step.key ? "fw-bold" : ""
								}`}
							>
								{step.label}
							</span>
							{index < steps.length - 1 && (
								<div
									className='border-top ms-3'
									style={{ width: "50px" }}
								></div>
							)}
						</div>
					</Col>
				))}
			</Row>
		</div>
	);
}

// Component hiển thị giỏ hàng
function CartView({
	cartItems,
	updateQuantity,
	removeFromCart,
	totalItems,
	subtotal,
	shipping,
	total,
	onCheckout,
}) {
	return (
		<Row>
			{/* Left: Cart List */}
			<Col md={9}>
				<h4>Giỏ hàng</h4>
				<p>{totalItems} sản phẩm</p>
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
									onClick={() => updateQuantity(item.id, -1)}
								>
									-
								</Button>
								<span className='mx-2'>{item.quantity}</span>
								<Button
									variant='outline-secondary'
									size='sm'
									onClick={() => updateQuantity(item.id, 1)}
								>
									+
								</Button>
							</div>
							<div>
								{(item.price * item.quantity).toLocaleString(
									"vi-VN",
								)}{" "}
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
			<Col md={3}>
				<div className='p-4 border rounded'>
					<h5>Tóm tắt</h5>
					<hr />
					<div className='d-flex justify-content-between'>
						<span>Mặt hàng:</span>
						<strong>{subtotal.toLocaleString("vi-VN")}₫</strong>
					</div>
					<div className='d-flex justify-content-between mt-2'>
						<span>Vận chuyển:</span>
						<strong>{shipping.toLocaleString("vi-VN")}₫</strong>
					</div>
					<hr />
					<div className='d-flex justify-content-between'>
						<span>Tổng tiền:</span>
						<strong>{total.toLocaleString("vi-VN")}₫</strong>
					</div>
					<Button
						variant='dark'
						className='w-100 mt-3'
						onClick={onCheckout}
						disabled={cartItems.length === 0}
					>
						Tiếp tục thanh toán
					</Button>
				</div>
			</Col>
		</Row>
	);
}

// Component điền thông tin thanh toán
function BillingView({
	billingInfo,
	setBillingInfo,
	paymentMethod,
	setPaymentMethod,
	cartItems,
	total,
	onComplete,
	onBackToCart,
	errors = {},
	handleChange,
}) {
	return (
		<Row>
			<Col md={8}>
				<Card className='p-4'>
					<h4 className='mb-4'>Thông tin giao hàng</h4>
					<Form>
						<Row>
							<Col md={6}>
								<Form.Group className='mb-3'>
									<Form.Label>
										Họ và tên{" "}
										<span className='text-danger'>*</span>
									</Form.Label>
									<Form.Control
										type='text'
										name='full_name'
										value={billingInfo.full_name}
										onChange={handleChange}
										isInvalid={!!errors.full_name}
										required
									/>
									<Form.Control.Feedback type='invalid'>
										{errors.full_name}
									</Form.Control.Feedback>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group className='mb-3'>
									<Form.Label>
										Email{" "}
										<span className='text-danger'>*</span>
									</Form.Label>
									<Form.Control
										type='email'
										name='email'
										value={billingInfo.email}
										onChange={handleChange}
										isInvalid={!!errors.email}
										required
									/>
									<Form.Control.Feedback type='invalid'>
										{errors.email}
									</Form.Control.Feedback>
								</Form.Group>
							</Col>
						</Row>

						<Row>
							<Col md={6}>
								<Form.Group className='mb-3'>
									<Form.Label>
										Số điện thoại{" "}
										<span className='text-danger'>*</span>
									</Form.Label>
									<Form.Control
										type='text'
										name='phone'
										value={billingInfo.phone}
										onChange={handleChange}
										isInvalid={!!errors.phone}
										required
									/>
									<Form.Control.Feedback type='invalid'>
										{errors.phone}
									</Form.Control.Feedback>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group className='mb-3'>
									<Form.Label>
										Địa chỉ{" "}
										<span className='text-danger'>*</span>
									</Form.Label>
									<Form.Control
										type='text'
										name='address'
										value={billingInfo.address}
										onChange={handleChange}
										isInvalid={!!errors.address}
										required
									/>
									<Form.Control.Feedback type='invalid'>
										{errors.address}
									</Form.Control.Feedback>
								</Form.Group>
							</Col>
						</Row>

						<Form.Group className='mb-3'>
							<Form.Label>Ghi chú</Form.Label>
							<Form.Control
								as='textarea'
								rows={3}
								name='note'
								value={billingInfo.note}
								onChange={handleChange}
								placeholder='Ghi chú thêm cho đơn hàng...'
							/>
						</Form.Group>

						<Form.Group className='mb-4'>
							<Form.Label>
								Phương thức thanh toán{" "}
								<span className='text-danger'>*</span>
							</Form.Label>
							<div className='mt-2'>
								<Form.Check
									type='radio'
									name='paymentMethod'
									id='cod'
									value='cod'
									checked={paymentMethod === "cod"}
									onChange={(e) =>
										setPaymentMethod(e.target.value)
									}
									label='Thanh toán khi nhận hàng (COD)'
									className='mb-2'
								/>
								<Form.Check
									type='radio'
									name='paymentMethod'
									id='vnpay'
									value='vnpay'
									checked={paymentMethod === "vnpay"}
									onChange={(e) =>
										setPaymentMethod(e.target.value)
									}
									label='Thanh toán qua VNPAY'
								/>
							</div>
						</Form.Group>

						<div className='d-flex gap-3'>
							<Button
								variant='outline-secondary'
								onClick={onBackToCart}
								className='px-4'
							>
								← Quay lại giỏ hàng
							</Button>
							<Button
								variant='primary'
								onClick={onComplete}
								className='px-4'
							>
								Hoàn tất đặt hàng
							</Button>
						</div>
					</Form>
				</Card>
			</Col>

			{/* Order Summary */}
			<Col md={4}>
				<Card className='p-4'>
					<h5>Đơn hàng của bạn</h5>
					<hr />
					{cartItems.map((item) => (
						<div
							key={item.id}
							className='d-flex justify-content-between mb-2'
						>
							<span>
								{item.name} × {item.quantity}
							</span>
							<span>
								{(item.price * item.quantity).toLocaleString(
									"vi-VN",
								)}
								₫
							</span>
						</div>
					))}
					<hr />
					<div className='d-flex justify-content-between mb-2'>
						<span>Phí vận chuyển:</span>
						<span>50.000₫</span>
					</div>
					<hr />
					<div className='d-flex justify-content-between fw-bold'>
						<span>Tổng cộng:</span>
						<span className='text-primary'>
							{total.toLocaleString("vi-VN")}₫
						</span>
					</div>
				</Card>
			</Col>
		</Row>
	);
}
