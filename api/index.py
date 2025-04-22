from flask import Flask, request, jsonify
import os
from supabase import create_client, Client

app = Flask(__name__)

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

@app.route("/api/hello")
def hello_world():
    return "<p>Hello, World!</p>"

if __name__ == "__main__":
    app.run(debug=True)