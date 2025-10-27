// Register.jsx
import { useState } from "react";
import { InputGroup } from "react-bootstrap";
import { Row, Col, Form, Button, Alert } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import { api, authService } from "../../services";

import styles from "./Auth.module.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    region: "",
    birthdate: "",
    phone: "",
    agreeTerms: false,
    subscribeNewsletter: false,
    joinRewards: false,
  });

  // Stated
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMsg, setsubmitMsg] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const checkValidity = () => {
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (
      form.checkValidity() === false ||
      formData.password !== formData.confirmPassword
    ) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setIsSubmitting(true);
    setsubmitMsg({ type: "", text: "" });

    try {
      const apiData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName || "",
        region: formData.region,
        birthdate: formData.birthdate,
        phone: formData.phone || "",
      };

      const res = await authService.register(apiData);
      if (res.data.message === "Success") {
        setsubmitMsg({
          type: "success",
          text: "Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...",
        });

        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        throw new Error(JSON.stringify(res.data)); // In chi tiết lỗi từ backend
      }
    } catch (err) {
      console.error("Registratrion error: ", err);
      setsubmitMsg({
        type: "danger",
        text: err.res?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Handle cancel action, e.g., redirect to home page
    window.history.back();
  };

  return (
    <div className={`commonContainer ${styles.registerContainer}`}>
      <h1 className={styles.title}>Đăng ký</h1>

      <div className={styles.introText}>
        <p className="text-center">
          MK cam kết tôn trọng và bảo vệ các thông tin của bạn
        </p>
        <p className="text-center">
          Thông tin mà bạn cung cấp sẽ giúp chúng tôi phục vụ bạn tốt hơn
        </p>
        <p className="text-center text-danger">
          Các mục được đánh dấu * là bắt buộc cho đơn đăng ký
        </p>
      </div>

      <hr className={styles.divider} />
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>
            Địa chỉ thư điện tử <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            Vui lòng nhập địa chỉ email hợp lệ.
          </Form.Control.Feedback>
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Mật Khẩu <span className="text-danger">*</span>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
                <InputGroup.Text
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                >
                  {showPassword ? "👁️" : "🙈"}
                </InputGroup.Text>

                <Form.Control.Feedback type="invalid">
                  Vui lòng nhập mật khẩu ít nhất 6 ký tự.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Xác nhận mật khẩu <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                isInvalid={
                  formData.password !== formData.confirmPassword &&
                  formData.confirmPassword !== ""
                }
              />
              <Form.Control.Feedback type="invalid">
                Mật khẩu không khớp.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Tên <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập tên của bạn.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Họ</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Vùng / Vị trí <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
              >
                <option value="">Chọn</option>
                <option value="Việt Nam">Việt Nam</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Singapore">Singapore</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Philippines">Philippines</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Thailand">Thailand</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Vui lòng chọn vùng/vị trí của bạn.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Ngày sinh <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập ngày sinh của bạn.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Số Điện Thoại</Form.Label>
          <Form.Control
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Check
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            label={
              <span>
                Tôi đồng ý với{" "}
                <a href="#" className="text-danger">
                  Trung tâm thành viên MK
                </a>{" "}
                Điều khoản và Điều kiện.
                <span className="text-danger">*</span>
              </span>
            }
            checked={formData.agreeTerms}
            onChange={handleChange}
            required
            feedback="Bạn phải đồng ý với các điều khoản và điều kiện."
            feedbackType="invalid"
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Check
            type="checkbox"
            id="subscribeNewsletter"
            name="subscribeNewsletter"
            checked={formData.subscribeNewsletter}
            onChange={handleChange}
            label={
              <div>
                <div>Đăng ký Bản tin MK</div>
                <div className="text-muted small">
                  Vui lòng đánh dấu vào ô nếu bạn muốn nhận tin tức và cập nhật
                  mới nhất của chúng tôi.
                  <br />
                  Thông qua nhập vào đây, bạn đồng ý với việc xử lý dữ liệu cá
                  nhân của mình bằng [Micro-Star International Co., LTD.] để gửi
                  cho bạn thông tin về [Các sản phẩm, dịch vụ, và các sự kiện
                  sắp diễn ra của MK]. Xin lưu ý rằng bạn có thể hủy đăng ký Bản
                  tin MK{" "}
                  <a href="#" className="text-danger">
                    tại đây
                  </a>{" "}
                  bất kỳ lúc nào.
                </div>
              </div>
            }
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Check
            type="checkbox"
            id="joinRewards"
            name="joinRewards"
            checked={formData.joinRewards}
            onChange={handleChange}
            label={
              <div>
                <div>Chương trình Phần thưởng của MK</div>
                <div className="text-muted small">
                  Tôi đã đồng ý với chính sách, thời gian và điều kiện tham gia
                  dự thưởng
                  <br />
                  Trở thành thành viên ngay hôm nay để kiếm điểm, nhận ưu đãi
                  độc quyền, lời mời tham gia sự kiện VIP đặc biệt và hơn thế
                  nữa!
                  <br />
                  <a href="#" className="text-decoration-none">
                    Tìm hiểu thêm về các lợi ích của Chương trình Phần thưởng
                    MK.
                  </a>
                </div>
              </div>
            }
          />
        </Form.Group>

        <div className="text-muted small mb-4">
          Thông tin chi tiết khác về các hoạt động xử lý dữ liệu của chúng tôi
          có tại{" "}
          <a href="#" className="text-danger">
            Chính sách quyền riêng tư của MK
          </a>
        </div>

        {submitMsg.text && (
          <Alert variant={submitMsg.type} className="mb-4">
            {submitMsg.text}
          </Alert>
        )}

        <div className={styles.buttonGroup}>
          <Button
            type="submit"
            variant="danger"
            disabled={isSubmitting}
            className={`${styles.submitButton} d-flex align-items-center justify-content-between`}
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng ký thành viên"}
            <span className="ms-2">&gt;</span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            className={`${styles.cancelButton} d-flex align-items-center justify-content-between`}
            onClick={handleCancel}
          >
            Hủy bỏ
            <span className="ms-2">&gt;</span>
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Register;
