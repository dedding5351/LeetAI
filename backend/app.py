from flask import Flask
from backend.routes import chat

app = Flask(__name__)

# Register blueprints
app.register_blueprint(chat.blueprint, url_prefix='/chat')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
