# Scamless

A tool that scrapes an Amazon product and its reviews, scores each review with a fine-tuned sentiment model, and charts the results to help judge how credible the product is. Built as my bachelor's thesis and presented as a poster at EEML 2024.

**Demo:** [scamless.gerind.dev](https://scamless.gerind.dev) (UI demo — front end only; the scraping and model APIs are not hosted)

![Scamless welcome screen with service cards](docs/screenshot.webp)

## Features

- Paste an Amazon product URL; a Puppeteer crawler (stealth plugin) collects the title, price, description, product details and reviews
- Each review is classified by [`GerindT/distilbert-emotion-mini-amazon`](https://huggingface.co/GerindT/distilbert-emotion-mini-amazon), a DistilBERT model fine-tuned on Amazon reviews (training notebooks in `modelTraining/`)
- TF-IDF feature extraction over the product text and reviews
- Searches Amazon for related products in a similar price range, using the extracted features as the query
- Line, scatter, heatmap and pie charts of the sentiment results, with sidebar settings for what to show

## Stack

- Front end: [React 18](https://react.dev) with [Vite](https://vite.dev), [Tailwind CSS](https://tailwindcss.com), [Flowbite React](https://flowbite-react.com), [ECharts](https://echarts.apache.org)
- Scraping API: Node.js, Express, Puppeteer (`puppeteer-extra`), `simple-statistics`
- Model API: Flask, Hugging Face Transformers, NLTK, scikit-learn
- Model training: Jupyter notebooks with Hugging Face Transformers

## Project structure

```
webScraping/
├── frontend/               # React app (search bar, charts, recommendations)
├── backend/
│   ├── nodeAPI/            # Express + Puppeteer scraper, GET /api/data?url=
│   └── flaskAPI/           # Flask sentiment + TF-IDF service, POST /api
└── modelTraining/          # notebooks used to fine-tune the DistilBERT model
```

## Run locally

Requires Node 18+ and Python 3.8+. The Node API calls the Flask API, and the front end calls the Node API.

**Model API** (port 4000, set in `backend/flaskAPI/.flaskenv`):

```sh
cd backend/flaskAPI
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
flask run
```

**Scraping API** (port 3000):

```sh
cd backend/nodeAPI
npm install
npm run dev
```

**Front end** (port 5173):

```sh
cd frontend
npm install
npm run dev
```

Environment variables (names only):

| Where | Variable | Purpose |
| --- | --- | --- |
| `frontend` | `VITE_DEV_API_URL`, `VITE_PROD_API_URL` | Node API base URL in dev / production builds |
| `backend/nodeAPI` | `NODE_ENV`, `PUPPETEER_EXECUTABLE_PATH` | production mode and the Chrome binary to use |
| `backend/flaskAPI` | `FLASK_ENV` | `development` allows CORS from `localhost:3000` |

In production mode the Node API's Flask URL and both APIs' CORS origins are hard-coded in `routes.js`, `app.js` and `app.py`.

## Deploy

- Front end: hosted on Cloudflare Workers (static assets) at scamless.gerind.dev. From `frontend/`, `npm run deploy` builds and uploads `dist/` (config in `frontend/wrangler.jsonc`; run `npx wrangler login` once).
- Node API: `backend/nodeAPI/Dockerfile` builds on the official Puppeteer image (it was on Render).
- Flask API: `backend/flaskAPI/Dockerfile` runs gunicorn, but expects a `gunicorn_config.py` that is not in the repo.

## License

[Apache 2.0](LICENSE)
