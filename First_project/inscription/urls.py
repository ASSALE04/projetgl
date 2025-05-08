# inscription/urls.py
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', views.home, name='home'),  # Page d'accueil, qui appelle la vue 'home'
    path('inscrire/', views.inscrire, name='inscrire'),
    path('liste/', views.liste_candidats, name='liste_candidats'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)