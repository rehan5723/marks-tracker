# Marks Tracker

## Run locally

```powershell
npm install
npm start
```

Open `http://localhost:3000`. Scores are stored in `marks.db` by default.

## Hosting

Deploy this folder as a Node.js service and run `npm start`. Set `PORT` when the host provides one. Set `DATABASE_PATH` to a persistent mounted volume, such as `/data/marks.db`, so scores survive redeploys. The app serves `marks.html` and the `/api/scores` endpoint from the same origin.

### Render deployment

The included `render.yaml` configures the Node service and a persistent disk automatically:

1. Upload the `marks` folder to a GitHub repository.
2. In Render, choose **New > Blueprint** and select that repository.
3. Confirm the service and disk settings, then deploy.
4. Share the generated `.onrender.com` URL.

For multiple app instances, replace SQLite with a managed database and keep the same API contract.
