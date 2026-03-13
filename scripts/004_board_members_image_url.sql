-- Migration: Rename board_members.photo_url to image_url
-- Run this if your board_members table was created with photo_url (e.g. before schema fix).
-- Fixes PostgREST error: Could not find the 'image_url' column of 'board_members' in the schema cache

ALTER TABLE public.board_members RENAME COLUMN photo_url TO image_url;
