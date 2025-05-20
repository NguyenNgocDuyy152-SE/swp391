# Database Management Tool

A command-line tool for managing and interacting with the project's MySQL database.

## Installation

1. Make sure you have installed the required dependencies:
```bash
pip install -r requirements.txt
```

2. Ensure your `.env` file is properly configured with database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=swp391
```

## Usage

The tool provides various commands for database management:

### Initialize Database Tables
Create the standard application tables:
```bash
python db_tool.py init-tables
```

### List Tables
List all tables in the database:
```bash
python db_tool.py list-tables
```

### Describe Table
Show the structure of a table:
```bash
python db_tool.py describe users
```

### Count Records
Count the number of records in a table:
```bash
python db_tool.py count users
```

### Execute SQL Query
Run a custom SQL query:
```bash
python db_tool.py query "SELECT * FROM users WHERE id < 5"
```

### Export Table Data
Export table data to CSV or JSON:
```bash
python db_tool.py export users --format csv
# or
python db_tool.py export users --format json
```

### Backup Database
Create a SQL backup of the database:
```bash
python db_tool.py backup
```

### Restore Database
Restore database from a backup file:
```bash
python db_tool.py restore backups/swp391_20231010_120000.sql
```

## Examples

### Export User Table
```bash
python db_tool.py export users
```

### Get Table Structure
```bash
python db_tool.py describe admins
```

### Run Custom Query
```bash
python db_tool.py query "SELECT COUNT(*) as total_users FROM users GROUP BY DATE(created_at)"
```

## Notes

- Non-query SQL statements (UPDATE, INSERT, DELETE, etc.) will prompt for confirmation
- Backup files are stored in a `backups` directory with timestamps
- Exports are saved in the current directory with format `export_[tablename]_[timestamp].[format]` 