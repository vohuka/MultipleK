import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
	Container,
	Row,
	Col,
	Card,
	Badge,
	Table,
	Button,
	Spinner,
} from "react-bootstrap";
import { format } from "date-fns";
import {
	FaArrowLeft,
	FaUser,
	FaEnvelope,
	FaPhone,
	FaMapMarkedAlt,
} from "react-icons/fa";
import { BASE_URL } from "../../services/api";

export default function UserOrderDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [orderDetail, setOrderDetail] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const status = {
		ordered: { color: "success", state: "Đã đặt hàng" },
		shipping: { color: "warning", state: "Đang giao hàng" },
		delivered: { color: "info", state: "Đã giao hàng" },
	};

	useEffect(() => {
		const fetchOrderDetail = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await fetch(`${BASE_URL}/order/${id}/detail`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				const data = await response.json();

				if (data.success) {
					setOrderDetail(data.data);
				} else {
					setError("Không thể tải thông tin đơn hàng");
				}
			} catch (err) {
				console.error("Error fetching order detail:", err);
				setError("Có lỗi xảy ra khi tải dữ liệu");
			} finally {
				setLoading(false);
			}
		};

		fetchOrderDetail();
	}, [id]);

	const formatOrderDate = (dateString) => {
		const date = new Date(dateString);
		return date
			.toLocaleString("vi-VN", {
				timeZone: "Asia/Ho_Chi_Minh",
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
			})
			.replace(
				/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2})/,
				"$1/$2/$3 lúc $4:$5",
			);
	};

	if (loading) {
		return (
			<Container className='py-5 text-center'>
				<Spinner animation='border' variant='primary' />
				<p className='mt-3'>Đang tải thông tin đơn hàng...</p>
			</Container>
		);
	}

	if (error) {
		return (
			<Container className='py-5 text-center'>
				<div className='alert alert-danger'>
					<h5>Có lỗi xảy ra</h5>
					<p>{error}</p>
					<Button
						variant='primary'
						onClick={() => navigate("/historycart")}
					>
						Quay lại lịch sử đơn hàng
					</Button>
				</div>
			</Container>
		);
	}

	if (!orderDetail) {
		return (
			<Container className='py-5 text-center'>
				<div className='alert alert-warning'>
					<h5>Không tìm thấy đơn hàng</h5>
					<Button
						variant='primary'
						onClick={() => navigate("/historycart")}
					>
						Quay lại lịch sử đơn hàng
					</Button>
				</div>
			</Container>
		);
	}

	return (
		<Container className='py-5'>
			{/* Header */}
			<Row className='mb-4'>
				<Col>
					<div className='d-flex align-items-center mb-3'>
						<Button
							variant='outline-primary'
							onClick={() => navigate("/historycart")}
							className='me-3'
						>
							<FaArrowLeft className='me-2' />
							Quay lại
						</Button>
						<div>
							<h3 className='mb-0'>
								Chi tiết đơn hàng #{orderDetail.id}
							</h3>
							<p className='text-muted mb-0'>
								Đặt ngày {formatOrderDate(orderDetail.order_at)}
							</p>
						</div>
					</div>
				</Col>
			</Row>

			<Row>
				{/* Order Status */}
				<Col md={12} className='mb-4'>
					<Card>
						<Card.Header className='bg-primary text-white'>
							<h5 className='mb-0'>🚚 Trạng thái đơn hàng</h5>
						</Card.Header>
						<Card.Body>
							<div className='d-flex align-items-center mt-3'>
								<Badge
									bg={
										status[orderDetail.status]?.color ||
										"secondary"
									}
									className='fs-6 px-3 py-2'
								>
									{status[orderDetail.status]?.state ||
										orderDetail.status}
								</Badge>
								{orderDetail.status === "delivered" && (
									<span className='text-success ms-3'>
										✅ Đơn hàng đã được giao thành công
									</span>
								)}
								{orderDetail.status === "shipping" && (
									<span className='text-warning ms-3'>
										🚛 Đơn hàng đang trên đường giao đến bạn
									</span>
								)}
								{orderDetail.status === "ordered" && (
									<span className='text-info ms-3'>
										📦 Đơn hàng đang được chuẩn bị
									</span>
								)}
							</div>
						</Card.Body>
					</Card>
				</Col>

				{/* Billing Information */}
				<Col md={6} className='mb-4'>
					<Card className='h-100'>
						<Card.Header className='bg-info text-white'>
							<h5 className='mb-0'>👤 Thông tin giao hàng</h5>
						</Card.Header>
						<Card.Body>
							<div className='mb-3'>
								<FaUser className='me-2 text-primary' />
								<strong>Họ tên:</strong>{" "}
								{orderDetail.full_name || "N/A"}
							</div>
							<div className='mb-3'>
								<FaEnvelope className='me-2 text-primary' />
								<strong>Email:</strong>{" "}
								{orderDetail.email || "N/A"}
							</div>
							<div className='mb-3'>
								<FaPhone className='me-2 text-primary' />
								<strong>Số điện thoại:</strong>{" "}
								{orderDetail.phone || "N/A"}
							</div>
							<div className='mb-3'>
								<FaMapMarkedAlt className='me-2 text-primary' />
								<strong>Địa chỉ:</strong>{" "}
								{orderDetail.address || "N/A"}
							</div>
							{orderDetail.note && (
								<div className='mb-0'>
									<strong>Ghi chú:</strong> {orderDetail.note}
								</div>
							)}
						</Card.Body>
					</Card>
				</Col>

				{/* Order Summary */}
				<Col md={6} className='mb-4'>
					<Card className='h-100'>
						<Card.Header className='bg-success text-white'>
							<h5 className='mb-0'>💰 Tóm tắt đơn hàng</h5>
						</Card.Header>
						<Card.Body>
							<div className='d-flex justify-content-between mb-2'>
								<span>Tạm tính:</span>
								<span>
									{orderDetail.subtotal.toLocaleString(
										"vi-VN",
									)}
									₫
								</span>
							</div>
							<div className='d-flex justify-content-between mb-2'>
								<span>Phí vận chuyển:</span>
								<span>
									{orderDetail.shipping_fee.toLocaleString(
										"vi-VN",
									)}
									₫
								</span>
							</div>
							<hr />
							<div className='d-flex justify-content-between mb-0'>
								<strong>Tổng cộng:</strong>
								<strong className='text-success fs-5'>
									{orderDetail.total.toLocaleString("vi-VN")}₫
								</strong>
							</div>
							{orderDetail.payment_method && (
								<div className='mt-3 pt-3 border-top'>
									<small className='text-muted'>
										Phương thức thanh toán:{" "}
										<strong className='text-capitalize'>
											{orderDetail.payment_method ===
											"cod"
												? "Thanh toán khi nhận hàng"
												: orderDetail.payment_method.toUpperCase()}
										</strong>
									</small>
								</div>
							)}
						</Card.Body>
					</Card>
				</Col>

				{/* Order Items */}
				<Col md={12}>
					<Card>
						<Card.Header className='bg-warning text-dark'>
							<h5 className='mb-0'>🛍️ Danh sách sản phẩm</h5>
						</Card.Header>
						<Card.Body className='p-0'>
							<Table responsive className='mb-0'>
								<thead className='bg-light'>
									<tr>
										<th>Sản phẩm</th>
										<th className='text-center'>
											Số lượng
										</th>
										<th className='text-end'>Đơn giá</th>
										<th className='text-end'>Thành tiền</th>
									</tr>
								</thead>
								<tbody>
									{orderDetail.items.map((item, index) => (
										<tr key={index}>
											<td className='p-0'>
												<Link
													to={`/products/detail/${item.product_id}`}
													className='text-decoration-none d-block p-3'
													style={{
														transition:
															"all 0.2s ease",
														color: "inherit",
													}}
													onMouseEnter={(e) => {
														e.currentTarget.style.backgroundColor =
															"#f8f9fa";
														e.currentTarget.style.transform =
															"translateX(2px)";
													}}
													onMouseLeave={(e) => {
														e.currentTarget.style.backgroundColor =
															"transparent";
														e.currentTarget.style.transform =
															"translateX(0)";
													}}
												>
													<div className='d-flex align-items-center'>
														{item.image && (
															<img
																src={`${BASE_URL}/uploads/img/${item.image}`}
																alt={item.name}
																className='me-3 rounded'
																style={{
																	width: "50px",
																	height: "50px",
																	objectFit:
																		"cover",
																}}
																onError={(
																	e,
																) => {
																	e.target.style.display =
																		"none";
																}}
															/>
														)}
														<div>
															<h6 className='mb-0 text-primary fw-bold'>
																{item.name}
																<small className='ms-2 text-muted'>
																	<i className='fas fa-external-link-alt'></i>
																</small>
															</h6>
														</div>
													</div>
												</Link>
											</td>
											<td className='text-center align-middle'>
												<Badge bg='secondary'>
													{item.quantity}
												</Badge>
											</td>
											<td className='text-end align-middle'>
												{item.price_at_order.toLocaleString(
													"vi-VN",
												)}
												₫
											</td>
											<td className='text-end align-middle'>
												<strong>
													{(
														item.price_at_order *
														item.quantity
													).toLocaleString("vi-VN")}
													₫
												</strong>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			{/* Action Buttons */}
			<Row className='mt-4'>
				<Col className='text-center'>
					<Button
						variant='outline-primary'
						size='lg'
						onClick={() => navigate("/historycart")}
						className='me-3'
					>
						Xem tất cả đơn hàng
					</Button>
					<Button
						variant='primary'
						size='lg'
						onClick={() => navigate("/products")}
					>
						Tiếp tục mua sắm
					</Button>
				</Col>
			</Row>
		</Container>
	);
}
