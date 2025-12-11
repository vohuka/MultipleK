import React, { useEffect, useState } from "react";
import {
	Container,
	Row,
	Col,
	Card,
	Badge,
	Button,
	Spinner,
} from "react-bootstrap";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { FaEye, FaSearch, FaShoppingBag } from "react-icons/fa";
import { BASE_URL } from "../../services/api";

export default function HistoryCart() {
	const navigate = useNavigate();
	const [orders, setOrders] = useState([]);
	const [filteredOrders, setFilteredOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const status = {
		ordered: {
			color: "success",
			state: "Đã đặt hàng",
		},
		shipping: {
			color: "warning",
			state: "Đang giao hàng",
		},
		delivered: {
			color: "info",
			state: "Đã giao hàng",
		},
	};

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const token = localStorage.getItem("token");
				const res = await fetch(`${BASE_URL}/historycart`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const data = await res.json();
				if (data.success) {
					setOrders(data.orders);
					setFilteredOrders(data.orders);
				}
			} catch (err) {
				console.error("Error fetching orders", err);
			} finally {
				setLoading(false);
			}
		};
		fetchOrders();
	}, []);

	// Filter orders based on search term and status
	useEffect(() => {
		let filtered = orders;

		if (searchTerm) {
			filtered = filtered.filter(
				(order) =>
					order.id.toString().includes(searchTerm) ||
					order.items.some((item) =>
						item.name
							.toLowerCase()
							.includes(searchTerm.toLowerCase()),
					),
			);
		}

		if (statusFilter !== "all") {
			filtered = filtered.filter(
				(order) => order.status === statusFilter,
			);
		}

		setFilteredOrders(filtered);
	}, [orders, searchTerm, statusFilter]);

	const handleViewDetail = (orderId) => {
		navigate(`/orders/${orderId}`);
	};

	const getTotalItems = (items) => {
		return items.reduce((total, item) => total + item.quantity, 0);
	};

	if (loading) {
		return (
			<Container className='py-5 text-center'>
				<Spinner animation='border' variant='primary' />
				<p className='mt-3'>Đang tải lịch sử đơn hàng...</p>
			</Container>
		);
	}

	return (
		<Container className='py-5'>
			{/* Header */}
			<div className='d-flex justify-content-between align-items-center mb-4'>
				<h3 className='text-dark mb-0'>🧾 Lịch sử đơn hàng</h3>
				<Badge bg='secondary'>{filteredOrders.length} đơn hàng</Badge>
			</div>

			{/* Filters */}
			<Row className='mb-4'>
				<Col md={6}>
					<div className='input-group'>
						<span className='input-group-text'>
							<FaSearch />
						</span>
						<input
							type='text'
							className='form-control'
							placeholder='Tìm theo mã đơn hoặc tên sản phẩm...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</Col>
				<Col md={3}>
					<select
						className='form-select'
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
					>
						<option value='all'>Tất cả trạng thái</option>
						<option value='ordered'>Đã đặt hàng</option>
						<option value='shipping'>Đang giao hàng</option>
						<option value='delivered'>Đã giao hàng</option>
					</select>
				</Col>
			</Row>

			{/* Orders List */}
			{filteredOrders.length === 0 ? (
				<div className='text-center py-5'>
					<FaShoppingBag className='text-muted mb-3' size={48} />
					<h5 className='text-muted'>
						{orders.length === 0
							? "Bạn chưa có đơn hàng nào"
							: "Không tìm thấy đơn hàng phù hợp"}
					</h5>
					{orders.length === 0 && (
						<Button
							variant='primary'
							className='mt-3'
							onClick={() => navigate("/products")}
						>
							Bắt đầu mua sắm
						</Button>
					)}
				</div>
			) : (
				<Row>
					{filteredOrders.map((order) => (
						<Col md={6} lg={4} key={order.id} className='mb-4'>
							<Card className='h-100 shadow-sm border-0 order-card'>
								<Card.Header className='bg-light border-0'>
									<div className='d-flex justify-content-between align-items-center'>
										<strong className='text-primary'>
											Đơn hàng #{order.id}
										</strong>
										<Badge bg={status[order.status].color}>
											{status[order.status].state}
										</Badge>
									</div>
								</Card.Header>
								<Card.Body>
									<p className='text-muted mb-2 small'>
										📅{" "}
										{format(
											new Date(order.order_at),
											"dd/MM/yyyy HH:mm",
										)}
									</p>
									<p className='mb-2'>
										🛍️ {getTotalItems(order.items)} sản phẩm
									</p>
									<div className='mb-3'>
										<small className='text-muted d-block mb-1'>
											Sản phẩm:
										</small>
										{order.items
											.slice(0, 2)
											.map((item, idx) => (
												<small
													key={idx}
													className='d-block text-truncate'
												>
													• {item.name} (x
													{item.quantity})
												</small>
											))}
										{order.items.length > 2 && (
											<small className='text-muted'>
												... và {order.items.length - 2}{" "}
												sản phẩm khác
											</small>
										)}
									</div>
								</Card.Body>
								<Card.Footer className='bg-white border-0'>
									<div className='d-flex justify-content-between align-items-center'>
										<strong className='text-success'>
											{(
												order.total + 50000
											).toLocaleString("vi-VN")}
											₫
										</strong>
										<Button
											size='sm'
											variant='primary'
											onClick={() =>
												handleViewDetail(order.id)
											}
											className='d-flex align-items-center'
										>
											<FaEye className='me-1' />
											Xem chi tiết
										</Button>
									</div>
								</Card.Footer>
							</Card>
						</Col>
					))}
				</Row>
			)}
		</Container>
	);
}
