CREATE TABLE `waitlist_entries` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `interest` text,
  `message` text,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `waitlist_entries_email_unique` ON `waitlist_entries` (`email`);
--> statement-breakpoint
CREATE TABLE `submissions` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `author_name` text NOT NULL,
  `email` text NOT NULL,
  `phone` text,
  `genre` text NOT NULL,
  `title` text NOT NULL,
  `synopsis` text NOT NULL,
  `why_press` text NOT NULL,
  `portfolio_url` text NOT NULL,
  `proposed_imprint` text,
  `word_count` integer,
  `short_bio` text,
  `previous_publications` text,
  `consent_original` integer DEFAULT false NOT NULL,
  `consent_copyright` integer DEFAULT false NOT NULL,
  `consent_nonexclusive` integer DEFAULT false NOT NULL,
  `consent_feed_first` integer DEFAULT false NOT NULL,
  `status` text DEFAULT 'PENDING' NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `event_registrations` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `event_id` text NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `quantity` integer DEFAULT 1 NOT NULL,
  `consent_transactional` integer DEFAULT false NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
