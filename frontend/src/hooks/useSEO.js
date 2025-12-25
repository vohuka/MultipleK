import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook for managing SEO-related document updates
 * Handles dynamic title, meta description, and canonical URL per route
 *
 * @param {Object} options - SEO configuration options
 * @param {string} options.title - Page title
 * @param {string} options.description - Meta description
 * @param {string} options.canonical - Canonical URL (optional, defaults to current path)
 * @param {string} options.ogImage - Open Graph image URL (optional)
 */
export function useSEO({ title, description, canonical, ogImage }) {
  const location = useLocation();
  const baseUrl = 'https://multiplek.com';
  const defaultOgImage = `${baseUrl}/logo/logoAI.webp`;

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
      updateMetaTag('property', 'og:title', title);
      updateMetaTag('name', 'twitter:title', title);
    }

    // Update meta description
    if (description) {
      updateMetaTag('name', 'description', description);
      updateMetaTag('property', 'og:description', description);
      updateMetaTag('name', 'twitter:description', description);
    }

    // Update canonical URL
    const canonicalUrl = canonical || `${baseUrl}${location.pathname}`;
    updateLinkTag('canonical', canonicalUrl);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('name', 'twitter:url', canonicalUrl);

    // Update OG image if provided
    if (ogImage) {
      updateMetaTag('property', 'og:image', ogImage);
      updateMetaTag('name', 'twitter:image', ogImage);
    }
  }, [title, description, canonical, ogImage, location.pathname]);
}

/**
 * Helper function to update or create meta tags
 */
function updateMetaTag(attribute, name, content) {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Helper function to update link tags (e.g., canonical)
 */
function updateLinkTag(rel, href) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

/**
 * SEO configuration for each route
 * Import and use in components: useSEO(SEO_CONFIG.home)
 */
export const SEO_CONFIG = {
  home: {
    title: 'Multiple K - Laptop & PC Chính Hãng | Đa Dạng Thương Hiệu, Giá Tốt',
    description: 'Cửa hàng laptop chính hãng Multiple K - Đa dạng thương hiệu MSI, ASUS, Dell, HP. Giá tốt nhất thị trường, bảo hành uy tín, giao hàng toàn quốc.'
  },
  products: {
    title: 'Sản Phẩm Laptop - Multiple K | Laptop Gaming, Văn Phòng, Đồ Họa',
    description: 'Khám phá bộ sưu tập laptop gaming, văn phòng, đồ họa tại Multiple K. Lọc theo thương hiệu, CPU, RAM, card đồ họa. Giá tốt, bảo hành chính hãng.'
  },
  introduction: {
    title: 'Giới Thiệu Multiple K - Về Chúng Tôi | Dịch Vụ Một Chạm',
    description: 'Tìm hiểu về công ty Multiple K - Dịch vụ một chạm, cam kết bền vững, hỗ trợ khách hàng 24/7. Địa chỉ: 268 Lý Thường Kiệt, Q.10, TP.HCM.'
  },
  community: {
    title: 'Cộng Đồng Multiple K - Chia Sẻ & Đánh Giá Sản Phẩm',
    description: 'Tham gia cộng đồng Multiple K - Chia sẻ kinh nghiệm sử dụng laptop, đánh giá sản phẩm, nhận tư vấn từ chuyên gia.'
  },
  questions: {
    title: 'Hỏi Đáp - Multiple K | Giải Đáp Thắc Mắc Về Laptop',
    description: 'Giải đáp thắc mắc về laptop, bảo hành, đặt hàng tại Multiple K. Đội ngũ tư vấn chuyên nghiệp, phản hồi nhanh chóng.'
  },
  contact: {
    title: 'Liên Hệ Multiple K - Hotline 1900 0000 | Địa Chỉ & Email',
    description: 'Thông tin liên hệ Multiple K - Hotline 1900 0000, email contact@multiplek.com. Địa chỉ: 268 Lý Thường Kiệt, Phường 14, Quận 10, TP.HCM.'
  },
  cart: {
    title: 'Giỏ Hàng - Multiple K',
    description: 'Xem giỏ hàng và thanh toán đơn hàng laptop tại Multiple K. Giao hàng nhanh, thanh toán an toàn.'
  },
  login: {
    title: 'Đăng Nhập - Multiple K',
    description: 'Đăng nhập tài khoản Multiple K để quản lý đơn hàng và nhận ưu đãi đặc biệt.'
  },
  register: {
    title: 'Đăng Ký Tài Khoản - Multiple K',
    description: 'Đăng ký tài khoản Multiple K để mua sắm laptop dễ dàng và nhận nhiều ưu đãi hấp dẫn.'
  }
};

/**
 * Generate dynamic SEO config for product detail page
 */
export function getProductSEO(product) {
  if (!product) return SEO_CONFIG.products;

  return {
    title: `${product.name} - Multiple K | Laptop Chính Hãng`,
    description: `Mua ${product.name} chính hãng tại Multiple K. CPU: ${product.cpu || 'N/A'}, RAM: ${product.ram || 'N/A'}, Ổ cứng: ${product.storage || 'N/A'}. Giá: ${Number(product.price || 0).toLocaleString('vi-VN')}₫. Bảo hành uy tín.`,
    ogImage: product.images?.[0]?.base64 || undefined
  };
}

export default useSEO;
