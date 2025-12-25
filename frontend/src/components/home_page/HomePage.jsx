import {
  faBattery,
  faDesktop,
  faHardDrive,
  faLaptop,
  faMemory,
  faMicrochip,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import productService from "../../services/productServices";
import { useSEO, SEO_CONFIG } from "../../hooks/useSEO";
import { NextArrow, PrevArrow } from "./CustomArrow";
import style from "./HomePage.module.css";

/**
 * Slide image component with proper alt text for SEO
 * Alt text describes the promotional content for accessibility and search engines
 */
function SlideImage({ srcBg, srcLap, srcTitle, altBg, altLap, altTitle }) {
  return (
    <figure className={style.slideImage} role="group" aria-label="Laptop promotion slide">
      <img
        src={srcBg}
        alt={altBg}
        loading="lazy"
      />
      <div className={style.backgroundSlide}>
        <img
          className={style.backgroundSlideLap}
          src={srcLap}
          alt={altLap}
          loading="lazy"
        />
        <img
          className={style.backgroundSlideTitle}
          src={srcTitle}
          alt={altTitle}
          loading="lazy"
        />
      </div>
    </figure>
  );
}

/**
 * Product card grid displaying newest laptops
 * Each product has proper alt text and semantic structure
 */
function NewestLap({ products }) {
  return (
    <Row xs={1} sm={2} lg={3} xl={4} className="g-4" role="list" aria-label="Danh sách laptop mới nhất">
      {products.map((product, idx) => (
        <Col key={product.id || idx} role="listitem">
          <NavLink
            to={`/products/detail/${product.id}`}
            className="text-decoration-none"
            aria-label={`Xem chi tiết ${product.name}`}
          >
            <Card className={`${style.customCard} card`} as="article">
              <Card.Img
                variant="top"
                src={product.images[0].base64}
                alt={`Laptop ${product.name} - ${product.brand} với CPU ${product.cpu}`}
                loading="lazy"
              />
              <Card.Body style={{ minHeight: 100 }}>
                <Card.Title as="h3" className="text-center">{product.name}</Card.Title>
                <div className="text-primary fw-bold text-center">
                  {product.price ? (
                    <>
                      <p className="old-price mb-1" aria-label="Giá gốc">
                        {(Number(product.price) + 2000000).toLocaleString("vi-VN")}₫
                      </p>
                      <p className="new-price mb-0" aria-label="Giá khuyến mãi">
                        {Number(product.price).toLocaleString("vi-VN")}₫
                      </p>
                    </>
                  ) : (
                    <span>Liên hệ</span>
                  )}
                </div>
                <ul className={style.box} aria-label="Thông số kỹ thuật">
                  <li>
                    <FontAwesomeIcon icon={faMicrochip} className="ms-2" aria-hidden="true" />
                    <span className="visually-hidden">CPU: </span>
                    {product.cpu}
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faMemory} className="ms-2" aria-hidden="true" />
                    <span className="visually-hidden">RAM: </span>
                    {product.ram} RAM
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faHardDrive} className="ms-2" aria-hidden="true" />
                    <span className="visually-hidden">Ổ cứng: </span>
                    {product.storage}
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faBattery} className="ms-2" aria-hidden="true" />
                    <span className="visually-hidden">Pin: </span>
                    {product.pin}
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faLaptop} className="ms-2" aria-hidden="true" />
                    <span className="visually-hidden">Thương hiệu: </span>
                    {product.brand}
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faDesktop} className="ms-2" aria-hidden="true" />
                    <span className="visually-hidden">Card đồ họa: </span>
                    {product.graphic_card}
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </NavLink>
        </Col>
      ))}
    </Row>
  );
}

export default function HomePage() {
  // Apply SEO settings for homepage
  useSEO(SEO_CONFIG.home);

  const [products, setProducts] = useState([]);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productService.getFilteredProducts(1, 4, "");
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Fetch failed:", err.response?.status, err.response?.data);
    }
  };

  // Slide data with descriptive alt text for each promotional image
  const list_slide = [
    {
      srcBg: "/images/kv-lg.jpg",
      srcLap: "/images/kv-Crosshair-15-B12U.png",
      srcTitle: "/images/kv-Crosshair-15.png",
      altBg: "Nền quảng cáo laptop gaming MSI Crosshair 15",
      altLap: "Laptop MSI Crosshair 15 B12U - Laptop gaming hiệu năng cao",
      altTitle: "Logo dòng sản phẩm MSI Crosshair 15",
    },
    {
      srcBg: "/images/kv-bg-xs.jpg",
      srcLap: "/images/kv-pd.png",
      srcTitle: "/images/kv-name.png",
      altBg: "Nền quảng cáo laptop MSI Prestige series",
      altLap: "Laptop MSI Prestige - Laptop doanh nhân mỏng nhẹ",
      altTitle: "Logo dòng sản phẩm MSI Prestige",
    },
    {
      srcBg: "/images/kv-top-bg.jpg",
      srcLap: "/images/kv-nb.png",
      srcTitle: "/images/kv-titan-18-hx-name.png",
      altBg: "Nền quảng cáo laptop MSI Titan 18 HX",
      altLap: "Laptop MSI Titan 18 HX - Laptop gaming cao cấp màn hình 18 inch",
      altTitle: "Logo dòng sản phẩm MSI Titan 18 HX",
    },
  ];

  return (
    <main className={style.homePage}>
      {/* Hero section with promotional slider */}
      <section className={style.hpSection1} aria-label="Chương trình khuyến mãi">
        <Slider {...settings}>
          {list_slide.map((slide, index) => (
            <SlideImage key={index} {...slide} />
          ))}
        </Slider>
      </section>

      {/* Featured products section */}
      <section className={style.hpSection2} aria-labelledby="newest-laptops-heading">
        <header className={style.titleSection2}>
          <h1 id="newest-laptops-heading" className="text-center fw-bold">
            Những Mẫu Laptop Mới Nhất
          </h1>
        </header>
        <div className={style.contentSection2}>
          {products.length > 0 ? (
            <NewestLap products={products} />
          ) : (
            <p role="status" aria-live="polite">Đang tải sản phẩm...</p>
          )}
        </div>
      </section>
    </main>
  );
}
