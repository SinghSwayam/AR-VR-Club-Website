# Supabase Database Scripts

This directory contains SQL scripts for setting up and maintaining the database.

## Main Schema

- **`schema.sql`** - Complete database schema (run this first!)
  - Creates all tables (events, users, registrations, inquiries, winners)
  - Includes all columns (mobile_number, designation, year, dept, roll_no)
  - Sets up indexes, functions, triggers, and permissions
  - Use this for fresh installations

## Functions

- **`functions/create-increment-event-count-function.sql`** - Event count management functions
  - `increment_event_count()` - Increments count when registration is created
  - `decrement_event_count()` - Decrements count when registration is cancelled

## Migrations (For Existing Databases)

These scripts are for adding features to existing databases:

- **`migrations/add-mobile-number.sql`** - Add mobile_number column to users and registrations
- **`migrations/add-designation-column.sql`** - Add designation column to users
- **`migrations/add-year-dept-to-registrations.sql`** - Add year, dept, roll_no to registrations
- **`migrations/fix-column-names.sql`** - Fix PascalCase column names to snake_case
- **`migrations/fix-foreign-key-cascade.sql`** - Fix foreign key constraints for CASCADE delete

## Utilities

- **`make-user-admin.sql`** - Make a user an admin (update email in script)

## Usage

### For New Installation

1. Run `schema.sql` in Supabase SQL Editor
2. Done! All tables, functions, and features are set up

### For Existing Database

1. If you need to add features, run the appropriate migration script from `migrations/`
2. If you need to fix issues, run the appropriate fix script
3. If you need to make someone admin, run `make-user-admin.sql`

## Note

The `schema.sql` file includes everything, so if you're starting fresh, you only need to run that one file.

