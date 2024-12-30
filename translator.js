function googleTranslateElementInit() {
    new google.translate.TranslateElement(
        {
            pageLanguage: '',
            includedLanguages: 'en,ha,yo,ig', // Restrict languages to English, Hausa, Yoruba, Igbo
            //layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
    );
}
