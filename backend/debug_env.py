import os
from dotenv import load_dotenv

# Path check
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, ".env")

print(f"Checking for .env at: {env_path}")
print(f"File exists: {os.path.exists(env_path)}")

load_dotenv(dotenv_path=env_path)
key = os.getenv("GEMINI_API_KEY")

if key:
    print(f"✅ Key found: {key[:8]}...")
else:
    print("❌ Key NOT found")
