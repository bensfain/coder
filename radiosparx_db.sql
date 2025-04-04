-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 04, 2025 at 12:46 PM
-- Server version: 8.0.41
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `radiosparx_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `project_members`
--

CREATE TABLE `project_members` (
  `id` int NOT NULL,
  `project_id` int NOT NULL,
  `user_id` int NOT NULL,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `contribution_percentage` decimal(5,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `project_members`
--

INSERT INTO `project_members` (`id`, `project_id`, `user_id`, `role`, `joined_at`, `contribution_percentage`) VALUES
(3, 2, 4, 'advisor', '2025-04-03 04:57:44', 80.00),
(4, 2, 3, 'observer', '2025-04-03 04:57:44', 0.00),
(5, 3, 5, 'lead', '2025-04-03 04:57:44', 50.00),
(6, 3, 1, 'contributor', '2025-04-03 04:57:44', 30.00),
(7, 3, 4, 'advisor', '2025-04-03 04:57:44', 20.00),
(18, 12, 4, 'lead', '2025-04-03 13:06:22', 30.00),
(19, 12, 1, 'contributor', '2025-04-03 13:06:22', 20.00),
(20, 13, 4, 'lead', '2025-04-03 13:10:05', 30.00),
(21, 13, 1, 'contributor', '2025-04-03 13:10:05', 20.00),
(22, 15, 4, 'contributor', '2025-04-03 13:16:21', 30.00),
(23, 16, 4, 'lead', '2025-04-04 10:18:03', 30.00);

-- --------------------------------------------------------

--
-- Table structure for table `research_logs`
--

CREATE TABLE `research_logs` (
  `id` int NOT NULL,
  `project_id` int NOT NULL,
  `user_id` int NOT NULL,
  `log_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `activity_type` enum('experiment','analysis','meeting','literature_review') NOT NULL,
  `hours_spent` decimal(5,2) NOT NULL,
  `description` text NOT NULL,
  `results` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `research_logs`
--

INSERT INTO `research_logs` (`id`, `project_id`, `user_id`, `log_date`, `activity_type`, `hours_spent`, `description`, `results`) VALUES
(3, 2, 4, '2025-04-03 04:58:29', 'meeting', 1.50, 'Diskusi dengan tim retail tentang kebutuhan sistem rekomendasi', 'Diskusi tentang fitur yang diinginkan oleh klien'),
(4, 3, 5, '2025-04-03 04:58:29', 'experiment', 4.00, 'Pengujian kompresi dengan metode psikoakustik', 'Pengukuran kualitas kompresi dengan bitrate rendah');

-- --------------------------------------------------------

--
-- Table structure for table `research_projects`
--

CREATE TABLE `research_projects` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `status` enum('planning','active','completed','cancelled') NOT NULL DEFAULT 'planning',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `budget` decimal(10,2) DEFAULT NULL,
  `lead_researcher_id` int NOT NULL,
  `confidentiality_level` enum('public','internal','restricted','classified') NOT NULL DEFAULT 'internal',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `research_projects`
--

INSERT INTO `research_projects` (`id`, `title`, `description`, `status`, `start_date`, `end_date`, `budget`, `lead_researcher_id`, `confidentiality_level`, `created_at`, `updated_at`) VALUES
(2, 'Sistem Rekomendasi Musik untuk Retail', 'Pengembangan algoritma rekomendasi berbasis AI untuk meningkatkan pengalaman pelanggan di toko retail.', 'planning', '2024-03-01', '2024-12-31', 7500000.00, 2, 'restricted', '2025-04-03 04:55:21', '2025-04-03 04:55:21'),
(3, 'abc', 'ABCD', 'active', '2024-02-15', '2024-11-30', 6200000.00, 3, 'public', '2025-04-03 04:55:21', '2025-04-03 12:54:19'),
(7, 'Analisis Pengaruh Musik Daerah pada Produktivitas', 'Penelitian tentang bagaimana musik tradisional mempengaruhi kecerdasan emosional', 'planning', '2024-05-01', '2024-12-31', 55000.00, 1, 'internal', '2025-04-03 06:30:56', '2025-04-03 06:30:56'),
(12, 'Analisis Pengaruh Musik Daerah pada Produktivitas', 'Penelitian tentang bagaimana musik tradisional mempengaruhi produktivitas pekerja dalam berbagai kondisi.', 'planning', '2024-05-01', '2024-12-31', 55000.00, 2, 'internal', '2025-04-03 13:06:22', '2025-04-03 13:06:22'),
(13, 'Analisis Pengaruh Musik Daerah pada Produktivitas', 'Penelitian tentang bagaimana musik tradisional mempengaruhi produktivitas pekerja dalam berbagai kondisi.', 'planning', '2024-05-01', '2024-12-31', 55000.00, 2, 'internal', '2025-04-03 13:10:05', '2025-04-03 13:10:05'),
(15, 'Analisis Pengaruh Musik Daerah pada Produktivitas', 'Penelitian tentang bagaimana musik tradisional mempengaruhi ekonomi', 'planning', '2024-05-01', '2024-12-31', 55000.00, 1, 'internal', '2025-04-03 13:16:21', '2025-04-03 13:16:21'),
(16, 'Ekonomi Kedaerahan', 'Penelitian tentang ekonomi Daerah', 'planning', '2024-05-01', '2024-12-31', 55000.00, 1, 'internal', '2025-04-04 10:18:03', '2025-04-04 10:18:03');

-- --------------------------------------------------------

--
-- Table structure for table `research_samples`
--

CREATE TABLE `research_samples` (
  `id` int NOT NULL,
  `project_id` int NOT NULL,
  `sample_name` varchar(100) NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `duration_seconds` int DEFAULT NULL,
  `format` varchar(20) DEFAULT NULL,
  `sampling_rate` int DEFAULT NULL,
  `channel_count` int DEFAULT NULL,
  `notes` text,
  `uploaded_by` int NOT NULL,
  `upload_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `research_samples`
--

INSERT INTO `research_samples` (`id`, `project_id`, `sample_name`, `file_path`, `duration_seconds`, `format`, `sampling_rate`, `channel_count`, `notes`, `uploaded_by`, `upload_date`) VALUES
(3, 3, 'compression_test_01', '/samples/compression/test_01.mp3', 240, 'MP3', 48000, 2, 'Tes kompresi audio dengan bitrate rendah.', 3, '2024-04-01 02:45:00'),
(4, 3, 'compression_test_02', '/samples/compression/test_02.mp3', 240, 'MP3', 48000, 2, 'Tes kompresi audio dengan bitrate tinggi.', 3, '2024-04-02 07:20:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('researcher','admin','viewer') NOT NULL DEFAULT 'viewer',
  `department` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `department`, `created_at`, `updated_at`) VALUES
(1, 'john_researcher', 'john@radiosparx.my', 'password123\r\n', 'researcher', 'Physics', '2025-04-03 04:54:20', '2025-04-03 13:32:25'),
(2, 'admin_sarah', 'sarah@radiosparx.my', '$2b$10$C8ZMKu1l5RDv9CSQUvAL3.QORvM1', 'admin', 'IT', '2025-04-03 04:54:20', '2025-04-03 04:54:20'),
(3, 'viewer_tom', 'tom@radiosparx.my', '$2b$10$ZJqygSgM6SXpjZzvv1PCme.ZvdAze', 'viewer', 'Biology', '2025-04-03 04:54:20', '2025-04-03 04:54:20'),
(4, 'emma_researcher', 'emma@radiosparx.my', '$2b$10$LE3FKsdJsQXYx8nPMcMQBuN76Yg', 'researcher', 'Chemistry', '2025-04-03 04:54:20', '2025-04-03 04:54:20'),
(5, 'alex_researcher', 'alex@radiosparx.my', '$2b$10$pW3rD1LkwAqm3Rj3mvY1sOZ', 'researcher', 'Engineering', '2025-04-03 04:54:20', '2025-04-03 04:54:20'),
(6, 'admin1234', 'admin@yahoo.com', '$2a$12$iHnreL0XQRM3CDthWJuMuuoGhOq3ggzP96VlfKd4BSpTLrw5PfeOS', 'admin', 'IT', '2025-04-04 06:38:09', '2025-04-04 06:38:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `project_members`
--
ALTER TABLE `project_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_project_user` (`project_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `research_logs`
--
ALTER TABLE `research_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `research_projects`
--
ALTER TABLE `research_projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lead_researcher_id` (`lead_researcher_id`);

--
-- Indexes for table `research_samples`
--
ALTER TABLE `research_samples`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `project_members`
--
ALTER TABLE `project_members`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `research_logs`
--
ALTER TABLE `research_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `research_projects`
--
ALTER TABLE `research_projects`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `research_samples`
--
ALTER TABLE `research_samples`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `project_members`
--
ALTER TABLE `project_members`
  ADD CONSTRAINT `project_members_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `research_projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `research_logs`
--
ALTER TABLE `research_logs`
  ADD CONSTRAINT `research_logs_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `research_projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `research_logs_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `research_projects`
--
ALTER TABLE `research_projects`
  ADD CONSTRAINT `research_projects_ibfk_1` FOREIGN KEY (`lead_researcher_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `research_samples`
--
ALTER TABLE `research_samples`
  ADD CONSTRAINT `research_samples_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `research_projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `research_samples_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
