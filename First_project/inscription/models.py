from django.db import models

class Candidat(models.Model):
    nom = models.CharField(max_length=100)
    prenoms = models.CharField(max_length=100)
    niveau_etudes = models.CharField(max_length=100)
    etablissement_origine = models.CharField(max_length=150)
    concours_souhaite = models.CharField(max_length=100)
    
    extrait_naissance = models.FileField(upload_to='documents/')
    certificat = models.FileField(upload_to='documents/')
    lettre_motivation = models.FileField(upload_to='documents/')
    diplome = models.FileField(upload_to='documents/')
    photo = models.ImageField(upload_to='photos/')

    date_inscription = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nom} {self.prenoms}"
