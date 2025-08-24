# Book a Band Server

This is the backend server for the Book a Band project.

## Tech Stack
- Node.js
- Express
- TypeScript
- MongoDB (with Mongoose)
- Socket.io
- pnpm

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/) (local or remote)

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd book-a-band-server
   ```
2. Install dependencies:
   ```sh
   pnpm install
   ```
3. Copy the environment template and configure it:
   ```sh
   cp template.env .env
   # Edit .env as needed (see below)
   ```

### Environment Variables

- `PORT` — Server port (default: 5005)
- `MONGODB_URI` — MongoDB connection string
- `TOKEN_SECRET` — JWT secret
- `ENCRYPT_SECRET` — 32-character secret for AES encryption
- `ORIGIN` — Allowed CORS origin

### Running the Development Server

```sh
pnpm dev
```

### Building for Production

```sh
pnpm build
```

### Starting the Production Server

```sh
pnpm start
```

## Project Structure

- `src/` — Main source code (app, routes, models, middleware, utils, etc.)
- `seed/` — Database seeding scripts
- `plop/` — Code generators
- `.env` — Environment variables

## Code Generation

This project uses [Plop](https://plopjs.com/) for scaffolding models, routes, and more. See the `plop/` directory for available generators.

## Linting & Formatting

- ESLint is configured for code linting.
- Run `pnpm lint` to check for lint errors.

## License

MIT

## Author

[Julien Sebag](https://julien-sebag.com)