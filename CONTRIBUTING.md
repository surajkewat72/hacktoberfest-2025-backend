# Contributing Guidelines

Thank you for considering contributing to **Open Code Chicago**!  
We welcome contributions of all skill levels.  

---

## Prerequisites
- Node.js (v20 or later)
- npm (comes with Node.js)
- MongoDB (local or Atlas connection)

---

## Local Setup Steps

1. **Set up your own MongoDB database**
  - Use MongoDB Atlas (free tier) or run MongoDB locally.
2. **Copy environment variables**
  - Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
  - Fill in your own values for `MONGODB_URI` and other variables in `.env`.
3. **Seed the database**
  - Run the seed script to populate your local database with sample data:
    ```bash
    npm run seed
    ```
4. **Start the development server**
  - Run:
    ```bash
    npm run dev
    ```
5. **Lint your code before committing**
  - Run:
    ```bash
    npm run lint
    ```

---

## Before You Start
- Please read our [Code of Conduct](./CODE_OF_CONDUCT.md)  
- Review our [Usage Guide](./docs/usage.md) to set up the backend locally  
- Check [open issues](https://github.com/OpenCodeChicago/hacktoberfest-2025-backend/issues) for available work  
- Review our [Project Board](https://github.com/orgs/OpenCodeChicago/projects/2) to see **assigned tasks**  
  - Comment on a task you’d like to work on so a maintainer can assign it to you  
  - This prevents duplicate work and keeps efforts coordinated  

---

## How to Contribute
1. Fork the repository and create a new branch  
   - Suggested naming: `feature/your-feature`, `fix/your-bug`  
2. Make your changes and commit with clear messages  
3. Open a Pull Request (PR) to the `main` branch  
4. Reference any related issues in your PR (e.g., `Fixes #123`)  

---

## Guidelines
- Follow our [Code of Conduct](./CODE_OF_CONDUCT.md)  
- Use clear, descriptive commit messages  
- Keep PRs focused on a single change (small & clear)  
- Write clean, well-documented code  
- If possible, include tests for new features  

---

## Issues
- Use issues to report bugs, request features, or ask questions  
- Before opening a new issue, check if it already exists  
- Tag issues with labels (e.g., `bug`, `enhancement`, `good first issue`)  

---

## Getting Help
If you’re stuck or unsure, feel free to reach out:  

📧 [info@opencodechicago.org](mailto:info@opencodechicago.org)  

Every contribution matters — big or small.
