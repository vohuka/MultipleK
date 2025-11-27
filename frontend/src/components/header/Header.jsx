import { use, useContext, useState } from "react";
import "./Header.css";
import MobileMenu from "./MobileMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faMagnifyingGlass,
  faCartShopping,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useMediaQuery } from "react-responsive";
import { NavLink } from "react-router-dom";
import { CartContext } from "../../Context/CartContext";
import { Dropdown } from "react-bootstrap";
import SearchModal from "./SearchModal";

export default function Header() {
  const [visiable, setVisiable] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { cartItems } = useContext(CartContext);
  const handleOnchangeMedia = (matches) => {
    if (!matches) {
      setVisiable(matches);
    }
  };

  const handleVisiable = () => {
    setVisiable(!visiable);
  };

  const isSmallerHeader = useMediaQuery(
    { maxWidth: 996 },
    undefined,
    handleOnchangeMedia
  );

  const closeMenu = () => setVisiable(false);

  return (
    <header>
      <nav className="shadow-sm nav-header">
        <div className="header_container">
          <div className="main-area d-flex justify-content-between">
            <div className="bar align-content-center">
              <button className="p-3" onClick={handleVisiable}>
                {visiable ? (
                  <FontAwesomeIcon icon={faXmark} />
                ) : (
                  <FontAwesomeIcon icon={faBars} />
                )}
              </button>
            </div>
            <div className="logo align-content-center p-10">
              <NavLink to="/">
                <img
                  src="/logo/logo.png"
                  alt="Multi K Logo"
                  className="img-fluid p-2"
                  style={{ maxWidth: 90, height: "auto" }}
                  onClick={closeMenu}
                />
              </NavLink>
            </div>
            <div className="main-area-menu">
              <div className="nav-item">
                <NavLink to="products" onClick={closeMenu}>
                  Sản phẩm
                </NavLink>
              </div>
              <div className="nav-item">
                <NavLink to="introduction" onClick={closeMenu}>
                  Giới thiệu
                </NavLink>
              </div>
              <div className="nav-item">
                <NavLink to="community" onClick={closeMenu}>
                  Cộng đồng
                </NavLink>
              </div>
              <div className="nav-item">
                <NavLink to="questions" onClick={closeMenu}>
                  Hỏi/đáp
                </NavLink>
              </div>
              <div className="nav-item">
                <NavLink to="contact" onClick={closeMenu}>
                  Liên hệ
                </NavLink>
              </div>
            </div>

            <div className="menu-area-icon d-flex align-items-center">
              <div className="operation-icon px-3">
                <Dropdown align="end" className="cart-dropdown">
                  <Dropdown.Toggle
                    variant="link"
                    className="p-0 border-0 shadow-none bg-transparent d-flex align-items-center text-dark"
                  >
                    <div className="cart-icon-wrapper position-relative">
                      <FontAwesomeIcon icon={faCartShopping} size="lg" />
                      {cartItems.length > 0 && (
                        <span className="cart-badge badge rounded-pill bg-danger position-absolute top-0 start-50">
                          {cartItems.length}
                        </span>
                      )}
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={NavLink} to="/cart">
                      🛒 Đơn hàng hiện tại
                    </Dropdown.Item>
                    <Dropdown.Item as={NavLink} to="/historycart">
                      📦 Các đơn hàng của bạn
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="operation-icon px-3">
                <NavLink to="login">
                  <span className="operation-icon">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                </NavLink>
              </div>
              <div className="operation-icon px-3">
                <button onClick={() => setShowSearchModal(true)}>
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <MobileMenu
        isVisiable={visiable && isSmallerHeader}
        offVisual={closeMenu}
      />

      {/* Modal Search */}
      <SearchModal
        show={showSearchModal}
        onHide={() => setShowSearchModal(false)}
      />
    </header>
  );
}
