-- Create the database if it doesn't exist
CREATE DATABASE news_db;

-- Connect to the database
\c news_db;

-- Create enum type for categories
CREATE TYPE category AS ENUM (
    'Education',
    'Economy',
    'Finance',
    'Weather',
    'Culture',
    'Fashion',
    'Entertainment',
    'Politics',
    'Health',
    'Sports',
    'Technology'
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    category category NOT NULL,
    date DATE DEFAULT CURRENT_DATE
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    Education NUMERIC DEFAULT 0,
    Economy NUMERIC DEFAULT 0,
    Finance NUMERIC DEFAULT 0,
    Weather NUMERIC DEFAULT 0,
    Culture NUMERIC DEFAULT 0,
    Fashion NUMERIC DEFAULT 0,
    Entertainment NUMERIC DEFAULT 0,
    Politics NUMERIC DEFAULT 0,
    Health NUMERIC DEFAULT 0,
    Sports NUMERIC DEFAULT 0,
    Technology NUMERIC DEFAULT 0
);

-- Insert some sample data
INSERT INTO news (title, summary, category) VALUES
('New Educational Policy Announced', 'The government announces new educational reforms...', 'Education'),
('Stock Market Hits Record High', 'The stock market reached unprecedented levels...', 'Finance'),
('Latest Weather Forecast', 'Meteorologists predict heavy rainfall...', 'Weather'),
('Tech Giant Launches New Product', 'A major technology company unveils...', 'Technology'),
('Healthcare Innovation', 'Breakthrough in medical research...', 'Health');

-- Insert initial categories record
INSERT INTO categories (id) VALUES (1); 