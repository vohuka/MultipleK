import style from "./HomePage.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container, Row, Col, Card, Carousel, Nav } from "react-bootstrap";
import { NextArrow, PrevArrow } from "./CustomArrow";
import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import {
  faBattery,
  faDesktop,
  faHardDrive,
  faLaptop,
  faMemory,
  faMicrochip,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import productService from "../../services/productServices";

function SlideImage({ srcBg, srcLap, srcTitle }) {
  return (
    <a className={style.slideImage}>
      <img src={srcBg} alt="bg" />
      <div className={style.backgroundSlide}>
        <img className={style.backgroundSlideLap} src={srcLap} alt="laptop" />

        <img
          className={style.backgroundSlideTitle}
          src={srcTitle}
          alt="title"
        />
      </div>
    </a>
  );
}

function NewestLap({ products }) {
  return (
    <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
      {products.map((product, idx) => (
        <Col key={idx}>
          <NavLink
            to={`/products/detail/${product.id}`}
            className="text-decoration-none"
          >
            <Card className={`${style.customCard} card`}>
              <Card.Img variant="top" src={product.images[0].base64} />
              <Card.Body style={{ minHeight: 100 }}>
                <Card.Title className="text-center">{product.name}</Card.Title>
                <Card.Text>
                  <h4 className="text-primary fw-bold text-center">
                    {Number(product.price).toLocaleString("vi-VN")} đ
                  </h4>
                  <div className={style.box}>
                    <p>
                      <FontAwesomeIcon icon={faMicrochip} className="ms-2" />{" "}
                      {product.cpu}{" "}
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faMemory} className="ms-2" />{" "}
                      {product.ram} RAM
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faHardDrive} className="ms-2" />{" "}
                      {product.storage}
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faBattery} className="ms-2" />{" "}
                      {product.pin}
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faLaptop} className="ms-2" />{" "}
                      {product.brand}
                    </p>
                    <p>
                      <FontAwesomeIcon icon={faDesktop} className="ms-2" />{" "}
                      {product.graphic_card}
                    </p>
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </NavLink>
        </Col>
      ))}
    </Row>
  );
}

export default function HomePage() {
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
  const fetchProducts = async () => {
    try {
      const res = await productService.getFilteredProducts(1, 8, null)
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Fetch failed:", err.response?.status, err.response?.data); // Log status và message từ server
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const list_slide = [
    {
      srcBg: "/images/kv-lg.jpg",
      srcLap: "/images/kv-Crosshair-15-B12U.png",
      srcTitle: "/images/kv-Crosshair-15.png",
    },
    {
      srcBg: "/images/kv-bg-xs.jpg",
      srcLap: "/images/kv-pd.png",
      srcTitle: "/images/kv-name.png",
    },
    {
      srcBg: "/images/kv-top-bg.jpg",
      srcLap: "/images/kv-nb.png",
      srcTitle: "/images/kv-titan-18-hx-name.png",
    },
  ];
  return (
    <div className={style.homePage}>
      <div className={style.hpSection1}>
        <Slider {...settings}>
          {list_slide.map((slide, index) => (
            <SlideImage key={index} {...slide} />
          ))}
        </Slider>
      </div>
      <div className={style.hpSection2}>
        <div className={`${style.titleSection2} `}>
          <h1 className="text-center fw-bold">Những Mẫu Laptop Mới Nhất</h1>
        </div>
        <div className={style.contentSection2}>
          {products.length > 0 ? (
            <NewestLap products={products} />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
