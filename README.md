# Country Drive Golf League

A web application for managing the Country Drive Golf League, including schedules, scores, and standings.

## Features

- View the league schedule
- Enter and track match scores
- View team standings
- Manage teams and players
- Real-time updates with Socket.io

## Local Development

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL (optional for production-like setup)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cd-golf-league.git
   cd cd-golf-league
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Adjust the variables as needed

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3007](http://localhost:3007) in your browser.

### Development Mode

By default, the application uses mock data in development mode. The mock data is stored in a file (`.mock-data.json`) to persist between server restarts.

To use a real database in development:
1. Set `USE_MOCK_DATA=false` in `.env.local`
2. Ensure your PostgreSQL connection string is correct in `DATABASE_URL`
3. Run database migrations: `npm run db:push`
4. Initialize the database with sample data: `npm run db:init`

## Production Deployment (Vercel)

### Prerequisites

- Vercel account
- Vercel CLI installed: `npm i -g vercel`

### Deployment Steps

1. Login to Vercel:
   ```bash
   vercel login
   ```

2. Set up Vercel Postgres:
   ```bash
   npm run vercel:setup
   ```

3. Initialize the database:
   ```bash
   vercel env pull
   npm run db:deploy
   npm run db:init
   ```

4. Deploy to production:
   ```bash
   npm run vercel:deploy
   ```

## Database Schema

The application uses Prisma ORM with the following models:
- Team: Represents a team in the league
- Player: Represents a player, associated with a team
- Match: Represents a match between two teams
- MatchScore: Stores scores for each hole for each player
- MatchPoints: Tracks points earned by teams in matches
- MatchPlayer: Tracks which players are assigned to which matches

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## Security Best Practices

To maintain the security of this application, please follow these guidelines:

### Environment Variables and Secrets

1. **Never commit secrets to the repository**
   - All sensitive information should be stored in environment variables
   - Use `.env.local` for local development (this file is gitignored)
   - Reference `.env.example` for required variables without using real values

2. **Handling Environment Files**
   - Copy `.env.example` to `.env.local` for local development
   - Never commit any `.env*` files except for `.env.example`
   - For production, use Vercel's environment variable management

3. **API Keys and Credentials**
   - Rotate API keys and credentials regularly
   - Use different credentials for development and production
   - Limit the permissions of service accounts to only what's necessary

### Git Security

1. **Pre-commit Hooks**
   - The repository uses git-secrets to prevent accidental secret commits
   - Run `git secrets --scan` before committing if you're unsure
   - Never disable or bypass the pre-commit hooks

2. **If You Accidentally Commit a Secret**
   - Immediately rotate the compromised credentials
   - Contact the repository administrator
   - Do NOT simply delete the secret as it remains in Git history

### Code Security

1. **SQL Injection Prevention**
   - Always use Prisma's parameterized queries
   - Never concatenate user input directly into SQL queries

2. **Authentication**
   - Use Supabase authentication mechanisms
   - Never implement custom authentication bypasses

3. **Authorization**
   - Respect Row Level Security (RLS) policies in Supabase
   - Test all endpoints with different user roles

## License

This project is licensed under the MIT License - see the LICENSE file for details.