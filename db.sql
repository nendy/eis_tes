CREATE TABLE `barang` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `nama` varchar(128),
  `value` varchar(64),
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);
