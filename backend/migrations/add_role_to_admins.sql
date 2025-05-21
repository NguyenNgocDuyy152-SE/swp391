-- Add role column to admins table
ALTER TABLE admins
ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'admin';

-- Update existing admin to super_admin if needed
UPDATE admins 
SET role = 'super_admin' 
WHERE username = 'admin';  -- Hoặc điều kiện khác để xác định super admin

-- Add index for role column
CREATE INDEX idx_admin_role ON admins(role); 