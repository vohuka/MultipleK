FROM php:8.2-apache

WORKDIR /var/www/html

# Update system packages to fix vulnerabilities
RUN apt-get update && apt-get upgrade -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install necessary PHP extensions and other dependencies
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Allow .htaccess override
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

COPY . .

RUN mkdir -p uploads/img \
    && chown -R www-data:www-data uploads \
    && chmod -R 755 uploads

EXPOSE 80