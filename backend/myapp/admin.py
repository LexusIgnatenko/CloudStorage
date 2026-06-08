from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

# Импортируем ваши модели
from .models import CustomUser, FileStorage

# 1. Регистрация модели CustomUser
# Используем UserAdmin, чтобы получить стандартные поля (пароль, права и т.д.)
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """
    Класс для управления пользователями в админ-панели.
    UserAdmin уже содержит логику для работы с паролями и правами.
    """
    # Вы можете здесь настроить, какие поля отображать в списке
    list_display = ('username', 'email', 'is_admin', 'is_active', 'date_joined')
    # Какие поля использовать для поиска
    search_fields = ('username', 'email')


# 2. Регистрация модели FileStorage
@admin.register(FileStorage)
class FileStorageAdmin(admin.ModelAdmin):
    """
    Класс для управления файлами в админ-панели.
    """
    # Поля, которые будут видны в общем списке файлов
    list_display = ('original_name', 'owner', 'size', 'upload_date', 'last_download')
    
    # Добавляем фильтры в правой панели для удобной навигации
    list_filter = ('upload_date', 'owner')
    
    # Поля, по которым можно искать файлы
    search_fields = ('original_name', 'owner__username')
    
    # Делаем некоторые поля только для чтения, чтобы их нельзя было случайно изменить
    readonly_fields = ('upload_date', 'last_download', 'size')