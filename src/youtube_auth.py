"""
YouTube OAuth2 authentication handler
"""
import os
import pickle
import logging
from typing import Optional
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

logger = logging.getLogger(__name__)

# OAuth2 scopes required for YouTube playlist management
SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']


class YouTubeAuth:
    def __init__(self, credentials_file: str = 'credentials.json', token_file: str = 'token.pickle'):
        self.credentials_file = credentials_file
        self.token_file = token_file
        self.credentials: Optional[Credentials] = None
        
    def authenticate(self) -> Credentials:
        """Authenticate and return YouTube credentials"""
        # Load existing token
        if os.path.exists(self.token_file):
            with open(self.token_file, 'rb') as token:
                self.credentials = pickle.load(token)
                logger.info("Loaded existing credentials from token file")
        
        # If there are no (valid) credentials available, let the user log in
        if not self.credentials or not self.credentials.valid:
            if self.credentials and self.credentials.expired and self.credentials.refresh_token:
                logger.info("Refreshing expired credentials")
                self.credentials.refresh(Request())
            else:
                logger.info("Starting OAuth2 flow")
                if not os.path.exists(self.credentials_file):
                    raise FileNotFoundError(
                        f"Credentials file '{self.credentials_file}' not found. "
                        "Please download it from Google Cloud Console."
                    )
                
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.credentials_file, SCOPES
                )
                # Try multiple ports in case 8080 is taken
                for port in [8080, 8090, 9090]:
                    try:
                        self.credentials = flow.run_local_server(
                            port=port,
                            prompt='consent',
                            access_type='offline'
                        )
                        break
                    except Exception as e:
                        if port == 9090:  # Last port
                            raise e
                        logger.warning(f"Port {port} failed, trying next...")
            
            # Save the credentials for the next run
            with open(self.token_file, 'wb') as token:
                pickle.dump(self.credentials, token)
                logger.info("Saved credentials to token file")
        
        return self.credentials
    
    def get_youtube_service(self):
        """Get authenticated YouTube service"""
        credentials = self.authenticate()
        return build('youtube', 'v3', credentials=credentials)
    
    def create_credentials_json(self, client_id: str, client_secret: str, output_file: str = 'credentials.json'):
        """Create credentials.json file from client ID and secret"""
        credentials_data = {
            "installed": {
                "client_id": client_id,
                "client_secret": client_secret,
                "redirect_uris": [
                    "http://localhost:8080/",
                    "http://localhost:8080",
                    "http://localhost:8090/",
                    "http://localhost:8090",
                    "http://localhost:9090/",
                    "http://localhost:9090",
                    "http://127.0.0.1:8080/",
                    "http://127.0.0.1:8080",
                    "urn:ietf:wg:oauth:2.0:oob"
                ],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "project_id": "youtube-playlist-generator"
            }
        }
        
        import json
        with open(output_file, 'w') as f:
            json.dump(credentials_data, f, indent=2)
        
        logger.info(f"Created credentials file: {output_file}")
        return output_file