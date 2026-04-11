CREATE TABLE `access_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(64) NOT NULL,
	`resourceType` varchar(64),
	`resourceId` varchar(255),
	`resourceTitle` varchar(255),
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `access_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`role` enum('user','assistant','system') NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`titleHe` varchar(255),
	`category` enum('legal','setup_guides','sales_training','technical_reference') NOT NULL,
	`fileType` enum('markdown','pdf','external') NOT NULL,
	`language` enum('en','he','both') NOT NULL DEFAULT 'en',
	`contentEn` text,
	`contentHe` text,
	`fileUrlEn` varchar(1024),
	`fileUrlHe` varchar(1024),
	`accessRoles` varchar(255) NOT NULL DEFAULT 'reseller,integrator,end_user,admin',
	`sortOrder` int NOT NULL DEFAULT 0,
	`isPublished` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `portalRole` enum('reseller','integrator','end_user','admin') DEFAULT 'end_user' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `preferredLanguage` enum('en','he') DEFAULT 'en' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `isActive` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `company` varchar(255);