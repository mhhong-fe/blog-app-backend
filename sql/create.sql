-- 创建用户表
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    -- 用户ID，主键，自增  
    user_name VARCHAR(50) NOT NULL UNIQUE,
    -- 用户名，非空且唯一  
    user_password VARCHAR(255) NOT NULL,
    -- 密码，非空  
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
desc articles;
-- 创建分类表
CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    category_desc VARCHAR(100) NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- 创建文章表
CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- 唯一标识，每个博客文章的自增 ID
    title VARCHAR(255) NOT NULL,
    -- 文章标题，最大长度为 255 字符
    content MEDIUMTEXT NOT NULL,
    -- 文章内容，存储中大型文本
    article_desc VARCHAR(100),
    author VARCHAR(100) NOT NULL,
    -- 作者名称，最大长度为 100 字符
    category_id INT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- 文章创建时间，默认值为当前时间
    updated_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- 文章更新时间
    view_count INT DEFAULT 0 -- 浏览次数，初始为 0
);
ALTER TABLE articles
MODIFY author VARCHAR(100) NULL;