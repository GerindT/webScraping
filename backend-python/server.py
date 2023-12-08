# server.py
from quart import Quart, request, jsonify
from index import run_crawler
from quart_cors import cors, route_cors
import asyncio

app = Quart(__name__)
app = cors(app, allow_origin="*")

app.config["DEBUG"] = True
app.config["SINGLE_PROCESS"] = True


async def fetch_data(url):
    try:
        data = await run_crawler([url])
        return data[0]
    except Exception as e:
        print(e)
        return {"error": "An error occurred while fetching the data."}


@app.route("/api/data", methods=["GET"])
@route_cors(allow_origin="http://localhost:5173")
async def get_data():
    try:
        # url = "https://www.amazon.com/Apple-iPhone-11-64GB-Black/dp/B07ZPKZSSC/ref=sr_1_3?dchild=1&keywords=iphone&qid=1614150000&sr=8-3"
        url = request.args.get("url")

        if not url:
            return jsonify({"error": "URL parameter is missing."}), 400

        if "amazon" not in url:
            return jsonify({"error": "Invalid URL."}), 400

        data = await asyncio.gather(fetch_data(url))

        return jsonify(data)
    except Exception as e:
        print(e)
        return jsonify({"error": "An error occurred while fetching the data."}), 500


if __name__ == "__main__":
    app.run()
