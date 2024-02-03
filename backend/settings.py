import os
from dotenv import load_dotenv

load_dotenv()

OPEN_AI_SECRET_KEY = os.getenv('OPEN_AI_SECRET_KEY')
