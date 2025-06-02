-- Migration script to add phone column to users table

ALTER TABLE users
ADD COLUMN phone VARCHAR(20);
