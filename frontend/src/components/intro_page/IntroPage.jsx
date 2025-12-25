import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styles from "./IntroPage.module.css";
import { useSEO, SEO_CONFIG } from "../../hooks/useSEO";

// Import images
import introHeader from "../../assets/img/Intro/intro_header.png";
import introHeaderXs from "../../assets/img/Intro/kv-about-index-xs.jpg";
import introService from "../../services/introServices";
import { BASE_URL } from "../../services/api";

/**
 * IntroPage component - Company introduction/about page
 * SEO optimized with proper headings, alt text, and semantic structure
 */
export default function IntroPage() {
  // Apply SEO settings for introduction page
  useSEO(SEO_CONFIG.introduction);

  const [introData, setIntroData] = useState({
    company_overview: {},
    about_us: {},
    one_step_service: {},
    sustainability: {},
    contact_us: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIntroData = async () => {
      try {
        const res = await introService.getIntroContent();

        if (res.status === "success") {
          const organizedData = res.data.reduce((acc, item) => {
            acc[item.section_key] = item;
            return acc;
          }, {});
          setIntroData(organizedData);
        } else {
          throw new Error("Failed to fetch intro data");
        }
      } catch (err) {
        console.error("Error fetching intro data: ", err);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchIntroData();
  }, [loading]);

  if (loading) {
    return (
      <div className="text-center p-5" role="status" aria-live="polite">
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-5 text-danger" role="alert">
        {error}
      </div>
    );
  }

  function isLoading() {
    return "Đang tải nội dung ...";
  }

  return (
    <main className={styles.introMain}>
      {/* Hero section with banner */}
      <section className={styles.aboutHeader} aria-labelledby="intro-heading">
        <div className={styles.introHeader}>
          <picture>
            <source media="(min-width: 992px)" srcSet={introHeader} />
            <img
              className={styles.introImgHeader}
              src={introHeaderXs}
              alt="Banner giới thiệu công ty Multiple K - Không gian làm việc hiện đại"
              loading="eager"
            />
          </picture>
          <h1 id="intro-heading" className={styles.introHeaderText}>
            VỀ MK
          </h1>
        </div>

        {/* Company overview section */}
        <section className={styles.description} aria-labelledby="overview-title">
          <div className="commonContainer text-center">
            <h2 id="overview-title" className={styles.descriptionTitle}>
              {introData.company_overview?.title || "Tổng quan về công ty"}
            </h2>
            <p className={styles.descriptionText}>
              {introData.company_overview?.content || isLoading()}
            </p>
          </div>
        </section>

        {/* Service cards section */}
        <section className="commonContainer" aria-label="Các dịch vụ của chúng tôi">
          <div className={`${styles.introCard} row`}>
            {/* About Us Card */}
            <article className="col-lg-4">
              <div>
                <h3 className={`${styles.introCardTitle} text-center`}>
                  {introData.about_us?.title || "Về chúng tôi"}
                </h3>
                <figure>
                  <img
                    className={styles.introCardImg}
                    src={`${BASE_URL}/${introData.about_us?.image_path}`}
                    alt={`Hình ảnh minh họa: ${introData.about_us?.title || "Về chúng tôi"} - Đội ngũ Multiple K`}
                    loading="lazy"
                  />
                </figure>
                <p className={styles.introCardText}>
                  {introData.about_us?.content || isLoading()}
                </p>
              </div>
            </article>

            {/* One-Step Service Card */}
            <article className="col-lg-4">
              <div>
                <h3 className={`${styles.introCardTitle} text-center`}>
                  {introData.one_step_service?.title || "Dịch vụ MỘT CHẠM"}
                </h3>
                <figure>
                  <img
                    className={styles.introCardImg}
                    src={`${BASE_URL}/${introData.one_step_service?.image_path}`}
                    alt={`Hình ảnh minh họa: ${introData.one_step_service?.title || "Dịch vụ một chạm"} - Quy trình nhanh chóng`}
                    loading="lazy"
                  />
                </figure>
                <p className={styles.introCardText}>
                  {introData.one_step_service?.content || isLoading()}
                </p>
              </div>
            </article>

            {/* Sustainability Card */}
            <article className="col-lg-4">
              <div>
                <h3 className={`${styles.introCardTitle} text-center`}>
                  {introData.sustainability?.title || "Bền vững"}
                </h3>
                <figure>
                  <img
                    className={styles.introCardImg}
                    src={`${BASE_URL}/${introData.sustainability?.image_path}`}
                    alt={`Hình ảnh minh họa: ${introData.sustainability?.title || "Phát triển bền vững"} - Cam kết của Multiple K`}
                    loading="lazy"
                  />
                </figure>
                <p className={styles.introCardText}>
                  {introData.sustainability?.content || isLoading()}
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* Contact banner - mobile only */}
        <figure className={styles.contactUsImg} aria-hidden="true">
          <img
            className={`${styles.contactUsImgMobile} d-block d-lg-none`}
            src={`${BASE_URL}/${introData.contact_us?.image_path}`}
            alt="Banner liên hệ Multiple K"
            loading="lazy"
          />
        </figure>

        {/* Contact section */}
        <section className={styles.contactUs} aria-labelledby="contact-title">
          <div className="commonContainer">
            <div className={styles.contactUsBlock}>
              <h2 id="contact-title" className={styles.contactUsTitle}>
                {introData.contact_us?.title || "Liên Hệ"}
              </h2>
              <p className={styles.contactUsText}>
                {introData.contact_us?.content || isLoading()}
              </p>
              <nav className={styles.contactUsLink} aria-label="Liên kết liên hệ">
                <div className={styles.contactUsButton}>
                  <NavLink
                    className={`${styles.supportLink} contactUsLinkSupport`}
                    to="/questions"
                    aria-label="Đến trang hỏi đáp và hỗ trợ"
                  >
                    Hỗ Trợ{" "}
                    <i
                      className={`${styles.contactUsIcon} fa-solid fa-chevron-right`}
                      aria-hidden="true"
                    ></i>
                  </NavLink>
                </div>
                <div className={styles.contactUsButton}>
                  <NavLink
                    className={`${styles.supportLink} contactUsLinkContact`}
                    to="/contact"
                    aria-label="Đến trang thông tin liên hệ"
                  >
                    Liên hệ với chúng tôi{" "}
                    <i
                      className={`${styles.contactUsIcon} fa-solid fa-chevron-right`}
                      aria-hidden="true"
                    ></i>
                  </NavLink>
                </div>
              </nav>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
