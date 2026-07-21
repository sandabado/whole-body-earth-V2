CREATE TABLE `applications` (
	`id` text PRIMARY KEY NOT NULL,
	`artist_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`genre` text NOT NULL,
	`stage` text NOT NULL,
	`portfolio_primary` text NOT NULL,
	`portfolio_secondary` text,
	`services_needed` text NOT NULL,
	`what_they_build` text NOT NULL,
	`why_studios` text,
	`retains_ip` text NOT NULL,
	`consent` integer NOT NULL,
	`status` text DEFAULT 'NEW' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text NOT NULL,
	`message` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
