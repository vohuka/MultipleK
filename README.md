# HukaStore 🚀

## 🌐 Chọn Ngôn Ngữ / Language  
- **[English](#english-content)** (Mặc định / Default)  
- **[Tiếng Việt](#vietnamese-content)**  

<details open>
<summary>🇬🇧 English Content (Click to toggle)</summary>

---

## 📖 Introduction  
HukaStore is a modern e-commerce platform built to manage products, orders, and users seamlessly. With a robust PHP and MySQL backend, combined with a dynamic ReactJS/TypeScript frontend, the project delivers a user-friendly experience and high performance.  

This project is suitable for small to medium online stores, easy to customize and scale.  

**Key Features:**  
- Product and inventory management.  
- Order and basic payment processing.  
- Responsive UI with React.  
- Real-time MySQL database integration.  

---

## 🛠️ Tech Stack  
The project uses the following technologies for stability and modernity:  

| Technology | Description | Badge |
|------------|-------------|-------|
| **PHP** | Backend server-side logic | ![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white) |
| **ReactJS** | Frontend UI framework | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) |
| **TypeScript** | Typed JavaScript for safe code | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) |
| **MySQL** | Relational database | ![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white) |
| **XAMPP** | Local development environment | ![XAMPP](https://img.shields.io/badge/XAMPP-FDFEFE?style=for-the-badge&logo=xampp&logoColor=FF6900) |

---

## 📋 Requirements (Prerequisites)  
Before starting, ensure you have:  
- **XAMPP** (latest version) – Download from [apachefriends.org](https://www.apachefriends.org/).  
- **Node.js** and **npm** (LTS version) – Download from [nodejs.org](https://nodejs.org/).  
- A Windows machine (or XAMPP-compatible).  
- Basic Git knowledge (to clone the repo).  

---

## 🚀 Installation & Running Guide  

### Step 1: Clone Repository  
```bash
git clone https://github.com/vohuka/HukaStore.git
cd HukaStore
```

### Step 2: Install XAMPP  
- Download and install XAMPP from the [official site](https://www.apachefriends.org/download.html).  
- Use the default installation folder (usually `C:\xampp`).  

### Step 3: Configure Apache (httpd.conf)  
- Open `C:\xampp\apache\conf\httpd.conf` in Notepad (run as Admin).  
- Find and edit the following lines (replace `C:/path/to/your/HukaStore` with your actual project path):  
    ```
    DocumentRoot "C:/path/to/your/HukaStore"
    <Directory "C:/path/to/your/HukaStore">
    ```
- Save and restart XAMPP if needed.  

### Step 4: Start Services  
- Open XAMPP Control Panel.  
- Start **Apache** and **MySQL** (click Start).  
- Access `http://localhost` to verify (should see XAMPP default page).  

**💡 Tip:** If port errors (80 or 3306), change ports in XAMPP settings.  

### Step 5: Install and Run Frontend (React)  
- Navigate to frontend folder:  
    ```bash
    cd frontend
    ```  
- Install dependencies:  
    ```bash
    npm install
    ```  
- Run dev server:  
    ```bash
    npm run dev
    ```  
- Open browser and go to `http://localhost:5173` (or Vite's displayed port).  

### Step 6: Setup Database (MySQL)  
- Open phpMyAdmin: `http://localhost/phpmyadmin`.  
- Create new database named `hukastore` (or as per PHP config).  
- Import SQL schema if available (from `database/schema.sql` in repo).  
- Update credentials in PHP config file (e.g., `config/database.php`).  

---

## 🔄 Running the Project  
- **Backend (PHP):** Access `http://localhost/` (Apache serves PHP files).  
- **Frontend (React):** Run `npm run dev` and access Vite port.  
- **Database:** Manage via phpMyAdmin.  

**Useful Commands:**  
- Production build: `npm run build` (in frontend).  
- Restart services: Stop and Start in XAMPP.  

---

## 🐛 Troubleshooting  
- **"Port already in use" error:** Change Apache/MySQL ports in XAMPP.  
- **NPM errors:** Delete `node_modules` and run `npm install` again.  
- **PHP not loading:** Check DocumentRoot in httpd.conf.  
- **MySQL connection failed:** Verify default username/password (`root` / empty).  

If issues persist, open a GitHub issue or check XAMPP logs.  

---

## 🤝 Contributing  
We welcome contributions!  
1. Fork the repo.  
2. Create a new branch (`git checkout -b feature/amazing-feature`).  
3. Commit changes (`git commit -m 'Add amazing feature'`).  
4. Push to branch (`git push origin feature/amazing-feature`).  
5. Open a Pull Request.  

**Code of Conduct:** Be respectful and supportive!  

---

## 📄 License  
This project is licensed under the [MIT License](LICENSE).  

---

## 🙏 Thanks  
Thanks for checking out HukaStore! If helpful, ⭐ the repo.  

**Contact:** [khangvh.work@gmail.com](mailto:khangvh.work@gmail.com)

*(Updated 2025)*

</details>

<details>
<summary>Tiếng Việt Content (Click to toggle)</summary>

---

## 📖 Giới thiệu  
HukaStore là một nền tảng thương mại điện tử hiện đại, được xây dựng để quản lý sản phẩm, đơn hàng và người dùng một cách mượt mà. Với backend mạnh mẽ dựa trên PHP và MySQL, kết hợp frontend ReactJS/TypeScript năng động, dự án mang đến trải nghiệm người dùng thân thiện và hiệu suất cao.  

Dự án phù hợp cho các cửa hàng trực tuyến nhỏ đến trung bình, dễ dàng tùy chỉnh và mở rộng.  

**Tính năng chính:**  
- Quản lý sản phẩm và kho hàng.  
- Xử lý đơn hàng và thanh toán cơ bản.  
- Giao diện responsive với React.  
- Tích hợp database MySQL cho dữ liệu thời gian thực.  

---

## 🛠️ Tech Stack  
Dự án sử dụng các công nghệ sau để đảm bảo tính ổn định và hiện đại:  

| Công nghệ | Mô tả | Badge |
|-----------|--------|-------|
| **PHP** | Backend server-side logic | ![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white) |
| **ReactJS** | Frontend UI framework | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) |
| **TypeScript** | Typed JavaScript cho code an toàn | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) |
| **MySQL** | Relational database | ![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white) |
| **XAMPP** | Local development environment | ![XAMPP](https://img.shields.io/badge/XAMPP-FDFEFE?style=for-the-badge&logo=xampp&logoColor=FF6900) |

---

## 📋 Yêu cầu (Prerequisites)  
Trước khi bắt đầu, hãy đảm bảo bạn có:  
- **XAMPP** (phiên bản mới nhất) – Tải tại [apachefriends.org](https://www.apachefriends.org/).  
- **Node.js** và **npm** (phiên bản LTS) – Tải tại [nodejs.org](https://nodejs.org/).  
- Máy tính chạy Windows (hoặc tương thích với XAMPP).  
- Kiến thức cơ bản về Git (để clone repo).  

---

## 🚀 Hướng dẫn Cài đặt & Chạy Dự Án  

### Bước 1: Clone Repository  
```bash
git clone https://github.com/vohuka/HukaStore.git
cd HukaStore
```

### Bước 2: Cài đặt XAMPP  
- Tải và cài đặt XAMPP từ [trang chính thức](https://www.apachefriends.org/download.html).  
- Chọn thư mục cài đặt mặc định (thường là `C:\xampp`).  

### Bước 3: Cấu hình Apache (httpd.conf)  
- Mở file `C:\xampp\apache\conf\httpd.conf` bằng Notepad (chạy với quyền Admin).  
- Tìm và sửa các dòng sau (thay `C:/path/to/your/HukaStore` bằng đường dẫn thực tế đến thư mục project):  
    ```
    DocumentRoot "C:/path/to/your/HukaStore"
    <Directory "C:/path/to/your/HukaStore">
    ```
- Lưu file và khởi động lại XAMPP nếu cần.  

### Bước 4: Khởi động Services  
- Mở XAMPP Control Panel.  
- Bật **Apache** và **MySQL** (nhấp Start).  
- Truy cập `http://localhost` để kiểm tra (nên thấy trang XAMPP mặc định).  

**💡 Mẹo:** Nếu gặp lỗi port (80 hoặc 3306), thay đổi port trong XAMPP settings.  

### Bước 5: Cài đặt và Chạy Frontend (React)  
- Di chuyển đến thư mục frontend:  
    ```bash
    cd frontend
    ```  
- Cài đặt dependencies:  
    ```bash
    npm install
    ```  
- Chạy development server:  
    ```bash
    npm run dev
    ```  
- Mở trình duyệt và truy cập `http://localhost:5173` (hoặc port Vite hiển thị).  

### Bước 6: Thiết lập Database (MySQL)  
- Mở phpMyAdmin: `http://localhost/phpmyadmin`.  
- Tạo database mới tên `hukastore` (hoặc theo config trong code PHP).  
- Import schema SQL nếu có (từ file `database/schema.sql` trong repo).  
- Cập nhật credentials trong file config PHP (ví dụ: `config/database.php`).  

---

## 🔄 Chạy Dự Án  
- **Backend (PHP):** Truy cập `http://localhost/` (Apache sẽ serve files PHP).  
- **Frontend (React):** Chạy `npm run dev` và truy cập port Vite.  
- **Database:** Kết nối qua phpMyAdmin để quản lý dữ liệu.  

**Lệnh hữu ích:**  
- Build production: `npm run build` (trong frontend).  
- Restart services: Dừng và Start lại trong XAMPP.  

---

## 🐛 Troubleshooting  
- **Lỗi "Port already in use":** Thay đổi port Apache/MySQL trong XAMPP.  
- **NPM errors:** Xóa `node_modules` và chạy `npm install` lại.  
- **PHP không load:** Kiểm tra DocumentRoot trong httpd.conf.  
- **MySQL connection failed:** Kiểm tra username/password mặc định (`root` / empty).  

Nếu gặp vấn đề, mở issue trên GitHub hoặc kiểm tra logs trong XAMPP.  

---

## 🤝 Đóng Góp (Contributing)  
Chúng tôi hoan nghênh contributions!  
1. Fork repo.  
2. Tạo branch mới (`git checkout -b feature/amazing-feature`).  
3. Commit changes (`git commit -m 'Add amazing feature'`).  
4. Push lên branch (`git push origin feature/amazing-feature`).  
5. Mở Pull Request.  

**Code of Conduct:** Hãy tôn trọng và hỗ trợ lẫn nhau!  

---

## 📄 License  
Dự án này được cấp phép theo [MIT License](LICENSE).  

---

## 🙏 Cảm ơn  
Cảm ơn bạn đã quan tâm đến HukaStore! Nếu hữu ích, hãy ⭐ repo nhé.  

**Liên hệ:** [khangvh.work@gmail.com](mailto:khangvh.work@gmail.com)

*(Cập nhật năm 2025)*

</details>
```
