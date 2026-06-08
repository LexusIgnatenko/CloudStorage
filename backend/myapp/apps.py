import os
from django.apps import AppConfig
from django.conf import settings

def setup_signals():
    import myapp.signals

class MyappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'myapp'

    def ready(self):
        setup_signals()
        
        base_dirs = [
            settings.FILE_STORAGE_BASE_DIR,
            settings.MEDIA_ROOT,
        ]
        for directory in base_dirs:
            os.makedirs(directory, mode=0o700, exist_ok=True)
    