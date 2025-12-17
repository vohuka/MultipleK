FROM php:8.2-apache

WORKDIR /var/www/html

# Update system packages and install required tools
RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y git unzip zip libzip-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install necessary PHP extensions and other dependencies
RUN docker-php-ext-install pdo pdo_mysql mysqli zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Allow .htaccess override
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Copy composer files first for better caching
COPY composer.json composer.lock* ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction || true

# Copy the rest of the application
COPY . .

RUN mkdir -p uploads/img \
    && chown -R www-data:www-data uploads \
    && chmod -R 755 uploads

EXPOSE 80