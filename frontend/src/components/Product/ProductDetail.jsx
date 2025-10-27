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
import { useParams } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import "./ProductDetail.css";
import { CartContext } from "../../Context/CartContext";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `http://localhost/backend/products/${productId}`
        );
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
        (product?.images?.length || 1)
    );
  };

  if (!product)
    return <Container className="p-4">Đang tải sản phẩm...</Container>;

  return (
    <Container fluid className="p-4">
      <Row>
        {/* Left: Product Images */}
        <Col md={6} className="text-center mb-3">
          <Container fluid className="p-3">
            <div
              className="position-relative w-100"
              style={{ minHeight: "350px" }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={product.images[currentIndex]}
                  src={product.images[currentIndex].base64}
                  className="img-fluid rounded"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  style={{ maxHeight: "350px", objectFit: "contain" }}
                />
              </AnimatePresence>
            </div>
          </Container>
          <Container className="text-center mt-3">
            <Row className="align-items-center justify-content-center g-2">
              <Col xs="auto" onClick={handlePrev} style={{ cursor: "pointer" }}>
                <IoIosArrowBack size={24} />
              </Col>
              {product.images.map((img, index) => (
                <Col xs={4} md={3} key={index}>
                  <Image
                    src={img.base64}
                    thumbnail
                    style={{
                      border:
                        index === currentIndex
                          ? "2px solid #0d6efd"
                          : "1px solid #dee2e6",
                      cursor: "pointer",
                    }}
                    onClick={() => setCurrentIndex(index)}
                  />
                </Col>
              ))}
              <Col xs="auto" onClick={handleNext} style={{ cursor: "pointer" }}>
                <IoIosArrowForward size={24} />
              </Col>
            </Row>
          </Container>
        </Col>

        {/* Right: Product Details */}
        <Col md={6}>
          {/* Product Name */}
          <h2 className="fw-bold mb-2">{product.name}</h2>
          <hr />

          {/* Price */}
          <div className="mb-2 p-3">
            <h3 className="fw-bold text-primary mb-2">
              {Number(product.price || 0).toLocaleString("vi-VN")}₫
            </h3>

            <p className="mb-0">
              <span
                className="text-muted text-decoration-line-through me-3 align-middle"
                style={{ fontSize: "0.95rem" }}
              >
                {(Number(product.price || 0) + 2000000).toLocaleString("vi-VN")}
                ₫
              </span>
              <span className="text-danger fw-bold align-middle">
                Giảm{" "}
                {Math.round(
                  ((Number(product.price || 0) +
                    2000000 -
                    Number(product.price || 0)) /
                    (Number(product.price || 0) + 2000000)) *
                    100
                )}
                %
              </span>
            </p>
          </div>

          {/* Add to Cart Button */}
          <div className="button-container">
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
            >
              MUA NGAY
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-50 fw-bold"
              onClick={() => addToCart(product)}
              style={{
                padding: "12px 0",
                fontSize: "18px",
                borderColor: "#000000ff",
              }}
            >
              THÊM VÀO GIỎ HÀNG
            </Button>
          </div>

          {/* Specs Table */}
          <Table hover className="mt-4 border">
            <tbody>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <td className="fw-bold" style={{ width: "40%" }}>
                  Thương hiệu
                </td>
                <td>{product.brand || "N/A"}</td>
              </tr>
              <tr>
                <td className="fw-bold">CPU</td>
                <td>{product.cpu || "N/A"}</td>
              </tr>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <td className="fw-bold">Dung lượng</td>
                <td>{product.storage || "N/A"}</td>
              </tr>
              <tr>
                <td className="fw-bold">RAM</td>
                <td>{product.ram || "N/A"}</td>
              </tr>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <td className="fw-bold">Pin</td>
                <td>{product.pin || "N/A"}</td>
              </tr>
              <tr>
                <td className="fw-bold">Card đồ họa</td>
                <td>{product.graphic_card || "N/A"}</td>
              </tr>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <td className="fw-bold">Hệ điều hành</td>
                <td>{product.os || "N/A"}</td>
              </tr>
              <tr>
                <td className="fw-bold">Kích thước màn hình</td>
                <td>{product.screen_size || "N/A"}</td>
              </tr>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <td className="fw-bold">Trọng lượng</td>
                <td>{product.weight || "N/A"}</td>
              </tr>

              <tr>
                <td className="fw-bold">Kho hàng</td>
                <td>{product.stock || 0} máy</td>
              </tr>
              {product.tags?.length > 0 && (
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <td className="fw-bold">Tags</td>
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
                  <td className="fw-bold">Màu sắc</td>
                  <td>
                    {product.colors.map((color, index) => (
                      <span
                        key={index}
                        className="me-2 px-2 py-1 rounded d-inline-block"
                        style={{
                          backgroundColor: color,
                          color:
                            color.toLowerCase() === "yellow" ? "black" : "#fff",
                          border: `1px solid ${color}`,
                        }}
                      >
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </span>
                    ))}
                  </td>
                </tr>
              )}
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <td className="fw-bold">Ngày phát hành</td>
                <td>
                  {product.published.split("-").reverse().join("-") || "N/A"}
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
