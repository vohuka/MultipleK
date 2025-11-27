import axios from "axios";
import { useEffect, useState } from "react";
import { Button, FormControl, InputGroup, Modal } from "react-bootstrap";
import "./UserProfilePage.css";
import { BASE_URL } from "../../services/api";
import { useContext } from "react";
import { CartContext } from "../../Context/CartContext";

export default function UserProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Password states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [storedPassword] = useState("12345");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalVariant, setModalVariant] = useState("success");

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.user);
        setAvatarUrl(
          res.data.user.avatar_url ||
            "https://i.pinimg.com/736x/dc/24/11/dc24119d6c5d97d3aad5fa19ae7cdbcc.jpg"
        );
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setModalTitle("Error");
        setModalMessage("❌ Không thể tải thông tin người dùng");
        setModalVariant("danger");
        setShowSuccessModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setModalTitle("Password Change Failed");
      setModalMessage("❌ New password and confirmation do not match!");
      setModalVariant("danger");
      setShowSuccessModal(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${BASE_URL}/user/change-password`,
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setModalTitle("Password Changed Successfully");
      setModalMessage("✅ Your password has been updated!");
      setModalVariant("success");
      setShowSuccessModal(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (error) {
      setModalTitle("Password Change Failed");
      setModalMessage(
        "❌ " + (error.response?.data?.message || "Update failed.")
      );
      setModalVariant("danger");
      setShowSuccessModal(true);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewAvatar(previewUrl);
      setShowPreviewModal(true);
    }
  };

  const handleConfirmAvatar = async () => {
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const uploadRes = await axios.post(
        `${BASE_URL}/uploads/upload_image.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadRes.data.success) {
        const newAvatarUrl = uploadRes.data.url;
        setAvatarUrl(newAvatarUrl);

        // Gọi API để lưu avatar_url vào database
        const token = localStorage.getItem("token");
        await axios.put(
          `${BASE_URL}/user/update-avatar`,
          { avatar_url: newAvatarUrl },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Reload lại profile để cập nhật avatar
        setProfile((prev) => ({ ...prev, avatar_url: newAvatarUrl }));

        setModalTitle("✅ Thành công");
        setModalMessage("Ảnh đại diện đã được cập nhật.");
        setModalVariant("success");
      } else {
        setModalTitle("❌ Tải lên thất bại");
        setModalMessage(uploadRes.data.message || "Lỗi không xác định.");
        setModalVariant("danger");
      }
    } catch (err) {
      console.error("Upload avatar error:", err);
      setModalTitle("❌ Lỗi hệ thống");
      setModalMessage("Không thể cập nhật ảnh đại diện.");
      setModalVariant("danger");
    }

    setShowSuccessModal(true);
    setShowPreviewModal(false);
    setPreviewAvatar(null);
  };

  const handleCancelAvatar = () => {
    URL.revokeObjectURL(previewAvatar);
    setPreviewAvatar(null);
    setShowPreviewModal(false);
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  if (!profile)
    return <div className="text-center text-danger">No user data found.</div>;

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  if (!profile)
    return <div className="text-center text-danger">No user data found.</div>;

  const handleLogout = () => {
    // Xóa token và thông tin người dùng khỏi localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearCart();

    // In thông báo để debug
    console.log("User logged out successfully");

    // Chuyển hướng người dùng về trang đăng nhập
    window.location.href = "/login";
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  if (!profile)
    return <div className="text-center text-danger">No user data found.</div>;

  return (
    <div className="user-profile container py-5">
      <h2 className="mb-4">👤 Thông tin người dùng</h2>
      <div className="text-center mb-4">
        <div className="avatar-upload mb-3">
          <img
            src={avatarUrl || "https://via.placeholder.com/150x150?text=Avatar"}
            alt="Avatar"
            className="rounded-circle border"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
        </div>
        <label className="btn btn-outline-secondary btn-sm">
          Cập nhật ảnh đại diện
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            hidden
          />
        </label>
      </div>

      <form className="card p-4 shadow-sm mb-4">
        <div className="mb-3">
          <label className="form-label">Họ và tên</label>
          <input
            type="text"
            className="form-control"
            value={`${profile.first_name} ${profile.last_name}`}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Địa chỉ email</label>
          <input
            type="email"
            className="form-control"
            value={profile.email}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Số điện thoại</label>
          <input
            type="text"
            className="form-control"
            value={profile.phone}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ngày sinh</label>
          <input
            type="date"
            className="form-control"
            value={profile.birthdate}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Quốc gia</label>
          <input
            type="text"
            className="form-control"
            value={profile.region}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Tiểu sử</label>
          <textarea
            className="form-control"
            value={profile.bio}
            rows={4}
            readOnly
          />
        </div>
      </form>

      {!showPasswordForm && (
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowPasswordForm(true)}
          >
            🔒 Đổi mật khẩu
          </button>
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm"
            title="Logout"
          >
            <i className="fa-solid fa-sign-out-alt"></i> Đăng xuất
          </button>
        </div>
      )}

      {showPasswordForm && (
        <div className="card p-4 shadow-sm mt-3">
          <h4 className="mb-3">Đổi mật khẩu</h4>
          <form onSubmit={handlePasswordChange}>
            <div className="mb-3">
              <label className="form-label">Mật khẩu hiện tại</label>
              <InputGroup>
                <FormControl
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <InputGroup.Text
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  style={{ cursor: "pointer" }}
                >
                  {showOldPassword ? "👁️" : "🙈"}
                </InputGroup.Text>
              </InputGroup>
            </div>
            <div className="mb-3">
              <label className="form-label">Mật khẩu mới</label>
              <InputGroup>
                <FormControl
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <InputGroup.Text
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ cursor: "pointer" }}
                >
                  {showNewPassword ? "👁️" : "🙈"}
                </InputGroup.Text>
              </InputGroup>
            </div>
            <div className="mb-3">
              <label className="form-label">Nhập lại mật khẩu mới</label>
              <InputGroup>
                <FormControl
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <InputGroup.Text
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ cursor: "pointer" }}
                >
                  {showConfirmPassword ? "👁️" : "🙈"}
                </InputGroup.Text>
              </InputGroup>
            </div>
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary">
                Lưu
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowPasswordForm(false);
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
              >
                Hủy
              </Button>
            </div>
          </form>
        </div>
      )}

      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header
          closeButton
          className={
            modalVariant === "danger"
              ? "bg-danger text-white"
              : "bg-success text-white"
          }
        >
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant={modalVariant === "danger" ? "light" : "primary"}
            onClick={() => setShowSuccessModal(false)}
          >
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPreviewModal} onHide={handleCancelAvatar} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xem trước ảnh đại diện</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={previewAvatar}
            alt="Preview"
            className="rounded-circle"
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelAvatar}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleConfirmAvatar}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="col-xl-6 col-12 d-flex align-items-center justify-content-center gap-3 gap-md-5"></div>
    </div>
  );
}
