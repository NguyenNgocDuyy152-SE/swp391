from db_utils import DatabaseManager
from argon2 import PasswordHasher
import logging

logger = logging.getLogger('admin_utils')

class AdminManager:
    def __init__(self):
        self.db = DatabaseManager()
        self.ph = PasswordHasher()

    def create_admin(self, username, password, name, email, role='admin'):
        """Create a new admin account"""
        try:
            # Check if username or email already exists
            if self.db.record_exists('admins', 'username = %s OR email = %s', (username, email)):
                return False, "Username or email already exists"

            # Hash password with Argon2
            hashed_password = self.ph.hash(password)

            # Insert new admin
            admin_data = {
                'username': username,
                'password': hashed_password,
                'name': name,
                'email': email,
                'role': role,
                'status': 'active'
            }

            admin_id = self.db.insert_data('admins', admin_data)
            return True, admin_id

        except Exception as e:
            logger.error(f"Error creating admin account: {e}")
            return False, str(e)

    def update_admin(self, admin_id, data):
        """Update admin account details"""
        try:
            # Don't allow updating username or email to existing values
            if 'username' in data or 'email' in data:
                existing = self.db.fetch_one(
                    "SELECT * FROM admins WHERE (username = %s OR email = %s) AND id != %s",
                    (data.get('username'), data.get('email'), admin_id)
                )
                if existing:
                    return False, "Username or email already exists"

            # If updating password, hash it
            if 'password' in data:
                data['password'] = self.ph.hash(data['password'])

            success = self.db.update_data('admins', data, 'id = %s', [admin_id])
            return True, "Admin updated successfully" if success else False, "Update failed"

        except Exception as e:
            logger.error(f"Error updating admin account: {e}")
            return False, str(e)

    def delete_admin(self, admin_id):
        """Delete an admin account"""
        try:
            # Check if this is the last admin account
            total_admins = self.db.fetch_one("SELECT COUNT(*) as count FROM admins")
            if total_admins and total_admins['count'] <= 1:
                return False, "Cannot delete the last admin account"

            success = self.db.delete_data('admins', 'id = %s', [admin_id])
            return True, "Admin deleted successfully" if success else False, "Delete failed"

        except Exception as e:
            logger.error(f"Error deleting admin account: {e}")
            return False, str(e)

    def get_admin(self, admin_id):
        """Get admin account details"""
        try:
            admin = self.db.fetch_one("SELECT id, username, name, email, role, status, created_at, last_login FROM admins WHERE id = %s", [admin_id])
            return admin if admin else None

        except Exception as e:
            logger.error(f"Error getting admin details: {e}")
            return None

    def list_admins(self):
        """List all admin accounts"""
        try:
            admins = self.db.execute_select(
                "SELECT id, username, name, email, role, status, created_at, last_login FROM admins ORDER BY created_at DESC"
            )
            return admins

        except Exception as e:
            logger.error(f"Error listing admins: {e}")
            return []

    def change_password(self, admin_id, old_password, new_password):
        """Change admin password"""
        try:
            admin = self.db.fetch_one("SELECT password FROM admins WHERE id = %s", [admin_id])
            if not admin:
                return False, "Admin not found"

            # Verify old password
            if not self.ph.verify(admin['password'], old_password):
                return False, "Incorrect old password"

            # Hash and update new password
            hashed_password = self.ph.hash(new_password)
            success = self.db.update_data('admins', {'password': hashed_password}, 'id = %s', [admin_id])
            
            return True, "Password changed successfully" if success else False, "Password change failed"

        except Exception as e:
            logger.error(f"Error changing admin password: {e}")
            return False, str(e)

    def change_status(self, admin_id, new_status):
        """Change admin account status (active/inactive)"""
        try:
            # Don't allow deactivating the last active admin
            if new_status == 'inactive':
                active_admins = self.db.fetch_one(
                    "SELECT COUNT(*) as count FROM admins WHERE status = 'active' AND id != %s",
                    [admin_id]
                )
                if active_admins and active_admins['count'] == 0:
                    return False, "Cannot deactivate the last active admin account"

            success = self.db.update_data('admins', {'status': new_status}, 'id = %s', [admin_id])
            return True, f"Admin status changed to {new_status}" if success else False, "Status change failed"

        except Exception as e:
            logger.error(f"Error changing admin status: {e}")
            return False, str(e)

    def verify_admin_password(self, username, password):
        """Verify admin password"""
        try:
            admin = self.db.fetch_one("SELECT password FROM admins WHERE username = %s", [username])
            if not admin:
                return False

            return self.ph.verify(admin['password'], password)

        except Exception as e:
            logger.error(f"Error verifying admin password: {e}")
            return False

    def get_admin_by_username(self, username):
        """Get admin details by username"""
        try:
            admin = self.db.fetch_one("SELECT * FROM admins WHERE username = %s", [username])
            return admin if admin else None

        except Exception as e:
            logger.error(f"Error getting admin by username: {e}")
            return None

    def update_last_login(self, admin_id):
        """Update admin's last login time"""
        try:
            success = self.db.update_data('admins', {'last_login': 'CURRENT_TIMESTAMP'}, 'id = %s', [admin_id])
            return success

        except Exception as e:
            logger.error(f"Error updating last login: {e}")
            return False 