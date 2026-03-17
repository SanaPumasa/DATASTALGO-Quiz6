import requests
from django.conf import settings
import base64
from django.core.cache import cache

class PayPalClient:
    """PayPal API Client for Sandbox Integration"""
    
    def __init__(self):
        self.client_id = settings.PAYPAL_CLIENT_ID
        self.client_secret = settings.PAYPAL_CLIENT_SECRET
        self.mode = settings.PAYPAL_MODE
        self.base_url = "https://api.sandbox.paypal.com" if self.mode == "sandbox" else "https://api.paypal.com"
    
    def get_access_token(self):
        """Get PayPal access token"""
        # Try to get cached token
        cached_token = cache.get('paypal_access_token')
        if cached_token:
            return cached_token
        
        url = f"{self.base_url}/v1/oauth2/token"
        auth = base64.b64encode(f"{self.client_id}:{self.client_secret}".encode()).decode()
        
        headers = {
            "Authorization": f"Basic {auth}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        data = {"grant_type": "client_credentials"}
        
        try:
            response = requests.post(url, headers=headers, data=data)
            response.raise_for_status()
            token = response.json()['access_token']
            cache.set('paypal_access_token', token, 3600)
            return token
        except Exception as e:
            raise Exception(f"Failed to get PayPal access token: {str(e)}")
    
    def create_order(self, amount, currency="USD", description=""):
        """Create a PayPal order"""
        token = self.get_access_token()
        url = f"{self.base_url}/v2/checkout/orders"
        
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        body = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": currency,
                        "value": str(amount)
                    },
                    "description": description
                }
            ],
            "payment_source": {
                "paypal": {
                    "experience_context": {
                        "return_url": "http://localhost:3000/subscription",
                        "cancel_url": "http://localhost:3000/subscription"
                    }
                }
            }
        }
        
        try:
            response = requests.post(url, json=body, headers=headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            raise Exception(f"Failed to create PayPal order: {str(e)}")
    
    def capture_order(self, order_id):
        """Capture a PayPal order"""
        token = self.get_access_token()
        url = f"{self.base_url}/v2/checkout/orders/{order_id}/capture"
        
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.post(url, headers=headers, json={})
            response.raise_for_status()
            return response.json()
        except Exception as e:
            raise Exception(f"Failed to capture PayPal order: {str(e)}")
