<?php
// config/config.php
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'mk_web');
define('BASE_URL', getenv('BASE_URL') ?: 'http://localhost/backend');
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'KhangLaDanEmCuaKhanh');
