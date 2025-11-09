<?php
// config/config.php
define('DB_HOST', $_ENV['DB_HOST'] ?? 'localhost');
define('DB_USER', $_ENV['DB_USER'] ?? 'root');
define('DB_PASS', $_ENV['DB_PASS'] ?? '');
define('DB_NAME', $_ENV['DB_NAME'] ?? 'mk_web');
define('BASE_URL', $_ENV['BASE_URL'] ?? 'http://localhost/backend');
define('JWT_SECRET', $_ENV['JWT_SECRET'] ?? 'KhangLaDanEmCuaKhanh');
