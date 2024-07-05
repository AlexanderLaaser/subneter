from django.urls import path
from . import views

urlpatterns = [
    path('register_user', views.register_user, name='register_user'),
    path('login_user', views.login_user, name='login_user'),
    path('logout_user', views.logout_user, name='logout_user'),
    path('get_current_user', views.get_current_user, name='get_current_user'),
    path('check_email', views.check_email, name='check_email'),
]