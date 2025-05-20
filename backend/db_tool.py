#!/usr/bin/env python
import argparse
import sys
import os
import json
import csv
from datetime import datetime
from tabulate import tabulate
from dotenv import load_dotenv
from db_utils import DatabaseManager
from werkzeug.security import generate_password_hash

load_dotenv()

class DatabaseTool:
    """CLI tool for database operations"""
    
    def __init__(self):
        self.db = DatabaseManager()
        
    def list_tables(self):
        """List all tables in the database"""
        query = "SHOW TABLES"
        tables = self.db.execute_select(query)
        
        if not tables:
            print("No tables found in database")
            return
            
        headers = ["Tables"]
        table_names = [[table[f'Tables_in_{self.db.config["database"]}']] for table in tables]
        print(tabulate(table_names, headers=headers, tablefmt="grid"))
        
    def describe_table(self, table_name):
        """Show table structure"""
        # Check if table exists
        if not self.db.record_exists("information_schema.tables", 
                                    f"table_schema = '{self.db.config['database']}' AND table_name = '{table_name}'"):
            print(f"Table '{table_name}' does not exist")
            return False
            
        query = f"DESCRIBE {table_name}"
        columns = self.db.execute_select(query)
        
        if not columns:
            print(f"No columns found in table '{table_name}'")
            return False
            
        print(tabulate(columns, headers="keys", tablefmt="grid"))
        return True
        
    def query(self, sql):
        """Execute a SQL query and display results"""
        if sql.lower().startswith(('select', 'show', 'describe', 'explain')):
            results = self.db.execute_select(sql)
            if results:
                print(tabulate(results, headers="keys", tablefmt="grid"))
                print(f"\n{len(results)} record(s) returned")
            else:
                print("Query returned no results")
        else:
            confirm = input(f"Execute non-query SQL? This might modify data:\n{sql}\n(yes/no): ")
            if confirm.lower() != 'yes':
                print("Operation cancelled")
                return
                
            result = self.db.execute_query(sql)
            print(f"Query executed. Result: {result}")
            
    def count_records(self, table_name):
        """Count records in a table"""
        if not self.describe_table(table_name):
            return
            
        query = f"SELECT COUNT(*) as count FROM {table_name}"
        result = self.db.fetch_one(query)
        print(f"\nTotal records in '{table_name}': {result['count']}")
        
    def export_data(self, table_name, format='csv'):
        """Export table data to CSV or JSON"""
        if not self.describe_table(table_name):
            return
            
        query = f"SELECT * FROM {table_name}"
        data = self.db.execute_select(query)
        
        if not data:
            print(f"No data found in table '{table_name}'")
            return
            
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        if format.lower() == 'csv':
            filename = f"export_{table_name}_{timestamp}.csv"
            with open(filename, 'w', newline='') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=data[0].keys())
                writer.writeheader()
                writer.writerows(data)
        elif format.lower() == 'json':
            filename = f"export_{table_name}_{timestamp}.json"
            with open(filename, 'w') as jsonfile:
                json.dump(data, jsonfile, indent=2, default=str)
                
        print(f"Data exported to {filename}")
        
    def backup_database(self):
        """Create a SQL backup of the database"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_dir = "backups"
        os.makedirs(backup_dir, exist_ok=True)
        backup_file = f"{backup_dir}/{self.db.config['database']}_{timestamp}.sql"
        
        if self.db.backup_database(backup_file):
            print(f"Database backup created: {backup_file}")
        
    def restore_database(self, backup_file):
        """Restore database from a SQL file"""
        if not os.path.exists(backup_file):
            print(f"Backup file '{backup_file}' not found")
            return
            
        confirm = input(f"This will overwrite current database with {backup_file}. Continue? (yes/no): ")
        if confirm.lower() != 'yes':
            print("Restore cancelled")
            return
            
        if self.db.restore_database(backup_file):
            print(f"Database restored from {backup_file}")
            
    def create_tables(self):
        """Create standard tables for the application"""
        # Create users table if not exists
        self.db.create_table("users", """
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('patient', 'doctor', 'staff') NOT NULL DEFAULT 'patient',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        """)
        print("Users table checked/created")
        
        # Create admins table if not exists
        self.db.create_table("admins", """
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'admin',
            last_login TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        """)
        print("Admins table checked/created")
        
        # Create doctors table for additional doctor information
        self.db.create_table("doctors", """
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            specialization VARCHAR(100) NOT NULL,
            qualification VARCHAR(255) NOT NULL,
            experience_years INT NOT NULL DEFAULT 0,
            consultation_fee DECIMAL(10,2) DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        """)
        print("Doctors table checked/created")
        
        # Create patients table for additional patient information
        self.db.create_table("patients", """
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            date_of_birth DATE,
            gender VARCHAR(20),
            blood_group VARCHAR(10),
            medical_history TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        """)
        print("Patients table checked/created")
        
        # Create appointments table
        self.db.create_table("appointments", """
            id INT AUTO_INCREMENT PRIMARY KEY,
            patient_id INT NOT NULL,
            doctor_id INT NOT NULL,
            appointment_date DATE NOT NULL,
            appointment_time TIME NOT NULL,
            status ENUM('scheduled', 'completed', 'cancelled', 'no_show') NOT NULL DEFAULT 'scheduled',
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
        """)
        print("Appointments table checked/created")
        
        # Create treatments table
        self.db.create_table("treatments", """
            id INT AUTO_INCREMENT PRIMARY KEY,
            patient_id INT NOT NULL,
            doctor_id INT NOT NULL,
            treatment_name VARCHAR(255) NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE,
            description TEXT,
            status ENUM('active', 'completed', 'discontinued') NOT NULL DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE
        """)
        print("Treatments table checked/created")
        
        # Add additional tables as needed
        
    def create_test_users(self):
        """Create test users for each role"""
        # Check if tables exist first
        if not self.db.record_exists("information_schema.tables", 
                                    f"table_schema = '{self.db.config['database']}' AND table_name = 'users'"):
            print("Tables don't exist. Creating tables first...")
            self.create_tables()
            
        # Create test doctor
        doctor_data = {
            "name": "Dr. Nguyễn Văn A",
            "email": "doctor@example.com",
            "password": generate_password_hash("Doctor@123"),
            "role": "doctor"
        }
        
        # Check if doctor exists
        if not self.db.record_exists("users", "email = 'doctor@example.com'"):
            doctor_id = self.db.insert_data("users", doctor_data)
            if doctor_id:
                doctor_details = {
                    "user_id": doctor_id,
                    "specialization": "Nhi khoa",
                    "qualification": "Tiến sĩ Y khoa",
                    "experience_years": 10,
                    "consultation_fee": 500000
                }
                self.db.insert_data("doctors", doctor_details)
                print(f"Created test doctor account:\nEmail: doctor@example.com\nPassword: Doctor@123")
        else:
            print("Doctor test account already exists")
            
        # Create test staff
        staff_data = {
            "name": "Trần Thị B",
            "email": "staff@example.com",
            "password": generate_password_hash("Staff@123"),
            "role": "staff"
        }
        
        if not self.db.record_exists("users", "email = 'staff@example.com'"):
            self.db.insert_data("users", staff_data)
            print(f"Created test staff account:\nEmail: staff@example.com\nPassword: Staff@123")
        else:
            print("Staff test account already exists")
            
        # Create test patient
        patient_data = {
            "name": "Lê Văn C",
            "email": "patient@example.com",
            "password": generate_password_hash("Patient@123"),
            "role": "patient"
        }
        
        if not self.db.record_exists("users", "email = 'patient@example.com'"):
            patient_id = self.db.insert_data("users", patient_data)
            if patient_id:
                patient_details = {
                    "user_id": patient_id,
                    "date_of_birth": "1990-01-15",
                    "gender": "Nam",
                    "blood_group": "O+",
                    "medical_history": "Không có tiền sử bệnh đặc biệt"
                }
                self.db.insert_data("patients", patient_details)
                print(f"Created test patient account:\nEmail: patient@example.com\nPassword: Patient@123")
        else:
            print("Patient test account already exists")
            
        # Create a test appointment
        if self.db.record_exists("users", "email = 'doctor@example.com'") and self.db.record_exists("users", "email = 'patient@example.com'"):
            doctor = self.db.fetch_one("SELECT id FROM users WHERE email = 'doctor@example.com'")
            patient = self.db.fetch_one("SELECT id FROM users WHERE email = 'patient@example.com'")
            
            if not self.db.record_exists("appointments", f"patient_id = {patient['id']} AND doctor_id = {doctor['id']}"):
                appointment_data = {
                    "patient_id": patient['id'],
                    "doctor_id": doctor['id'],
                    "appointment_date": datetime.now().strftime("%Y-%m-%d"),
                    "appointment_time": "14:30:00",
                    "status": "scheduled",
                    "notes": "Khám định kỳ"
                }
                self.db.insert_data("appointments", appointment_data)
                print("Created test appointment")
                
            # Create a test treatment
            if not self.db.record_exists("treatments", f"patient_id = {patient['id']} AND doctor_id = {doctor['id']}"):
                treatment_data = {
                    "patient_id": patient['id'],
                    "doctor_id": doctor['id'],
                    "treatment_name": "Điều trị hormon",
                    "start_date": datetime.now().strftime("%Y-%m-%d"),
                    "end_date": None,
                    "description": "Điều trị bằng liệu pháp thay thế hormon",
                    "status": "active"
                }
                self.db.insert_data("treatments", treatment_data)
                print("Created test treatment")
        
        print("\nAll test users created!")
        print("You can now test the application with these accounts.")

def main():
    parser = argparse.ArgumentParser(description="Database Management Tool")
    subparsers = parser.add_subparsers(dest="command", help="Command to execute")
    
    # List tables
    subparsers.add_parser("list-tables", help="List all tables in the database")
    
    # Describe table
    describe_parser = subparsers.add_parser("describe", help="Show table structure")
    describe_parser.add_argument("table", help="Table name")
    
    # Count records
    count_parser = subparsers.add_parser("count", help="Count records in a table")
    count_parser.add_argument("table", help="Table name")
    
    # Execute SQL
    query_parser = subparsers.add_parser("query", help="Execute SQL query")
    query_parser.add_argument("sql", help="SQL query to execute")
    
    # Export data
    export_parser = subparsers.add_parser("export", help="Export table data")
    export_parser.add_argument("table", help="Table name")
    export_parser.add_argument("--format", choices=["csv", "json"], default="csv", help="Export format")
    
    # Backup database
    subparsers.add_parser("backup", help="Create database backup")
    
    # Restore database
    restore_parser = subparsers.add_parser("restore", help="Restore database from backup")
    restore_parser.add_argument("file", help="Backup file path")
    
    # Initialize tables
    subparsers.add_parser("init-tables", help="Create standard application tables")
    
    # Create test users
    subparsers.add_parser("create-test-users", help="Create test users for each role")
    
    args = parser.parse_args()
    tool = DatabaseTool()
    
    try:
        if args.command == "list-tables":
            tool.list_tables()
        elif args.command == "describe":
            tool.describe_table(args.table)
        elif args.command == "count":
            tool.count_records(args.table)
        elif args.command == "query":
            tool.query(args.sql)
        elif args.command == "export":
            tool.export_data(args.table, args.format)
        elif args.command == "backup":
            tool.backup_database()
        elif args.command == "restore":
            tool.restore_database(args.file)
        elif args.command == "init-tables":
            tool.create_tables()
        elif args.command == "create-test-users":
            tool.create_test_users()
        else:
            parser.print_help()
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        tool.db.disconnect()

if __name__ == "__main__":
    main() 