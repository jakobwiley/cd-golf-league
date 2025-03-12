# Country Drive Golf League

A web application for managing the Country Drive Golf League, including teams, players, matches, and standings.

## Features

- Team management (add, edit, delete teams)
- Player management (add, edit, delete players)
- Match scheduling and scoring
- Standings and statistics
- Mobile-friendly design
- Offline support with PWA capabilities

## Mock Data System

The application uses a mock data system when no database connection is available. This allows for development and testing without requiring a real database.

### Mock Teams

The application comes pre-populated with the following teams:
1. Nick/Brent
2. Hot/Huerter
3. Ashley/Alli
4. Brew/Jake
5. Sketch/Rob
6. Trev/Murph
7. Ryan/Drew
8. AP/JohnP
9. Clauss/Wade
10. Brett/Tony

### Mock Players

Players can be added to teams and will persist between page refreshes as long as the server is running.

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Deployment

The application is deployed on Vercel. To deploy your own version:

```bash
# Deploy to Vercel
vercel
```

## License

MIT