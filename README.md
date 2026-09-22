# Marks Tracker

The hosted version uses Firebase Authentication and Cloud Firestore. `server.js` remains available for local SQLite development.

## Run locally

```powershell
npm install
npm start
```

Open `http://localhost:3000`. Scores are stored in `marks.db` by default.

## Firebase setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
2. Create a Web app in the project and copy its configuration into `firebase-config.js`.
3. Enable **Authentication > Sign-in method > Anonymous**.
4. Create a **Firestore Database**.
5. Deploy the Hosting site and Firestore rules with the Firebase CLI:

```powershell
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy
```

The shared scores are stored in `trackers/girlfriend`. The included rules allow authenticated anonymous sessions to read and write that single document.

## Legacy SQLite hosting

Deploy this folder as a Node.js service and run `npm start`. Set `PORT` when the host provides one. Set `DATABASE_PATH` to a persistent mounted volume, such as `/data/marks.db`, so scores survive redeploys. The app serves `marks.html` and the `/api/scores` endpoint from the same origin.

### Render deployment

The included `render.yaml` configures the Node service and a persistent disk automatically:

1. Upload the `marks` folder to a GitHub repository.
2. In Render, choose **New > Blueprint** and select that repository.
3. Confirm the service and disk settings, then deploy.
4. Share the generated `.onrender.com` URL.

For multiple app instances, replace SQLite with a managed database and keep the same API contract.
