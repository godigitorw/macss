# MAC SS Real Estate Rwanda - Database Setup Guide

This guide will help you set up PostgreSQL database for the MAC SS Real Estate Rwanda project.

## Prerequisites

1. **Install PostgreSQL** (if not already installed)
   - **macOS**: `brew install postgresql@16`
   - **Ubuntu/Debian**: `sudo apt-get install postgresql postgresql-contrib`
   - **Windows**: Download from https://www.postgresql.org/download/windows/

2. **Start PostgreSQL Service**
   - **macOS**: `brew services start postgresql@16`
   - **Ubuntu/Debian**: `sudo service postgresql start`
   - **Windows**: PostgreSQL service should start automatically

## Database Setup Steps

### 1. Create Database and User

Open PostgreSQL terminal:
```bash
# macOS/Linux
psql postgres

# Or connect as postgres user
sudo -u postgres psql
```

Run these SQL commands:
```sql
-- Create database
CREATE DATABASE macss_realestate;

-- Create user (change password to something secure)
CREATE USER macss_user WITH ENCRYPTED PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE macss_realestate TO macss_user;

-- Exit psql
\q
```

### 2. Update Environment Variables

Update your `.env` file with your database credentials:

```env
DATABASE_URL="postgresql://macss_user:your_secure_password@localhost:5432/macss_realestate?schema=public"
```

**Important**: Replace `your_secure_password` with the actual password you set.

### 3. Push Database Schema

Run Prisma migrations to create all tables:

```bash
npm run db:push
```

This will create all the tables defined in `prisma/schema.prisma`:
- User
- Property
- PropertySubmission

### 4. Seed Initial Data

Populate the database with sample data:

```bash
npm run db:seed
```

This will create:
- An admin user (email: `admin@macssrealestate.rw`, password: `admin123`)
- 6 sample properties (houses, apartments, commercial spaces, etc.)

### 5. Verify Database Setup

You can use Prisma Studio to view your database:

```bash
npm run db:studio
```

This will open a browser interface at http://localhost:5555 where you can:
- View all tables
- Browse data
- Add/edit/delete records

## Database Schema Overview

### User Model
- Stores admin and regular users
- Handles authentication with bcrypt password hashing
- Roles: USER, ADMIN

### Property Model
- Main property listings
- Includes all property details (price, location, amenities, etc.)
- Types: HOUSE, APARTMENT, LAND, COMMERCIAL, OFFICE, WAREHOUSE
- Status: FOR_SALE, FOR_RENT, SOLD, RENTED

### PropertySubmission Model
- User-submitted properties waiting for approval
- Status: PENDING, APPROVED, REJECTED
- Can be converted to Property once approved

## Available NPM Scripts

```bash
# Generate Prisma Client (after schema changes)
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed database with sample data
npm run db:seed
```

## API Endpoints

### Properties
- `GET /api/properties` - List all properties (with filters)
- `POST /api/properties` - Create a new property
- `GET /api/properties/[id]` - Get single property
- `PUT /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property

### Submissions
- `GET /api/submissions` - List all submissions
- `POST /api/submissions` - Create a new submission

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

## Query Examples

### Fetch Properties with Filters
```javascript
// Get all FOR_SALE properties in Gasabo
const response = await fetch('/api/properties?status=FOR_SALE&district=Gasabo');
const properties = await response.json();

// Get featured properties
const featuredResponse = await fetch('/api/properties?featured=true');
const featured = await featuredResponse.json();

// Search properties
const searchResponse = await fetch('/api/properties?search=villa');
const results = await searchResponse.json();
```

### Create a Property
```javascript
const response = await fetch('/api/properties', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Beautiful Villa',
    description: 'Amazing property...',
    type: 'HOUSE',
    status: 'FOR_SALE',
    price: 250000000,
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    district: 'Gasabo',
    sector: 'Kacyiru',
    address: 'KG 123 St',
    images: ['/images/villa1.jpg'],
    amenities: ['Garden', 'Parking'],
    contactName: 'John Doe',
    contactEmail: 'john@example.com',
    contactPhone: '+250788000000',
    userId: 'user_id_here',
  }),
});
```

## Troubleshooting

### Connection Issues

If you get connection errors:

1. **Check PostgreSQL is running**:
   ```bash
   # macOS
   brew services list
   
   # Ubuntu
   sudo service postgresql status
   ```

2. **Verify credentials**: Make sure DATABASE_URL in `.env` matches your PostgreSQL setup

3. **Check PostgreSQL is listening**:
   ```bash
   psql -U macss_user -d macss_realestate -h localhost
   ```

### Permission Issues

If you get permission errors:

```sql
-- Connect as postgres superuser
psql postgres

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE macss_realestate TO macss_user;
GRANT ALL ON SCHEMA public TO macss_user;
```

### Reset Database

To start fresh:

```bash
# Drop and recreate database
psql postgres -c "DROP DATABASE macss_realestate;"
psql postgres -c "CREATE DATABASE macss_realestate;"

# Push schema again
npm run db:push

# Reseed data
npm run db:seed
```

## Production Deployment

For production, you'll need:

1. **Use a managed PostgreSQL service**:
   - Supabase (free tier available)
   - Railway
   - Heroku Postgres
   - AWS RDS
   - Digital Ocean Managed Databases

2. **Update DATABASE_URL** in production environment variables

3. **Run migrations**:
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Secure your database**:
   - Use strong passwords
   - Enable SSL connections
   - Restrict access by IP
   - Regular backups

## Security Notes

- Never commit `.env` file to version control
- Use strong passwords for production
- Implement proper authentication middleware
- Validate all inputs on API routes
- Use HTTPS in production
- Regular database backups

## Need Help?

- Prisma Documentation: https://www.prisma.io/docs
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
