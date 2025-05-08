from django.shortcuts import render, redirect
from .models import Candidat
from .forms import CandidatForm

# Vue d'inscription
def inscrire(request):
    if request.method == 'POST':
        form = CandidatForm(request.POST, request.FILES)
        if form.is_valid():
            candidat = form.save()
            # Redirection vers une page de reçu avec les détails du candidat
            return render(request, 'inscription/recu.html', {'candidat': candidat})
        # Si le formulaire est invalide, renvoyer avec un message d'erreur
        return render(request, 'inscription/formulaire.html', {
            'form': form,
            'erreur': 'Veuillez corriger les erreurs ci-dessous.'
        })
    else:
        form = CandidatForm()
    return render(request, 'inscription/formulaire.html', {'form': form})

# Vue pour la page d'accueil
def home(request):
    return render(request, 'inscription/home.html')

# Vue pour lister les candidats
def liste_candidats(request):
    candidats = Candidat.objects.all()
    return render(request, 'inscription/liste.html', {'candidats': candidats})
