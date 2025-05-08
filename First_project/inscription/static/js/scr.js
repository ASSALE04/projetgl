document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation du formulaire...');
    
    // Fonction de débogage pour vérifier l'état du DOM
    function debugFormStructure() {
        console.log('Structure du formulaire:');
        console.log('Nombre d\'étapes:', formSteps.length);
        formSteps.forEach((step, index) => {
            console.log(`Étape ${index + 1} ID:`, step.id);
        });
        console.log('Nombre de boutons suivant:', nextButtons.length);
        console.log('Nombre de boutons précédent:', prevButtons.length);
    }
    
    // Sélection des éléments
    const form = document.getElementById('inscriptionForm');
    const steps = document.querySelectorAll('.step');
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const resetButton = document.querySelector('.reset-btn');
    const submitButton = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    // Gestion des uploads de fichiers
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileName = this.files[0] ? this.files[0].name : '';
            const fileNameElement = document.getElementById(this.id + 'Name');
            if (fileNameElement) {
                fileNameElement.textContent = fileName;
            }
        });
    });
    
    // Navigation entre les étapes
    function goToStep(stepNumber) {
        console.log('Passage à l\'étape ' + stepNumber);
        
        // Vérifier que l'étape existe
        const targetStep = document.getElementById('step' + stepNumber);
        if (!targetStep) {
            console.error('Étape ' + stepNumber + ' introuvable!');
            return;
        }
        
        formSteps.forEach(step => {
            step.classList.remove('active');
            step.style.display = 'none'; // Cacher explicitement toutes les étapes
        });
        
        steps.forEach(step => step.classList.remove('active'));
        
        // Afficher l'étape actuelle
        targetStep.classList.add('active');
        targetStep.style.display = 'block'; // Afficher explicitement l'étape actuelle
        
        const currentStepIndicator = document.querySelector(`.step[data-step="${stepNumber}"]`);
        if (currentStepIndicator) {
            currentStepIndicator.classList.add('active');
        } else {
            console.error('Indicateur pour l\'étape ' + stepNumber + ' introuvable!');
        }
        
        // Marquer les étapes précédentes comme complétées
        steps.forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            if (stepNum < stepNumber) {
                step.classList.add('completed');
            } else {
                step.classList.remove('completed');
            }
        });
        
        // Si nous sommes à l'étape 4, vérifier l'élément recapInfo avant de générer le récapitulatif
        if (stepNumber === 4) {
            try {
                // Vérifier d'abord l'existence de l'élément
                checkRecapElement();
                // Puis générer le récapitulatif
                generateRecap();
            } catch (error) {
                console.error('Erreur lors de la génération du récapitulatif:', error);
            }
        }
    }
    
    // Validation du formulaire
    function validateStep(stepNumber) {
        const currentStep = document.getElementById('step' + stepNumber);
        const fields = currentStep.querySelectorAll('input, select');
        let isValid = true;
        
        fields.forEach(field => {
            if (field.hasAttribute('required')) {
                // Recherche correcte de l'élément d'erreur
                let errorElement;
                if (field.parentElement.querySelector('.error-message')) {
                    errorElement = field.parentElement.querySelector('.error-message');
                } else {
                    // Remontez dans le DOM pour trouver le message d'erreur
                    const formGroup = field.closest('.form-group');
                    if (formGroup) {
                        errorElement = formGroup.querySelector('.error-message');
                    }
                }
                
                // Vérifier si errorElement existe avant de continuer
                if (!errorElement) {
                    console.error('Message d\'erreur non trouvé pour:', field);
                    return;
                }
                
                if (field.type === 'file') {
                    if (!field.files || field.files.length === 0) {
                        isValid = false;
                        errorElement.style.display = 'block';
                    } else {
                        errorElement.style.display = 'none';
                    }
                } else if (field.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!field.value.trim() || !emailRegex.test(field.value)) {
                        isValid = false;
                        errorElement.style.display = 'block';
                    } else {
                        errorElement.style.display = 'none';
                    }
                } else if (field.type === 'tel') {
                    // Regex de téléphone plus souple 
                    const phoneRegex = /^\d{8,}$/;
                    if (!field.value.trim() || !phoneRegex.test(field.value.replace(/\D/g, ''))) {
                        isValid = false;
                        errorElement.style.display = 'block';
                    } else {
                        errorElement.style.display = 'none';
                    }
                } else if (field.type === 'checkbox') {
                    if (!field.checked) {
                        isValid = false;
                        errorElement.style.display = 'block';
                    } else {
                        errorElement.style.display = 'none';
                    }
                } else {
                    if (!field.value.trim()) {
                        isValid = false;
                        errorElement.style.display = 'block';
                    } else {
                        errorElement.style.display = 'none';
                    }
                }
            }
        });
        
        // Pour débogage - activer pour voir la valeur de isValid dans la console
        console.log('Étape ' + stepNumber + ' validation:', isValid);
        
        return isValid;
    }
    
    function checkRecapElement() {
        const recap = document.getElementById('recapInfo');
        if (!recap) {
            // Créer l'élément s'il n'existe pas
            const step4 = document.getElementById('step4');
            if (step4) {
                console.log("Création de l'élément recapInfo manquant");
                const newRecapInfo = document.createElement('div');
                newRecapInfo.id = 'recapInfo';
                newRecapInfo.className = 'recap-container';
                
                // Trouver l'endroit où insérer le récapitulatif
                const targetElement = step4.querySelector('.form-content') || step4;
                targetElement.insertBefore(newRecapInfo, targetElement.querySelector('.form-buttons'));
            } else {
                throw new Error("L'élément avec l'ID 'step4' est introuvable.");
            }
        }
        console.log("L'élément 'recapInfo' est présent.");
    }
    
    // Génération du récapitulatif
    function generateRecap() {
        const recapInfo = document.getElementById('recapInfo');
        
        // Vérifier si l'élément existe
        if (!recapInfo) {
            console.error("L'élément recapInfo n'a pas été trouvé dans le DOM");
            return; // Sortir de la fonction si l'élément n'existe pas
        }
        
        console.log("Génération du récapitulatif...");
        
        // Récupérer les valeurs des champs avec vérification
        const nom = document.getElementById('nom') ? document.getElementById('nom').value : 'Non renseigné';
        const prenom = document.getElementById('prenom') ? document.getElementById('prenom').value : 'Non renseigné';
        const dateNaissance = document.getElementById('dateNaissance') ? document.getElementById('dateNaissance').value : 'Non renseigné';
        const lieuNaissance = document.getElementById('lieuNaissance') ? document.getElementById('lieuNaissance').value : 'Non renseigné';
        const nationalite = document.getElementById('nationalite') ? document.getElementById('nationalite').value : 'Non renseigné';
        const adresse = document.getElementById('adresse') ? document.getElementById('adresse').value : 'Non renseigné';
        const telephone = document.getElementById('telephone') ? document.getElementById('telephone').value : 'Non renseigné';
        const email = document.getElementById('email') ? document.getElementById('email').value : 'Non renseigné';
        
        // Pour les éléments select, vérifier également s'ils existent
        let niveauEtudeText = 'Non renseigné';
        const niveauEtude = document.getElementById('niveauEtude');
        if (niveauEtude && niveauEtude.selectedIndex >= 0) {
            niveauEtudeText = niveauEtude.options[niveauEtude.selectedIndex].text;
        }
        
        const etablissement = document.getElementById('etablissement') ? document.getElementById('etablissement').value : 'Non renseigné';
        
        let filiereText = 'Non renseigné';
        const filiere = document.getElementById('filiere');
        if (filiere && filiere.selectedIndex >= 0) {
            filiereText = filiere.options[filiere.selectedIndex].text;
        }
        
        let concoursText = 'Non renseigné';
        const concours = document.getElementById('concours');
        if (concours && concours.selectedIndex >= 0) {
            concoursText = concours.options[concours.selectedIndex].text;
        }
        
        // Vérification des fichiers
        const photo = document.getElementById('photo') && document.getElementById('photo').files[0] 
            ? document.getElementById('photo').files[0].name 
            : 'Aucun fichier';
        
        const cv = document.getElementById('cv') && document.getElementById('cv').files[0] 
            ? document.getElementById('cv').files[0].name 
            : 'Aucun fichier';
        
        const diplome = document.getElementById('diplome') && document.getElementById('diplome').files[0] 
            ? document.getElementById('diplome').files[0].name 
            : 'Aucun fichier';
        
        // Formater la date avec vérification
        let formattedDate = 'Non renseigné';
        if (dateNaissance && dateNaissance !== 'Non renseigné') {
            try {
                const dateObj = new Date(dateNaissance);
                formattedDate = dateObj.toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            } catch (e) {
                console.error("Erreur lors du formatage de la date:", e);
            }
        }
        
        console.log("Valeurs récupérées pour le récapitulatif:", {
            nom, prenom, dateNaissance, formattedDate, lieuNaissance, nationalite, adresse, 
            telephone, email, niveauEtudeText, etablissement, filiereText, concoursText,
            photo, cv, diplome
        });
        
        
        // Générer le HTML du récapitulatif
        recapInfo.innerHTML = `
        <div class="recap-section">
            <h3>Informations Personnelles</h3>
            <div class="recap-grid">
                <div class="recap-item">
                    <span class="recap-label">Nom:</span>
                    <span class="recap-value">${nom}</span>
                </div>
                <div class="recap-item">
                    <span class="recap-label">Prénom:</span>
                    <span class="recap-value">${prenom}</span>
                </div>
                <div class="recap-item">
                    <span class="recap-label">Date de naissance:</span>
                    <span class="recap-value">${formattedDate}</span>
                </div>
                <div class="recap-item">
                    <span class="recap-label">Lieu de naissance:</span>
                    <span class="recap-value">${lieuNaissance}</span>
                </div>
                <div class="recap-item">
                    <span class="recap-label">Nationalité:</span>
                    <span class="recap-value">${nationalite}</span>
                </div>
                <div class="recap-item">
                    <span class="recap-label">Adresse:</span>
                    <span class="recap-value">${adresse}</span>
                </div>
                <div class="recap-item">
                    <span class="recap-label">Téléphone:</span>
                    <span class="recap-value">${telephone}</span>
                </div>
                <div class="recap-item">
                    <span class="recap-label">Email:</span>
                    <span class="recap-value">${email}</span>
                </div>
            </div>
        </div>
        
        <div class="recap-section">
            <h3>Informations Académiques</h3>
            <div class="recap-grid">
                <div class="recap-item">
                    <span class="recap-label">Niveau d'étude:</span>
                    <span class="recap-value">${niveauEtudeText}</span>
                </div>
                <div class="recap-item">
                    <span class="recap-label">Établissement précédent:</span>
                    <span class="recap-value">${etablissement}</span>
                </div>
                <div class="recap-item">
                    <span class="recap-label">Filière souhaitée:</span>
                    <span class="recap-value">${filiereText}</span>
                </div>
                <div class="recap-item">
                    <span class="recap-label">Type de concours:</span>
                    <span class="recap-value">${concoursText}</span>
                </div>
            </div>
        </div>
        
        <div class="recap-section">
            <h3>Documents Fournis</h3>
            <div class="recap-grid">
                <div class="recap-item">
                    <span class="recap-label">Photo d'identité:</span>
                    <span class="recap-value">${photo}</span>
                </div>
                <div class="recap-item">
                    <span class="recap-label">CV:</span>
                    <span class="recap-value">${cv}</span>
                </div>
                <div class="recap-item">
                    <span class="recap-label">Diplôme:</span>
                    <span class="recap-value">${diplome}</span>
                </div>
            </div>
        </div>
    `;
     console.log("HTML du récapitulatif généré:", recapInfo.innerHTML);
    }
    
    // Event listeners pour les boutons Suivant
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.getAttribute('data-next')) - 1;
            const nextStep = parseInt(this.getAttribute('data-next'));
            
            console.log('Tentative de passer de l\'étape ' + currentStep + ' à l\'étape ' + nextStep);
            
            // CORRECTION : Active la validation avant de passer à l'étape suivante
            if (validateStep(currentStep)) {
                goToStep(nextStep);
            } else {
                console.log('Validation de l\'étape ' + currentStep + ' échouée');
                // Optionnel : Afficher un message d'erreur global
                alert('Veuillez remplir tous les champs obligatoires avant de continuer.');
            }
        });
    });
    
    // Event listeners pour les boutons Précédent
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.getAttribute('data-prev'));
            goToStep(prevStep);
        });
    });
    
    // Event listener pour le bouton de réinitialisation
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            if (confirm('Voulez-vous vraiment réinitialiser le formulaire ? Toutes les données saisies seront perdues.')) {
                form.reset();
                document.querySelectorAll('.file-name').forEach(element => {
                    element.textContent = '';
                });
                document.querySelectorAll('.error-message').forEach(element => {
                    element.style.display = 'none';
                });
                goToStep(1);
            }
        });
    }
    
    // Event listener pour le bouton de soumission
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Vérifier si l'étape 4 existe réellement
            const step4 = document.getElementById('step4');
            if (!step4) {
                console.error("L'étape 4 n'existe pas dans le DOM");
                return;
            }
            
            // Récupérer toutes les données du formulaire pour une vérification globale
            const allFieldsFilled = validateAllFields();
            
            if (allFieldsFilled) {
                // Simulation d'envoi de formulaire
                submitButton.disabled = true;
                submitButton.textContent = 'Traitement en cours...';
                
                setTimeout(() => {
                    successMessage.style.display = 'block';
                    submitButton.style.display = 'none';
                    
                    // Enregistrer les données dans le stockage local (pour la démo)
                    saveFormData();
                    
                    // Scroll vers le message de succès
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                }, 2000);
            } else {
                alert('Veuillez vérifier que tous les champs obligatoires ont été remplis correctement.');
            }
        });
    }
    
    // Validation de tous les champs du formulaire
    function validateAllFields() {
        // Vérifier toutes les étapes
        return validateStep(1) && validateStep(2) && validateStep(3);
    }
    
    // Sauvegarde des données dans le stockage local
    function saveFormData() {
        const formData = {
            nom: document.getElementById('nom')?.value || '',
            prenom: document.getElementById('prenom')?.value || '',
            dateNaissance: document.getElementById('dateNaissance')?.value || '',
            lieuNaissance: document.getElementById('lieuNaissance')?.value || '',
            nationalite: document.getElementById('nationalite')?.value || '',
            adresse: document.getElementById('adresse')?.value || '',
            telephone: document.getElementById('telephone')?.value || '',
            email: document.getElementById('email')?.value || '',
            niveauEtude: document.getElementById('niveauEtude')?.value || '',
            etablissement: document.getElementById('etablissement')?.value || '',
            filiere: document.getElementById('filiere')?.value || '',
            concours: document.getElementById('concours')?.value || '',
            // Les fichiers ne peuvent pas être stockés directement dans localStorage
            photoName: document.getElementById('photo')?.files[0]?.name || '',
            cvName: document.getElementById('cv')?.files[0]?.name || '',
            diplomeName: document.getElementById('diplome')?.files[0]?.name || '',
            dateInscription: new Date().toISOString()
        };
        
        localStorage.setItem('inscriptionESATIC', JSON.stringify(formData));
    }
    
    // Animation des champs avec label flottant
    const floatingInputs = document.querySelectorAll('.floating-label input');
    floatingInputs.forEach(input => {
        // Vérifier si le champ a déjà une valeur (par exemple, remplissage automatique)
        if (input.value) {
            input.classList.add('has-value');
        }
        
        input.addEventListener('focus', function() {
            this.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.classList.remove('focused');
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });
    // 1. D'abord, assurez-vous que l'élément successMessage existe dans votre HTML

// Modification à apporter au code JavaScript existant

// Cette fonction corrige le problème du message de succès
function fixSuccessMessage() {
    // 1. D'abord, assurons-nous qu'il n'y a qu'un seul élément avec l'ID 'successMessage'
    const allSuccessMessages = document.querySelectorAll('#successMessage');
    
    // Si plusieurs éléments ont le même ID (ce qui n'est pas valide en HTML), conservons seulement le premier
    if (allSuccessMessages.length > 1) {
        for (let i = 1; i < allSuccessMessages.length; i++) {
            allSuccessMessages[i].id = 'successMessage_' + i;
        }
    }
    
    // 2. Récupérons ou créons notre message de succès principal
    let successMessage = document.getElementById('successMessage');
    
    if (!successMessage) {
        // Créer l'élément s'il n'existe pas
        successMessage = document.createElement('div');
        successMessage.id = 'successMessage';
        successMessage.className = 'success-message';
        
        // Ajouter le contenu HTML
        successMessage.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Félicitations !</h3>
                <p>Votre demande d'inscription a été envoyée avec succès. Nous vous contacterons prochainement.</p>
            </div>
        `;
        
        // Ajouter au DOM dans l'étape 4
        const step4 = document.getElementById('step4');
        const formButtons = step4.querySelector('.form-buttons');
        if (formButtons) {
            step4.insertBefore(successMessage, formButtons);
        } else {
            step4.appendChild(successMessage);
        }
    }
    
    // 3. Assurer que le style est correctement défini
    successMessage.style.display = 'none'; // Caché par défaut
    successMessage.style.backgroundColor = '#e8f5e9';
    successMessage.style.color = '#2e7d32';
    successMessage.style.padding = '20px';
    successMessage.style.borderRadius = '8px';
    successMessage.style.margin = '20px 0';
    successMessage.style.textAlign = 'center';
    successMessage.style.border = '1px solid #a5d6a7';
    
    return successMessage;
}

// Modifier l'événement du bouton de soumission
document.addEventListener('DOMContentLoaded', function() {
    // Autres parties du code existant...
    
    const submitButton = document.getElementById('submitBtn');
    
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Vérifier si l'étape 4 existe
            const step4 = document.getElementById('step4');
            if (!step4) {
                console.error("L'étape 4 n'existe pas dans le DOM");
                return;
            }
            
            // Récupérer toutes les données du formulaire pour une vérification globale
            // Supposons que validateAllFields() existe déjà dans votre code
            const allFieldsFilled = true; // Pour les tests, remplacez par validateAllFields();
            
            if (allFieldsFilled) {
                // Simulation d'envoi de formulaire
                submitButton.disabled = true;
                submitButton.textContent = 'Traitement en cours...';
                
                // Préparer le message de succès
                const successMessage = fixSuccessMessage();
                
                setTimeout(() => {
                    // Afficher le message de succès
                    successMessage.style.display = 'block';
                    
                    // Cacher le bouton de soumission
                    submitButton.style.display = 'none';
                    
                    console.log("Message de succès affiché", successMessage);
                    
                    // Enregistrer les données (si saveFormData existe dans votre code)
                    if (typeof saveFormData === 'function') {
                        saveFormData();
                    }
                    
                    // Scroll vers le message de succès
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                }, 2000);
            } else {
                alert('Veuillez vérifier que tous les champs obligatoires ont été remplis correctement.');
            }
        });
    }
});
// 2. Modifiez la fonction de soumission du formulaire pour s'assurer que le message s'affiche
if (submitButton) {
    submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Vérifier si l'étape 4 existe réellement
        const step4 = document.getElementById('step4');
        if (!step4) {
            console.error("L'étape 4 n'existe pas dans le DOM");
            return;
        }
        
        // Récupérer toutes les données du formulaire pour une vérification globale
        const allFieldsFilled = validateAllFields();
        
        if (allFieldsFilled) {
            // Simulation d'envoi de formulaire
            submitButton.disabled = true;
            submitButton.textContent = 'Traitement en cours...';
            
            // Vérifier si le message de succès existe, sinon le créer
            let successMessage = document.getElementById('successMessage');
            if (!successMessage) {
                console.log("Création d'un élément de message de succès");
                successMessage = document.createElement('div');
                successMessage.id = 'successMessage';
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <div class="success-content">
                        <i class="fas fa-check-circle"></i>
                        <h3>Félicitations !</h3>
                        <p>Votre demande d'inscription a été envoyée avec succès. Nous vous contacterons prochainement.</p>
                    </div>
                `;
                
                // Ajouter des styles directement pour s'assurer que le message est visible
                successMessage.style.display = 'none';
                successMessage.style.backgroundColor = '#e8f5e9';
                successMessage.style.color = '#2e7d32';
                successMessage.style.padding = '20px';
                successMessage.style.borderRadius = '8px';
                successMessage.style.margin = '20px 0';
                successMessage.style.textAlign = 'center';
                successMessage.style.border = '1px solid #a5d6a7';
                
                // Insérer le message dans le DOM
                const formButtons = step4.querySelector('.form-buttons');
                if (formButtons) {
                    step4.insertBefore(successMessage, formButtons);
                } else {
                    step4.appendChild(successMessage);
                }
            }
            
            setTimeout(() => {
                // S'assurer que le message est visible
                successMessage.style.display = 'block';
                
                // Désactiver le bouton de soumission
                submitButton.style.display = 'none';
                
                // Log pour confirmer que le message est affiché
                console.log("Message de succès affiché", successMessage);
                
                // Enregistrer les données dans le stockage local (pour la démo)
                saveFormData();
                
                // Scroll vers le message de succès avec un délai pour s'assurer qu'il est rendu
                setTimeout(() => {
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                }, 100);
                
                // Ajouter une alerte pour confirmer (à des fins de débogage, peut être supprimé plus tard)
                alert("Votre demande d'inscription a été envoyée avec succès !");
            }, 2000);
        } else {
            alert('Veuillez vérifier que tous les champs obligatoires ont été remplis correctement.');
        }
    });
}
    // Initialisation - commencer à l'étape 1
    setTimeout(() => {
        console.log('Initialisation de l\'étape 1');
        
        // Application d'un style direct pour les étapes (solution de contournement)
        formSteps.forEach((step, index) => {
            step.style.display = 'none';
        });
        
        const step1 = document.getElementById('step1');
        if (step1) {
            step1.style.display = 'block';
            step1.classList.add('active');
        }
        
        const step1Indicator = document.querySelector('.step[data-step="1"]');
        if (step1Indicator) {
            step1Indicator.classList.add('active');
        }
        
        console.log('Initialisation terminée');
    }, 100);
});