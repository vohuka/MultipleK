import { useState, useEffect } from "react";
import { Modal, Form, Card, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import productService from "../../services/productServices";

const SearchModal = ({ show, onHide }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch tất cả sản phẩm khi modal mở
  useEffect(() => {
    if (show) {
      const fetchProducts = async () => {
        try {
          const res = await productService.getProducts();
          setAllProducts(res.data.data || []);
        } catch (err) {
          console.error("Error fetching products:", err);
        }
      };
      fetchProducts();
    }
  }, [show]);

  // Filter sản phẩm theo search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = allProducts.filter((p) => {
      return (
        p.name?.toLowerCase().includes(term) ||
        p.cpu?.toLowerCase().includes(term) ||
        p.ram?.toLowerCase().includes(term) ||
        p.storage?.toLowerCase().includes(term) ||
        p.brand?.toLowerCase().includes(term) ||
        p.graphic_card?.toLowerCase().includes(term) ||
        p.os?.toLowerCase().includes(term)
      );
    });

    setFilteredProducts(results);
  }, [searchTerm, allProducts]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Tìm kiếm sản phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          placeholder="Nhập tên sản phẩm, CPU, RAM, thương hiệu, bộ nhớ, card đồ họa, hệ điều hành muốn tìm kiếm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
          className="mb-3 lead"
        />

        {searchTerm && filteredProducts.length === 0 && (
          <p className="text-muted text-center">
            Không tìm thấy sản phẩm phù hợp
          </p>
        )}

        {searchTerm.trim() && (
        <div style={{ padding: "12px", maxHeight: "400px", overflowY: "auto" }}>
          <Row>
            {filteredProducts.map((product) => (
              <Col md={6} key={product.id} className="mb-3">
                <NavLink
                  to={`/products/detail/${product.id}`}
                  className="text-decoration-none"
                  onClick={onHide}
                >
                  <Card className="h-100">
                    <Card.Img variant="top" src={product.images?.[0]} style={{ maxHeight: "280px", objectFit: "cover" }} />
                    <Card.Body>
                      <Card.Title
                        style={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        {product.name}
                      </Card.Title>
                      <Card.Text style={{ fontSize: "0.8rem" }}>
                        Bộ xử lý: Intel® Core™ {product.cpu} | RAM:{" "} {product.ram} | Ổ cứng: {product.storage} | Card đồ họa: {product.graphic_card} | Hệ điều hành: {product.os} | Thương hiệu: {product.brand}
                      </Card.Text>
                      <Card.Text className="text-primary fw-bold">
                        {Number(product.price).toLocaleString("vi-VN")}₫
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </NavLink>
              </Col>
            ))}
          </Row>
        </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SearchModal;
