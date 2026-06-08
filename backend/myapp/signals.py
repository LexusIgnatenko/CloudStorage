# backend/myapp/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.conf import settings
import os

from .models import CustomUser, FileStorage

# --- Сигнал для создания папки пользователя ---
@receiver(post_save, sender=CustomUser)
def create_user_storage_folder(sender, instance, created, **kwargs):
    """
    Создает папку на диске для нового пользователя.
    """
    if created:
        user_dir = os.path.join(settings.FILE_STORAGE_BASE_DIR, instance.username)
        os.makedirs(user_dir, mode=0o700, exist_ok=True)
        print(f"Сигнал: Создана папка для пользователя {instance.username}")

# --- Сигнал для удаления папки пользователя (опционально) ---
@receiver(post_delete, sender=CustomUser)
def delete_user_storage_folder(sender, instance, **kwargs):
    """
    Удаляет папку пользователя с диска при удалении его аккаунта.
    """
    user_dir = os.path.join(settings.FILE_STORAGE_BASE_DIR, instance.username)
    if os.path.exists(user_dir):
        # Удаление непустой папки требует рекурсивного вызова
        import shutil
        shutil.rmtree(user_dir)
        print(f"Сигнал: Удалена папка пользователя {instance.username}")