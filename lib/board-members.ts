/**
 * Select string for board_members that maps DB columns to BoardMember type:
 * - photo_url → image_url
 * - role → position
 */
export const BOARD_MEMBERS_SELECT =
  "id,name,position:role,bio,image_url:photo_url,email,phone,display_order,is_active,created_at,updated_at,created_by"
