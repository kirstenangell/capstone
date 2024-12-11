-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 30, 2024 at 09:52 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

DROP DATABASE IF EXISTS FlackoDB;
CREATE DATABASE IF NOT EXISTS FlackoDB;
USE FlackoDB;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `flackodb`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `price` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `product_id`, `quantity`, `added_at`, `price`) VALUES
(7, 94, 12, 1, '2024-11-26 21:14:13', 0.00),
(8, 94, 13, 1, '2024-11-26 21:25:34', 0.00),
(9, 94, 12, 1, '2024-11-27 08:45:17', 0.00),
(18, 95, 12, 1, '2024-11-27 15:03:55', 1.00),
(19, 95, 9, 1, '2024-11-27 15:04:05', 111.00),
(20, 96, 8, 3, '2024-11-28 06:21:17', 20.00),
(21, 95, 8, 2, '2024-11-29 17:59:29', 20.00),
(22, 95, 9, 1, '2024-11-29 17:59:40', 111.00),
(23, 36, 13, 1, '2024-11-30 10:04:12', 1.00),
(24, 95, 8, 1, '2024-11-30 12:05:02', 20.00),
(25, 95, 8, 1, '2024-11-30 14:29:45', 20.00),
(26, 95, 8, 1, '2024-11-30 14:31:47', 20.00),
(27, 95, 8, 1, '2024-11-30 14:31:52', 20.00),
(28, 95, 8, 1, '2024-11-30 14:34:05', 20.00),
(29, 95, 8, 1, '2024-11-30 14:34:09', 20.00),
(30, 36, 14, 1, '2024-11-30 14:48:57', 123.00),
(31, 36, 14, 1, '2024-11-30 14:52:16', 123.00);

-- --------------------------------------------------------

--
-- Table structure for table `contact_submissions`
--

CREATE TABLE `contact_submissions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_submissions`
--

INSERT INTO `contact_submissions` (`id`, `name`, `email`, `message`, `created_at`) VALUES
(1, 'Joshua Odiamar', 'odiamar.earljoshua@gmail.com', 'Hello it\'s me ', '2024-10-18 17:46:44'),
(2, 'Kirsten Apacible', 'kirstenapacible@gmail.com', 'ice cream yummy', '2024-10-18 17:48:16'),
(3, 'Erica Moulic', 'ericamoulic@gmail.com', 'ice cream good', '2024-10-18 18:00:23');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT NULL,
  `payment_reference` varchar(100) DEFAULT NULL,
  `current_street` varchar(255) DEFAULT NULL,
  `current_barangay` varchar(255) DEFAULT NULL,
  `current_city` varchar(100) DEFAULT NULL,
  `current_region` varchar(255) DEFAULT NULL,
  `current_province` varchar(100) DEFAULT NULL,
  `current_zip` varchar(20) DEFAULT NULL,
  `current_landmark` varchar(255) DEFAULT NULL,
  `new_street` varchar(255) DEFAULT NULL,
  `new_barangay` varchar(255) DEFAULT NULL,
  `new_city` varchar(100) DEFAULT NULL,
  `new_region` varchar(255) DEFAULT NULL,
  `new_province` varchar(100) DEFAULT NULL,
  `new_zip` varchar(20) DEFAULT NULL,
  `new_landmark` varchar(255) DEFAULT NULL,
  `archived` tinyint(1) DEFAULT 0,
  `status` varchar(50) DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `first_name`, `last_name`, `type`, `email`, `phone`, `payment_status`, `payment_reference`, `current_street`, `current_barangay`, `current_city`, `current_region`, `current_province`, `current_zip`, `current_landmark`, `new_street`, `new_barangay`, `new_city`, `new_region`, `new_province`, `new_zip`, `new_landmark`, `archived`, `status`) VALUES
(1, 'Aeri', 'Aeri', 'Online Store', 'juandelacruz@gmail.com', '09620696558', 'Cancelled', '', 'Prima Residences', NULL, 'Quezon City', NULL, 'NCR', '1008', '', '', NULL, '', NULL, '', '', '', 1, 'Active'),
(4, 'Ae', 'Ae', 'Physical Store', 'hello@gmail.com', '09620696558', 'Paid', '', 'Prima Residences', NULL, 'Quezon City', NULL, 'NCR', '1008', '', '', NULL, '', NULL, '', '', '', 1, 'Active'),
(12, 'Berlin', 'Berlin', 'Physical Store', 'berlinrip@gmail.com', '09453678902', 'Pending', '', 'Infina Towers', NULL, 'Quezon City', NULL, 'NCR', '1008', '', '', NULL, '', NULL, '', '', '', 1, 'Active'),
(14, 'Lorraine', 'Lorraine', 'Physical Store', 'lorraine28@gmail.com', '09263789261', 'Cancelled', '', 'Prima Residences', NULL, 'Quezon City', NULL, 'NCR', '1008', '', '', NULL, '', NULL, '', '', '', 1, 'Active'),
(16, 'Pia', 'Pia', 'Physical Store', 'piav@gmail.com', '09245378926', 'Paid', '', 'Prima Residences', NULL, 'Quezon City', NULL, 'NCR', '1008', '', '', NULL, '', NULL, '', '', '', 1, 'Active'),
(20, 'Sierra', 'Sierra', 'Online Store', 'umayna@gmail.com', '0952417892', 'Cancelled', '', 'Prima Residences', NULL, 'Quezon City', NULL, 'NCR', '1008', '', '', NULL, '', NULL, '', '', '', 1, 'Active'),
(21, 'Regi', 'Regi', 'Online Store', 'regi@gmail.com', '09236473891', 'Cancelled', '', '123 Pine Street', 'Tatalon', 'Pasig', 'NCR', 'Metro Manila ', '1011', '', '', '', '', '', '', '', '', 1, 'Active'),
(22, 'ABC', 'Company', 'Online Store', 'nvetus@gmail.com', '09289364751', 'paid', '', 'Prima Residences', NULL, 'Quezon City', NULL, 'Metro Manila ', '1113', '', '', NULL, '', NULL, '', '', '', 0, 'Active'),
(23, 'ronald', 'ronald', 'Online Store', 'ronadl@ust.edu.ph', '09526745321', 'Cancelled', '', 'Prima Residences', 'ABC', 'Quezon City', 'NCR', 'manila', '1008', '', '', '', '', '', '', '', '', 1, 'Active'),
(24, 'Vien', 'Vien', 'Physical Store', 'vien@gmail.com', '09283746192', 'Cancelled', '', 'Prima Residences', 'Tatalon', 'Quezon City', 'NCR', 'NCR', '1008', '', '', '', '', '', '', '', '', 0, 'Active'),
(27, 'a', 'a', 'Physical Store', 'a', 'a', 'a', '', 'qc', 'Tatalon', 'Quezon City', 'NCR', 'NCR', '1008', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contactNumber` varchar(20) DEFAULT NULL,
  `streetName` varchar(255) DEFAULT NULL,
  `barangay` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `zipCode` varchar(10) DEFAULT NULL,
  `deliveryOption` varchar(50) DEFAULT NULL,
  `courier` varchar(50) DEFAULT NULL,
  `paymentOption` varchar(50) DEFAULT NULL,
  `pickUpTime` varchar(50) DEFAULT NULL,
  `pickUpDate` date DEFAULT NULL,
  `products` text NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` varchar(50) NOT NULL DEFAULT 'PENDING',
  `date` date NOT NULL,
  `archived` tinyint(1) DEFAULT 0,
  `newStreet` varchar(255) DEFAULT NULL,
  `newBarangay` varchar(255) DEFAULT NULL,
  `newCity` varchar(255) DEFAULT NULL,
  `newRegion` varchar(255) DEFAULT NULL,
  `newProvince` varchar(255) DEFAULT NULL,
  `newZipCode` varchar(10) DEFAULT NULL,
  `newLandmark` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `firstName`, `lastName`, `email`, `contactNumber`, `streetName`, `barangay`, `city`, `region`, `province`, `zipCode`, `deliveryOption`, `courier`, `paymentOption`, `pickUpTime`, `pickUpDate`, `products`, `price`, `status`, `date`, `archived`, `newStreet`, `newBarangay`, `newCity`, `newRegion`, `newProvince`, `newZipCode`, `newLandmark`) VALUES
(1, 'Regi', 'Vetus', 'regi@gmail.com', '09236473891', 'Flamenco', 'Panghulo', 'Bulacan', 'Region 3', NULL, '3019', 'Via Courier', 'Grab Express', 'GCash', 'N/A', '0000-00-00', '[\"ABC\"]', 0.00, 'ARCHIVED', '2024-11-19', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'Regi', 'N/A', 'regi@gmail.com', '09236473891', 'N/A', 'N/A', 'N/A', 'N/A', NULL, 'N/A', 'Via Courier', 'Lalamove', 'COD', NULL, NULL, '[\"123\"]', 1000.00, 'PENDING', '2024-11-19', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'Regi', 'N/A', 'regi@gmail.com', '09236473891', 'N/A', 'N/A', 'N/A', 'N/A', NULL, 'N/A', 'Via Courier', 'Lalamove', 'COD', NULL, NULL, '[\"123\"]', 1000.00, 'PENDING', '2024-11-19', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'Regi', 'Vetus', 'regi@gmail.com', '09236473891', 'Flamenco', 'Panghulo', 'Bulacan', 'Region 3', NULL, '3019', 'Via Courier', 'Grab Express', 'GCash', 'N/A', '1899-11-29', '[\"ABC\"]', 1000.00, 'PENDING', '2024-11-19', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'Mae', 'Vetus', 'regi@gmail.com', '09236473891', 'Flamenco', 'Panghulo', 'Bulacan', 'Region 3', NULL, '3019', 'Via Courier', 'Grab Express', 'GCash', 'N/A', '1899-11-27', '[\"[\",\"\\\"\",\" \",\"\\\"\",\"A\",\"\\\"\"]', 6000.00, 'PENDING', '2024-11-23', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 'Vien', 'N/A', 'vien@gmail.com', '09283746192', 'Grapes', 'Tatalon', 'Quezon City ', 'NCR', NULL, '3000', 'Via Courier', 'Grab Express', 'GCash', NULL, NULL, '[\"123\"]', 1000.00, 'PENDING', '2024-11-19', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 'Julia', 'Michaels', 'julia@gmail.com', '09283648212', '789 Oak Street', 'Barangay Balagtas', 'Pasig City', 'Metro Manila', NULL, '1600', 'Via Courier', 'Lalamove', 'GCash', '', '1899-11-28', '[\" \"]', 1000.00, 'PENDING', '2024-11-23', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 'Julia', 'Michaels', 'julia@gmail.com', '09283648212', '789 Oak Street', 'Barangay Balagtas', 'Pasig City', 'Metro Manila', NULL, '1600', 'Via Courier', 'Lalamove', 'GCash', '', '0000-00-00', '[\"\"]', 1000.00, 'PENDING', '2024-11-23', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 'Regi', 'Vetus', 'regi@gmail.com', '09236473891', 'Flamenco', 'Panghulo', 'Bulacan', 'Region 3', NULL, '3019', 'Via Courier', 'Grab Express', 'GCash', 'N/A', '1899-11-28', '[\"[\",\"\\\"\",\"A\",\"B\",\"C\",\"\\\"\",\"]\"]', 7000.00, 'PENDING', '2024-11-23', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 'Regi', 'Vetus', 'regi@gmail.com', '09236473891', 'Flamenco', 'Panghulo', 'Bulacan', 'Region 3', NULL, '3019', 'Via Courier', 'Grab Express', 'GCash', 'N/A', '1899-11-28', '[\"[\",\"\\\"\",\"A\",\"B\",\"C\",\"\\\"\",\"]\"]', 7000.00, 'PENDING', '2024-11-23', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 'Nina', 'Vetus', 'hello@gmail.com', '092846283112', 'na', 'a', 'a', 'a', 'N/A', 'a', 'Via Courier', 'Lalamove', 'GCash', '', '1899-11-29', '[\"[\",\"\\\"\",\"a\",\"\\\"\",\"]\"]', 5000.00, 'PENDING', '2024-11-23', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 'Nina', 'Vetus', 'hello@gmail.com', '092846283112', 'a', 'a', 'a', 'a', 'a', 'a', 'Via Courier', 'Lalamove', 'GCash', '', '0000-00-00', '[\"a\"]', 1000.00, 'PENDING', '2024-11-23', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 'Nina', 'NIna', 'nnvetus@gmail.com', '09129395748', 'A', 'A', 'A', 'A', 'A', 'A', 'Via Courier', 'Lalamove', 'GCash', '', '1899-11-26', '[\"]\"]', 1000.00, 'PENDING', '2024-11-23', 0, '123', '', '', '', '', '', NULL),
(15, 'Erica', 'Moulic', 'Moulicericaj@gmail.com', '09163033987', '123', '1eada', 'adadas', 'adad', 'adada', 'adada', 'Via Courier', 'Grab Express', 'GCash', '', '0000-00-00', '[]', 0.00, 'PENDING', '2024-11-23', 0, '', '', '', '', '', '', NULL),
(16, 'User\'s First Name', 'User\'s Last Name', 'User\'s Email', 'User\'s Contact Numbe', 'Street Address', 'Barangay', 'City', 'Region', 'Province', 'Zip Code', 'Delivery Method', NULL, 'Payment Method', NULL, NULL, '[{\"id\":14,\"name\":\"test\",\"type\":\"test\",\"brand\":\"test\",\"category\":\"Amplifier\",\"description\":\"test\",\"image\":\"public/uploads/1732978114244-SubwooferImage.png,public/uploads/1732978114250-AmplifierImage.png,public/uploads/1732978114262-caraudio.png,public/uploads/1732978114266-car.png\",\"price\":\"123.00\",\"discount\":\"123.00\",\"totalPrice\":\"123.00\",\"dimensions\":\"5 x 5 x 5 x 5\",\"color\":\"test\",\"finish\":\"Matte\",\"material\":\"test\",\"model\":\"test\",\"quantity\":0,\"totalQuantity\":5,\"status\":\"5\",\"archived\":0}]', 123.00, 'PENDING', '2024-11-30', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 'Rhea', 'Ceo', 'rhea.ceo.flacko1990@gmail.com', '+639281888695', '3-E West Santiago St. Brgy. Paltok', 'Paltok', 'Quezon City', 'NCR - National Capital Region', 'Metro Manila', '1104', 'pickup', NULL, 'store', '10:00 AM', '2025-01-02', '[{\"name\":\"Muffler\",\"quantity\":1},{\"name\":\"test\",\"quantity\":2}]', 0.00, 'PENDING', '2024-11-30', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 'Kirsten Angel', 'Apacible', 'kirstenapacible@gmail.com', '+639281888695', '3-E West Santiago St. Brgy. Paltok', 'Paltok', 'Quezon City', 'NCR - National Capital Region', 'Metro Manila', '1104', 'courier', 'Grab Express', 'gcash', NULL, '2024-11-30', '[{\"name\":\"nova\",\"quantity\":1},{\"name\":\"motor\",\"quantity\":2},{\"name\":\"motor wheel\",\"quantity\":2}]', 50.00, 'PENDING', '2024-12-01', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) GENERATED ALWAYS AS (`quantity` * `unit_price`) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `unit_price`) VALUES
(1, 16, 14, 1, 123.00),
(2, 17, 13, 1, 1.00),
(3, 17, 14, 2, 123.00),
(4, 18, 12, 1, 1.00),
(5, 18, 9, 2, 111.00),
(6, 18, 8, 2, 20.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `totalPrice` decimal(10,2) NOT NULL DEFAULT 0.00,
  `dimensions` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  `finish` varchar(255) NOT NULL,
  `material` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `quantity` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `totalQuantity` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `status` varchar(50) NOT NULL,
  `archived` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `type`, `brand`, `category`, `description`, `image`, `price`, `discount`, `totalPrice`, `dimensions`, `color`, `finish`, `material`, `model`, `quantity`, `totalQuantity`, `status`, `archived`) VALUES
(3, 'AMEN', 'abc', 'abc', 'abc', 'abac', '/src/assets/wheel1.png', 20.00, 20.00, 20.00, '1 x 1 x 1 x 1', '', 'Matte', '', '', 20, 100, '', 1),
(4, 'FIVE', 'wheel a ', '', 'abc', 'ice cream yummy ', '/src/assets/wheel1.png', 1100.00, 50.00, 1050.00, ' x  x  x ', '', '', '', '', 20, 100, '', 1),
(8, 'motor wheel', 'abc', 'abc', 'abc', 'abac', '[null,null,null,null]', 20.00, 10.00, 10.00, '1 x 1 x 11 x 1', '1', 'Matte', '', '', 32, 100, '', 0),
(9, 'motor', 'abc', 'abc', 'abac', 'ice cream yummy ', '/src/assets/wheel1.png', 111.00, 11.00, 1111.00, '1 x 1 x 1 x 1', '', '', '', '', 0, 1, '1', 0),
(11, '1', '1', '1', '1', '', '/src/assets/wheel1.png', 1111.00, 11.00, 1.00, '1 x 1 x 1 x 1', '1', 'Textured', '', '', 11, 11, '1', 1),
(12, 'nova', '1', '1', '1', '1', '/src/assets/wheel1.png', 1.00, 1.00, 1.00, '1 x 1 x 1 x 1', '', '', '', '', 0, 1, '1', 0),
(13, 'Muffler', 'Exhaust', 'abc', 'Exhaust', '', '/src/assets/wheel1.png', 1.00, 1.00, 1.00, '1 x 1 x 1 x 1', '', '', '', '', 0, 1, '1', 0),
(14, 'test', 'test', 'test', 'Amplifier', 'test', 'public/uploads/1732978114244-SubwooferImage.png,public/uploads/1732978114250-AmplifierImage.png,public/uploads/1732978114262-caraudio.png,public/uploads/1732978114266-car.png', 123.00, 123.00, 123.00, '5 x 5 x 5 x 5', 'test', 'Matte', 'test', 'test', 2, 5, '5', 0);

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `contact_name` varchar(255) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Active',
  `additional_notes` text DEFAULT NULL,
  `current_address_type` varchar(50) DEFAULT NULL,
  `current_address_street` varchar(255) DEFAULT NULL,
  `current_address_city` varchar(100) DEFAULT NULL,
  `current_address_province` varchar(100) DEFAULT NULL,
  `current_address_zip` varchar(20) DEFAULT NULL,
  `current_address_landmark` varchar(255) DEFAULT NULL,
  `new_address_type` varchar(50) DEFAULT NULL,
  `new_address_street` varchar(255) DEFAULT NULL,
  `new_address_city` varchar(100) DEFAULT NULL,
  `new_address_province` varchar(100) DEFAULT NULL,
  `new_address_zip` varchar(20) DEFAULT NULL,
  `new_address_landmark` varchar(255) DEFAULT NULL,
  `supply_id` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archived` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `name`, `contact_name`, `type`, `email`, `phone`, `status`, `additional_notes`, `current_address_type`, `current_address_street`, `current_address_city`, `current_address_province`, `current_address_zip`, `current_address_landmark`, `new_address_type`, `new_address_street`, `new_address_city`, `new_address_province`, `new_address_zip`, `new_address_landmark`, `supply_id`, `created_at`, `updated_at`, `archived`) VALUES
(1, 'Test Supplier', NULL, NULL, 'test@example.com', '123456789', 'Active', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '', '2024-11-02 12:03:22', '2024-11-18 14:24:00', 1),
(7, 'ABC Company', 'Shane', 'Retail', 'hello@gmail.com', '09620696558', 'Active', '', 'Headquarters', 'Prima Residences', 'Quezon City', 'NCR', '1008', '', '', '', '', '', '', '', 'SID-1730565664691', '2024-11-02 16:41:04', '2024-11-18 14:24:17', 1),
(8, '123 Company', 'Tokyo', 'Retail', 'tokyorip@gmail.com', '0911329846789', 'Not Active', '', 'Headquarters', 'pine st', 'quezon city', 'metro manila', '1004', '', '', '', '', '', '', '', 'SID-1730566450892', '2024-11-02 16:54:10', '2024-11-18 16:21:36', 1),
(9, 'Stacker', 'Aliyah', 'Retail', 'aa@gmail.com', '09452678192', 'Not Active', '', 'Shipping', 'quezon ave', 'quezon city', 'metro manila', '1002', '', '', '', '', '', '', '', 'SID-1730567344383', '2024-11-02 17:09:04', '2024-11-18 16:21:16', 1),
(10, 'pagod na ako', 'umay', 'Wholesale', 'loe21@gmailcom', '0926389126', 'Active', '', 'Billing', 'pota im so tired', 'qc', 'ncr', '3001', '', '', '', '', '', '', '', 'SID-1730567607520', '2024-11-02 17:13:27', '2024-11-18 16:21:25', 1),
(16, 'ABC Company', 'Regi', 'Retail', 'regi@gmail.com', '098253425182', 'Active', '', 'Billing', 'maginhawa', 'quezon city', 'metro manila', '1002', '', '', '', '', '', '', '', 'SID-1731327512139', '2024-11-11 12:18:32', '2024-11-18 16:21:33', 1),
(17, '123 stack', 'aina', 'Retail', 'aina@gmail.com', '09527381244', 'Active', '', 'Shipping', 'Prima Residences', 'Quezon City', 'NCR', '1008', '', '', '', '', '', '', '', 'SID-1731328547422', '2024-11-11 12:35:47', '2024-11-18 16:21:39', 1),
(18, '45 Maple', 'zinah', 'Retail', 'zinah@gmail.com', '09974234212', 'Active', '', 'Billing', 'Prima Residences', 'Quezon City', 'NCR', '1008', '', '', '', '', '', '', '', 'SID-1731337121802', '2024-11-11 14:58:41', '2024-11-18 16:21:42', 1),
(19, '45 Maple', 'zeia', 'Retail', 'zinah@gmail.com', '09974234212', 'Active', NULL, 'Headquarters', 'Prima Residences', 'Quezon City', 'NCR', '1008', '', '', '', '', '', '', '', 'SID-1731337176608', '2024-11-11 14:59:36', '2024-11-11 14:59:36', 0),
(20, 'a', 'a', 'Wholesale', 'a@gmail.com', '092778265421', 'Active', '', 'Headquarters', 'Prima Residences', 'Quezon City', 'NCR', '1008', '', '', '', '', '', '', '', 'SID-1731337253605', '2024-11-11 15:00:53', '2024-11-11 15:00:53', 0),
(21, 'test', 'test', 'Wholesale', 'test@gmail.com', '09345678912', 'Active', '', 'Headquarters', 'test ', 'test', 'test', 'test', '', '', '', '', '', '', '', 'SID-1731391426264', '2024-11-12 06:03:46', '2024-11-12 06:03:46', 0),
(22, 'test', 'test', 'Wholesale', 'test@gmail.com', '09345678912', 'Active', NULL, 'Billing', 'test', 'test', 'test', 'test', '', '', '', '', '', '', '', 'SID-1731391929127', '2024-11-12 06:12:09', '2024-11-12 06:12:09', 0),
(23, 'pagod na ako', 'Shane', 'Wholesale', 'loe21@gmailcom', '0926389126', 'Active', NULL, 'Headquarters', 'Prima Residences', 'Quezon City', 'NCR', '1008', '', '', '', '', '', '', '', 'SID-1731939196074', '2024-11-18 14:13:16', '2024-11-18 14:13:16', 0),
(24, 'Test', 'Test', 'Wholesale', 'test@gmail.com', '0927461923', 'Not Active', '', 'Headquarters', 'Prima Residences', 'Quezon City', 'Abra', '1011', '', '', '', '', '', '', '', 'SID-1732245308143', '2024-11-22 03:15:08', '2024-11-22 03:15:08', 0);

-- --------------------------------------------------------

--
-- Table structure for table `supplier_products`
--

CREATE TABLE `supplier_products` (
  `id` int(11) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `product_description` text DEFAULT NULL,
  `quantity_available` int(11) DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier_products`
--

INSERT INTO `supplier_products` (`id`, `supplier_id`, `product_name`, `category`, `product_description`, `quantity_available`, `unit_price`) VALUES
(1, 24, NULL, 'abc', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `verification_token` varchar(255) DEFAULT NULL,
  `verified` tinyint(1) DEFAULT 0,
  `contact_number` varchar(20) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `barangay` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL,
  `reset_token` varchar(64) DEFAULT NULL,
  `password_verified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `verification_token`, `verified`, `contact_number`, `street`, `barangay`, `city`, `region`, `province`, `zip_code`, `reset_token`, `password_verified`) VALUES
(36, 'Rhea', 'Ceo', 'rhea.ceo.flacko1990@gmail.com', '$2a$10$PqAMYQrB4vTE/D.g/X.EQO7GKfjF4ufFW8zI8jL9g7aF.Dfw5dLI6', NULL, 1, '+639281888695', '3-E West Santiago St. Brgy. Paltok', 'Paltok', 'Quezon City', 'NCR - National Capital Region', 'Metro Manila', '1104', NULL, 0),
(94, 'Erica', 'Moulic', 'Moulicericaj@gmail.com', '$2a$10$xmsk41e2OGW6U7/xUXbmuuO7VncF7/RqMbaV8u2fqHaNwpKngJZau', NULL, 1, '+639163033987', '#544 Pantal West', 'San Juan', 'Dagupan City', 'Region XIII - Caraga', 'Pangasinan', '2400', NULL, 0),
(95, 'Kirsten Angel', 'Apacible', 'kirstenapacible@gmail.com', '$2a$10$AymiCKG4N8otJ0Xrepxp2O7L8YSUNRnsLpm5Ub9R3SGF118PH50yq', NULL, 1, '+639281888695', '3-E West Santiago St. Brgy. Paltok', 'Paltok', 'Quezon City', 'NCR - National Capital Region', 'Metro Manila', '1104', NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `contact_submissions`
--
ALTER TABLE `contact_submissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `supply_id` (`supply_id`),
  ADD KEY `idx_supplier_name` (`name`),
  ADD KEY `idx_supplier_email` (`email`);

--
-- Indexes for table `supplier_products`
--
ALTER TABLE `supplier_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_id` (`supplier_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `contact_submissions`
--
ALTER TABLE `contact_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `supplier_products`
--
ALTER TABLE `supplier_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `supplier_products`
--
ALTER TABLE `supplier_products`
  ADD CONSTRAINT `supplier_products_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
