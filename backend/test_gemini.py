import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Error: GEMINI_API_KEY not found in .env file.")
    exit(1)

print(f"--- Gemini API Test ---")
print(f"API Key found: {api_key[:8]}...")

try:
    genai.configure(api_key=api_key)
    
    print("\n1. Fetching available models...")
    models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
    
    if not models:
        print("❌ No models found that support 'generateContent'.")
        exit(1)

    print(f"Found {len(models)} candidate models.")
    
    working_model = None
    for model_name in models:
        # Clean up the name (remove 'models/' prefix if present for display)
        display_name = model_name.replace("models/", "")
        print(f"\n--- Testing: {display_name} ---")
        
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Say 'OK'")
            
            if response and response.text:
                print(f"✅ SUCCESS! Model {display_name} is working.")
                print(f"Response: {response.text.strip()}")
                working_model = display_name
                break
        except Exception as e:
            error_msg = str(e).split('\n')[0] # Get first line of error
            print(f"❌ Failed: {error_msg}")

    if working_model:
        print(f"\n✨ FINAL RESULT: Use model name '{working_model}' in your ai_service.py")
    else:
        print("\n❌ All models failed. Please check your API key permissions or quota on Google AI Studio.")

except Exception as e:
    print(f"❌ Script Error: {str(e)}")
