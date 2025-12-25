import { useState } from "react";
import "./Footer.css";
import { useMediaQuery } from "react-responsive";
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from "react-icons/io";

/**
 * FooterItem component with proper link handling
 * Uses # placeholder for non-functional links to avoid SEO penalties
 */
function FooterItem({ text, link = "#", isSmaller }) {
  return (
    <li
      className={`py-2 ${
        isSmaller ? "footerSubMenuExpand" : "footerSubMenu-item"
      }`}
    >
      <a href={link} aria-label={text}>
        {text}
      </a>
    </li>
  );
}

export default function Footer() {
  const [visiable, setVisiable] = useState(Array(5).fill(false));
  const isSmallerFooter = useMediaQuery({ maxWidth: 996 });

  const handleOnChange = (pivot) => {
    const nextVisiable = visiable.slice();
    for (let i = 0; i < nextVisiable.length; i++) {
      nextVisiable[i] = i === pivot ? !nextVisiable[i] : false;
    }
    setVisiable(nextVisiable);
  };

  return (
    <footer>
      <nav className="footer-container">
        <ul
          className={`footerMenu d-flex ${
            isSmallerFooter ? "flex-column" : "justify-content-between py-4"
          }`}
        >
          <li className="footerMenu-item">
            {isSmallerFooter ? (
              <button
                className={`footerItem-button ${
                  visiable[0] ? "footerItem-button--active" : ""
                }`}
                onClick={() => handleOnChange(0)}
              >
                CỘNG ĐỒNG
              </button>
            ) : (
              <div className="footerItem-title">CỘNG ĐỒNG</div>
            )}
            <ul
              className={`footerSubMenu ${
                visiable[0] || !isSmallerFooter ? "" : "none"
              }`}
            >
              <FooterItem text={"Tin tức"} isSmaller={isSmallerFooter} />
              <FooterItem text={"Blog"} isSmaller={isSmallerFooter} />
              <FooterItem text={"Video"} isSmaller={isSmallerFooter} />
              <FooterItem text={"Mạng xã hội"} isSmaller={isSmallerFooter} />
              <FooterItem text={"Diễn đàn"} isSmaller={isSmallerFooter} />
            </ul>
          </li>
          <li className="footerMenu-item">
            {isSmallerFooter ? (
              <button
                className={`footerItem-button ${
                  visiable[1] ? "footerItem-button--active" : ""
                }`}
                onClick={() => handleOnChange(1)}
              >
                HỖ TRỢ
              </button>
            ) : (
              <div className="footerItem-title">HỖ TRỢ</div>
            )}
            <ul
              className={`footerSubMenu ${
                visiable[1] || !isSmallerFooter ? "" : "none"
              }`}
            >
              <FooterItem
                text={"Tải xuống Driver"}
                isSmaller={isSmallerFooter}
              />
              <FooterItem text={"Hỗ trợ từ xa"} isSmaller={isSmallerFooter} />
              <FooterItem text={"Bảo hành"} isSmaller={isSmallerFooter} />
              <FooterItem
                text={"Địa chỉ trung tâm bảo hành"}
                isSmaller={isSmallerFooter}
              />
            </ul>
          </li>
          <li className="footerMenu-item">
            {isSmallerFooter ? (
              <button
                className={`footerItem-button ${
                  visiable[2] ? "footerItem-button--active" : ""
                }`}
                onClick={() => handleOnChange(2)}
              >
                TIN TỨC
              </button>
            ) : (
              <div className="footerItem-title">TIN TỨC</div>
            )}
            <ul
              className={`footerSubMenu ${
                visiable[2] || !isSmallerFooter ? "" : "none"
              }`}
            >
              <FooterItem text={"Báo chí"} isSmaller={isSmallerFooter} />
              <FooterItem text={"Giải thưởng"} isSmaller={isSmallerFooter} />
              <FooterItem text={"Videos"} isSmaller={isSmallerFooter} />
              <FooterItem text={"Tin tức"} isSmaller={isSmallerFooter} />
            </ul>
          </li>
          <li className="footerMenu-item">
            {isSmallerFooter ? (
              <button
                className={`footerItem-button ${
                  visiable[3] ? "footerItem-button--active" : ""
                }`}
                onClick={() => handleOnChange(3)}
              >
                TRUYỀN THÔNG
              </button>
            ) : (
              <div className="footerItem-title">TRUYỀN THÔNG</div>
            )}
            <ul
              className={`footerSubMenu ${
                visiable[3] || !isSmallerFooter ? "" : "none"
              }`}
            >
              <FooterItem
                text={"Tài liệu báo chí"}
                isSmaller={isSmallerFooter}
              />
              <FooterItem text={"Hỗ trợ từ xa"} isSmaller={isSmallerFooter} />
              <FooterItem text={"Bảo hành"} isSmaller={isSmallerFooter} />
              <FooterItem
                text={"Thông tin cho nhà đầu tư"}
                isSmaller={isSmallerFooter}
              />
            </ul>
          </li>
          <li className="footerMenu-item">
            {isSmallerFooter ? (
              <button
                className={`footerItem-button ${
                  visiable[4] ? "footerItem-button--active" : ""
                }`}
                onClick={() => handleOnChange(4)}
              >
                VỀ DOANH NGHIỆP
              </button>
            ) : (
              <div className="footerItem-title">VỀ DOANH NGHIỆP</div>
            )}
            <ul
              className={`footerSubMenu ${
                visiable[4] || !isSmallerFooter ? "" : "none"
              }`}
            >
              <FooterItem
                text={"Cẩm nang Sản phẩm"}
                isSmaller={isSmallerFooter}
              />
              <FooterItem text={"Hình nền"} isSmaller={isSmallerFooter} />
              <FooterItem
                text={"Ứng dụng của MSI"}
                isSmaller={isSmallerFooter}
              />
              <FooterItem
                text={"Tính công suất PSU"}
                isSmaller={isSmallerFooter}
              />
            </ul>
          </li>
        </ul>
      </nav>
      <div className="footer-container2">
        <div className="left-content">
          <h3 className="company-title">CÔNG TY MULTIPLE K</h3>
          <p className="text-footer2">© 2025 Công Ty Multiple K</p>
          <p className="text-footer2">
            Giấy chứng nhận đăng ký: xxxxxxxxxx do Sở KH-ĐT TP.HCM cấp lần đầu
            ngày DD tháng MM năm YYYY
          </p>
          <p className="text-footer2">
            Website này thuộc quyền sở hữu của Công ty Multiple K
          </p>
        </div>

        {/* Phần thông tin liên hệ bên phải */}
        <div className="contact-info">
          <p>
            <span className="address-label">Địa chỉ trụ sở: </span>
            <span className="address-line">
              268 Lý Thường Kiệt, Phường 14, Quận 10, TPHCM
            </span>
          </p>

          <p>
            <span className="address-label">Hotline: </span>
            <span className="address-line">1900 0000</span>
          </p>
          <p>
            <span className="address-label">Email: </span>
            <span className="address-line">contact@multiplek.com</span>
          </p>
          <nav className="social-links" aria-label="Mạng xã hội">
            <a href="https://instagram.com/multiplek" aria-label="Theo dõi Multiple K trên Instagram" target="_blank" rel="noopener noreferrer">
              <IoLogoInstagram className="social-icon" aria-hidden="true" />
            </a>
            <a href="https://facebook.com/multiplek" aria-label="Theo dõi Multiple K trên Facebook" target="_blank" rel="noopener noreferrer">
              <IoLogoFacebook className="social-icon" aria-hidden="true" />
            </a>
            <a href="https://twitter.com/multiplek" aria-label="Theo dõi Multiple K trên Twitter" target="_blank" rel="noopener noreferrer">
              <IoLogoTwitter className="social-icon" aria-hidden="true" />
            </a>
          </nav>
        </div>

        {/* Certification badges */}
        <div className="badges-section" role="img" aria-label="Chứng nhận và bảo vệ">
          <img
            src="/da-dang-ky.png"
            alt="Đã đăng ký với Bộ Công Thương - Chứng nhận website thương mại điện tử"
            className="verified-badge"
            loading="lazy"
          />
          <img
            src="/dmca.png"
            alt="DMCA Protected - Bảo vệ bản quyền nội dung"
            className="dmca-badge"
            loading="lazy"
          />
        </div>
      </div>
    </footer>
  );
}
