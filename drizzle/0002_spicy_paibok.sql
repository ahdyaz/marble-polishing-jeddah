CREATE TABLE `admin_passwords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_passwords_id` PRIMARY KEY(`id`)
);
