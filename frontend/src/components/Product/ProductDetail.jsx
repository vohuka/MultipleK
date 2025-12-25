import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect, useContext } from "react";
import {
	Badge,
	Button,
	Col,
	Container,
	Image,
	Row,
	Table,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import productService from "../../services/productServices";
import "./ProductDetail.css";
import { CartContext } from "../../Context/CartContext";
import { toast } from "react-toastify";
import { useSEO, getProductSEO } from "../../hooks/useSEO";

/**
 * ProductDetail component displays full product information
 * Includes SEO optimizations: dynamic title, meta, structured data, alt text
 */
const ProductDetail = () => {
	const { productId } = useParams();
	const [product, setProduct] = useState(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const { addToCart } = useContext(CartContext);
	const navigate = useNavigate();

	// Apply dynamic SEO based on product data
	useSEO(getProductSEO(product));

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const res = await productService.getProductsById(productId);
				setProduct(res.data.data);
			} catch (err) {
				console.error("Error fetching product detail", err);
			}
		};
		fetchProduct();
	}, [productId]);

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % (product?.images?.length || 1));
	};

	const handlePrev = () => {
		setCurrentIndex(
			(prev) =>
				(prev - 1 + (product?.images?.length || 1)) %
				(product?.images?.length || 1),
		);
	};

	if (!product) {
		return (
			<Container className="p-4" role="status" aria-live="polite">
				<p>Đang tải sản phẩm...</p>
			</Container>
		);
	}

	// Generate JSON-LD structured data for product
	const productStructuredData = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.name,
		image: product.images?.map((img) => img.base64) || [],
		description: `Laptop ${product.name} - CPU: ${product.cpu || "N/A"}, RAM: ${product.ram || "N/A"}, Ổ cứng: ${product.storage || "N/A"}`,
		brand: {
			"@type": "Brand",
			name: product.brand || "Unknown",
		},
		offers: {
			"@type": "Offer",
			url: `https://multiplek.com/products/detail/${product.id}`,
			priceCurrency: "VND",
			price: product.price || 0,
			availability: product.stock > 0
				? "https://schema.org/InStock"
				: "https://schema.org/OutOfStock",
			seller: {
				"@type": "Organization",
				name: "Multiple K",
			},
		},
	};

	return (
		<article className="product-detail-page">
			{/* JSON-LD Structured Data for Product */}
			<script type="application/ld+json">
				{JSON.stringify(productStructuredData)}
			</script>

			<Container fluid className="p-4">
				<Row>
					{/* Left: Product Images */}
					<Col md={6} className="text-center mb-3">
						<figure className="product-images-container">
							<Container fluid className="p-3">
								<div
									className="position-relative w-100"
									style={{ minHeight: "350px" }}
								>
									<AnimatePresence mode="wait">
										<motion.img
											key={currentIndex}
											src={product.images[currentIndex].base64}
											alt={`${product.name} - Hình ảnh ${currentIndex + 1} của ${product.images.length}`}
											className="img-fluid rounded"
											initial={{ opacity: 0, x: 50 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: -50 }}
											transition={{ duration: 0.4 }}
											style={{
												maxHeight: "350px",
												objectFit: "contain",
											}}
										/>
									</AnimatePresence>
								</div>
							</Container>

							{/* Thumbnail navigation */}
							<Container className="text-center mt-3">
								<Row className="align-items-center justify-content-center g-2">
									<Col xs="auto">
										<button
											onClick={handlePrev}
											aria-label="Xem hình trước"
											className="btn btn-link p-0"
										>
											<IoIosArrowBack size={24} aria-hidden="true" />
										</button>
									</Col>
									{product.images.map((img, index) => (
										<Col xs={4} md={3} key={index}>
											<Image
												src={img.base64}
												alt={`${product.name} - Thumbnail ${index + 1}`}
												thumbnail
												style={{
													border:
														index === currentIndex
															? "2px solid #0d6efd"
															: "1px solid #dee2e6",
													cursor: "pointer",
												}}
												onClick={() => setCurrentIndex(index)}
												role="button"
												tabIndex={0}
												onKeyDown={(e) => e.key === "Enter" && setCurrentIndex(index)}
											/>
										</Col>
									))}
									<Col xs="auto">
										<button
											onClick={handleNext}
											aria-label="Xem hình tiếp theo"
											className="btn btn-link p-0"
										>
											<IoIosArrowForward size={24} aria-hidden="true" />
										</button>
									</Col>
								</Row>
							</Container>
							<figcaption className="visually-hidden">
								Bộ sưu tập hình ảnh sản phẩm {product.name}
							</figcaption>
						</figure>
					</Col>

					{/* Right: Product Details */}
					<Col md={6}>
						{/* Product Name - H1 for product detail page */}
						<h1 className="fw-bold mb-2 h2">{product.name}</h1>
						<hr />

						{/* Price section */}
						<div className="mb-2 p-3" aria-label="Thông tin giá">
							<p className="fw-bold text-primary mb-2 h3">
								<span aria-label="Giá bán">
									{Number(product.price || 0).toLocaleString("vi-VN")}₫
								</span>
							</p>

							<p className="mb-0">
								<span
									className="text-muted text-decoration-line-through me-3 align-middle"
									style={{ fontSize: "0.95rem" }}
									aria-label="Giá gốc"
								>
									{(Number(product.price || 0) + 2000000).toLocaleString("vi-VN")}₫
								</span>
								<span className="text-danger fw-bold align-middle" aria-label="Phần trăm giảm giá">
									Giảm{" "}
									{Math.round(
										((Number(product.price || 0) + 2000000 - Number(product.price || 0)) /
											(Number(product.price || 0) + 2000000)) *
											100,
									)}
									%
								</span>
							</p>
						</div>

						{/* Add to Cart Buttons */}
						<div className="button-container" role="group" aria-label="Thao tác mua hàng">
							<Button
								size="lg"
								className="w-50 fw-bold"
								onClick={() => {
									addToCart(product);
									navigate("/cart");
								}}
								style={{
									padding: "12px 0",
									fontSize: "18px",
									backgroundColor: "#000000ff",
									border: "none",
								}}
								aria-label={`Mua ngay ${product.name}`}
							>
								MUA NGAY
							</Button>

							<Button
								variant="outline"
								size="lg"
								className="w-50 fw-bold"
								onClick={() => {
									addToCart(product);
									toast.success("Đã thêm vào giỏ hàng!");
								}}
								style={{
									padding: "12px 0",
									fontSize: "18px",
									borderColor: "#000000ff",
								}}
								aria-label={`Thêm ${product.name} vào giỏ hàng`}
							>
								THÊM VÀO GIỎ HÀNG
							</Button>
						</div>

						{/* Specs Table */}
						<section aria-labelledby="specs-heading">
							<h2 id="specs-heading" className="visually-hidden">
								Thông số kỹ thuật
							</h2>
							<Table hover className="mt-4 border" aria-label="Bảng thông số kỹ thuật sản phẩm">
								<tbody>
									<tr style={{ backgroundColor: "#f8f9fa" }}>
										<th scope="row" style={{ width: "40%" }}>
											Thương hiệu
										</th>
										<td>{product.brand || "N/A"}</td>
									</tr>
									<tr>
										<th scope="row">CPU</th>
										<td>{product.cpu || "N/A"}</td>
									</tr>
									<tr style={{ backgroundColor: "#f8f9fa" }}>
										<th scope="row">Dung lượng</th>
										<td>{product.storage || "N/A"}</td>
									</tr>
									<tr>
										<th scope="row">RAM</th>
										<td>{product.ram || "N/A"}</td>
									</tr>
									<tr style={{ backgroundColor: "#f8f9fa" }}>
										<th scope="row">Pin</th>
										<td>{product.pin || "N/A"}</td>
									</tr>
									<tr>
										<th scope="row">Card đồ họa</th>
										<td>{product.graphic_card || "N/A"}</td>
									</tr>
									<tr style={{ backgroundColor: "#f8f9fa" }}>
										<th scope="row">Hệ điều hành</th>
										<td>{product.os || "N/A"}</td>
									</tr>
									<tr>
										<th scope="row">Kích thước màn hình</th>
										<td>{product.screen_size || "N/A"}</td>
									</tr>
									<tr style={{ backgroundColor: "#f8f9fa" }}>
										<th scope="row">Trọng lượng</th>
										<td>{product.weight || "N/A"}</td>
									</tr>
									<tr>
										<th scope="row">Kho hàng</th>
										<td>{product.stock || 0} máy</td>
									</tr>
									{product.tags?.length > 0 && (
										<tr style={{ backgroundColor: "#f8f9fa" }}>
											<th scope="row">Tags</th>
											<td>
												{product.tags.map((tag, index) => (
													<Badge key={index} bg="secondary" className="me-1">
														{tag}
													</Badge>
												))}
											</td>
										</tr>
									)}
									{product.colors?.length > 0 && (
										<tr>
											<th scope="row">Màu sắc</th>
											<td>
												{product.colors.map((color, index) => (
													<span
														key={index}
														className="me-2 px-2 py-1 rounded d-inline-block"
														style={{
															backgroundColor: color,
															color: color.toLowerCase() === "yellow" ? "black" : "#fff",
															border: `1px solid ${color}`,
														}}
														aria-label={`Màu ${color}`}
													>
														{color.charAt(0).toUpperCase() + color.slice(1)}
													</span>
												))}
											</td>
										</tr>
									)}
									<tr style={{ backgroundColor: "#f8f9fa" }}>
										<th scope="row">Ngày phát hành</th>
										<td>
											{product.published?.split("-").reverse().join("-") || "N/A"}
										</td>
									</tr>
								</tbody>
							</Table>
						</section>
					</Col>
				</Row>
			</Container>
		</article>
	);
};

export default ProductDetail;
