const { Inventory } = require('../models/db');
const axios = require('axios');

exports.generateRecipe = async (req, res) => {
  const { ingredients, filter } = req.body;

  try {
    const prompt = `Erstelle ein vollständiges Rezept basierend auf folgenden Zutaten: ${ingredients.join(', ')}.
    Das Rezept sollte ${filter} sein. Gib das Rezept auf Deutsch zurück und strukturiere es mit folgenden Abschnitten:
    Titel, Zutaten, Zubereitung. Wenn Zutaten fehlen, liste diese am Ende unter "Benötigte Zutaten".
    Verwende klare Absätze und Formatierung.`;

    console.log('🔍 Anfrage wird gesendet mit folgendem Prompt:', prompt);

    const response = await axios.post('https://text.pollinations.ai/openai', {
      model: "openai",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates cooking recipes." },
        { role: "user", content: prompt }
      ],
      seed: 42
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const recipe = response.data.choices[0].message.content.trim();
    console.log('🔍 API Antwort:', recipe);

    res.json({ recipe: recipe });
  } catch (error) {
    console.error('❌ Fehler bei der Rezeptgenerierung:', error.message);
    res.status(500).json({ error: error.message });
  }
};
