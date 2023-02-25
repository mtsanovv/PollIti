SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `polliti` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `polliti`;

CREATE TABLE `polls` (
  `id` bigint(20) NOT NULL,
  `title` varchar(256) NOT NULL,
  `creation_date` date NOT NULL,
  `threshold` tinyint(3) NOT NULL DEFAULT 0,
  `undecided_votes` bigint(20) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `polls_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `message` text NOT NULL,
  `timestamp` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `polls_options` (
  `id` bigint(20) NOT NULL,
  `title` varchar(128) NOT NULL,
  `votes` bigint(20) NOT NULL DEFAULT 0,
  `poll` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `polls_tokens` (
  `uuid` varchar(36) NOT NULL,
  `expires_on` date NOT NULL,
  `email` varchar(320) NOT NULL,
  `poll` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `username` varchar(128) NOT NULL,
  `displayName` varchar(1024) NOT NULL,
  `password` varchar(1024) NOT NULL,
  `role` enum('Agent','Administrator') NOT NULL DEFAULT 'Agent' COMMENT '1 - Agent (default),\r\n2 - Administrator',
  `enabled` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


ALTER TABLE `polls`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `polls_logs`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `polls_options`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `title` (`title`,`poll`),
  ADD KEY `poll` (`poll`);

ALTER TABLE `polls_tokens`
  ADD PRIMARY KEY (`uuid`),
  ADD UNIQUE KEY `email` (`email`,`poll`),
  ADD KEY `poll` (`poll`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);


ALTER TABLE `polls`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `polls_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `polls_options`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;


ALTER TABLE `polls_options`
  ADD CONSTRAINT `polls_options_ibfk_1` FOREIGN KEY (`poll`) REFERENCES `polls` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `polls_tokens`
  ADD CONSTRAINT `polls_tokens_ibfk_1` FOREIGN KEY (`poll`) REFERENCES `polls` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
