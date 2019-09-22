-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Sep 22, 2019 at 12:04 AM
-- Server version: 5.7.23
-- PHP Version: 7.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `EmailSubscriptionManager`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `name` varchar(50) NOT NULL,
  `age` int(3) NOT NULL,
  `email` varchar(345) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`name`, `age`, `email`) VALUES
('Andrew Yang', 46, 'andrew.yang@gmail.com'),
('Charles', 35, 'charles@gmail.com'),
('John Doe', 30, 'john.doe@gmail.com'),
('Kanye West', 42, 'k.west@gmail.com\r\n'),
('Michael Scott', 47, 'm.scott@gmail.com'),
('Quavo Huncho', 28, 'q.huncho@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`);