import os
from datetime import timedelta
from pathlib import Path

import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
# Environ
env = environ.Env()
environ.Env.read_env()
ENVIRONMENT = env

SITE_NAME = 'Greenbox'

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['py.au.ngrok.io', 'sct.greenbox.pe', 'localhost', 'nx.in.ngrok.io','*']
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

if not DEBUG:
    CORS_ORIGIN_WHITELIST = ['http://sct.greenbox.pe', 'https://sct.greenbox.pe']
    CSRF_TRUSTED_ORIGINS = ['http://sct.greenbox.pe', 'https://sct.greenbox.pe']
# CSRF_TRUSTED_ORIGINS = ['https://py.au.ngrok.io', 'http://py.au.ngrok.io', 'https://nx.in.ngrok.io','http://localhost:8000']

# Application definition
DJANGO_APPS = ['django.contrib.admin', 'django.contrib.auth', 'django.contrib.contenttypes', 'django.contrib.sessions',
               'django.contrib.messages', 'django.contrib.staticfiles', ]

PROJECT_APPS = ['apps.users', 'apps.staff', 'apps.tracking']

THIRD_PARTY_APPS = ['corsheaders', 'simple_history', 'rest_framework', 'import_export', 'djoser',
                    'rest_framework_simplejwt', 'rest_framework_simplejwt.token_blacklist', ]
INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + PROJECT_APPS

MIDDLEWARE = ['django.middleware.security.SecurityMiddleware',
              'django.contrib.sessions.middleware.SessionMiddleware', 'corsheaders.middleware.CorsMiddleware',
              'django.middleware.common.CommonMiddleware', 'django.middleware.csrf.CsrfViewMiddleware',
              'django.contrib.auth.middleware.AuthenticationMiddleware',
              'django.contrib.messages.middleware.MessageMiddleware',
              'django.middleware.clickjacking.XFrameOptionsMiddleware',
              'simple_history.middleware.HistoryRequestMiddleware', ]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'build')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

# Database
# DATABASES = {
#     "default": env.db("DATABASE_URL", default="postgres:///sct_ddbb"),
# }

# Database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

DATABASES["default"]["ATOMIC_REQUESTS"] = True

# Password validation

PASSWORD_HASHERS = ["django.contrib.auth.hashers.Argon2PasswordHasher",
                    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
                    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
                    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher", ]
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'es-PE'

TIME_ZONE = 'America/Lima'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = '/static/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = '/media/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'build/static')]

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# # Rest Framework
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticated',),
    'DEFAULT_AUTHENTICATION_CLASSES': ('rest_framework_simplejwt.authentication.JWTAuthentication',), }

# JWT
SIMPLE_JWT = {'AUTH_HEADER_TYPES': ('JWT',), 'ACCESS_TOKEN_LIFETIME': timedelta(minutes=10080),
              'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
              'BLACKLIST_AFTER_ROTATION': True, 'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',)}

# Djoser
DJOSER = {'LOGIN_FIELD': 'email', 'SERIALIZERS': {'user_create': 'apps.users.serializers.UserCreateSerializer',
                                                  'user': 'apps.users.serializers.UserCreateSerializer',
                                                  'current_user': 'apps.users.serializers.UserCreateSerializer',
                                                  'user_delete': 'djoser.serializers.UserDeleteSerializer', }, }

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTHENTICATION_BACKENDS = ('django.contrib.auth.backends.ModelBackend',)
AUTH_USER_MODEL = "users.UserAccount"
