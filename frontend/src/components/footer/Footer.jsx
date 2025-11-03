import { useState } from "react";
import "./Footer.css";
import { useMediaQuery } from "react-responsive";
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from "react-icons/io";

function FooterItem({ text, link, isSmaller }) {
  return (
    <li
      className={`py-2 ${
        isSmaller ? "footerSubMenuExpand" : "footerSubMenu-item"
      }`}
    >
      <a href="" className="" target="_self">
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
          <div className="social-links">
            <IoLogoInstagram className="social-icon"></IoLogoInstagram>
            <IoLogoFacebook className="social-icon"></IoLogoFacebook>
            <IoLogoTwitter className="social-icon"></IoLogoTwitter>
          </div>
        </div>

        {/* 2 hình bên phải (từ folder public) */}
        <div className="badges-section">
          {/* Hình 1: Giả sử là logo verified badge, đường dẫn từ public */}
          <img
            src="/da-dang-ky.png"
            alt="Verified Badge"
            className="verified-badge"
          />

          {/* Hình 2: Giả sử là logo DMCA, đường dẫn từ public */}
          <img src="/dmca.png" alt="DMCA Protected" className="dmca-badge" />
        </div>
      </div>
    </footer>
  );
}
