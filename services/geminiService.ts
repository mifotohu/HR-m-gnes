
import { GoogleGenAI, Type } from "@google/genai";
import { ApplicationData, GenerationResult } from "../types";

export const generateHRMaterials = async (data: ApplicationData & { customApiKey?: string }): Promise<GenerationResult> => {
  const apiKeyToUse = data.customApiKey || process.env.API_KEY;
  const ai = new GoogleGenAI({ apiKey: apiKeyToUse || "" });
  
  const promptText = `
    SZEREPKÖR:
    Te egy 2026-os szintű Senior HR Technológus és ATS Optimalizálási Szakértő vagy. 
    Feladatod olyan pályázati anyagok írása magyar nyelven, amelyek átmennek az AI-alapú szűrőrendszereken (Bot-friendly), de emberi olvasó számára is megnyerőek.

    BEMENETI PARAMÉTEREK:
    - JD_DATA (álláshirdetés): ${data.jdData}
    - COMPANY: ${data.company}
    - POSITION: ${data.position}
    - SALARY: ${data.salary || 'Nincs megadva'}
    - STYLE: ${data.style}
    - TONE (Hangnem): ${data.tone}
    - AI_SKILLS (1-5 skálán):
      Szöveges LLM: ${data.aiSkills.llm}, 
      Prompt Engineering: ${data.aiSkills.prompting}, 
      Vizuális AI: ${data.aiSkills.visualAI}, 
      Automatizálás: ${data.aiSkills.automation}, 
      Adatelemzés: ${data.aiSkills.analysis}

    ${data.cvFile ? 'MEGJEGYZÉS: A pályázó önéletrajzát csatolt dokumentumként (PDF/Word) küldtük el. Kérlek, elemezd azt alaposan.' : `- CV_DATA (kinyert szöveg): ${data.cvData}`}

    STRATÉGIA ÉS ADATELLENŐRZÉS:
    1. ATS ÉS AI-BOT OPTIMALIZÁLÁS: Használd a JD_DATA kulcsszavait természetes módon.
    2. CV INTEGRITÁS ELLENŐRZÉSE: Kiemelten figyelj a kinyert adatok pontosságára.
    3. SKILL ALIGNMENT: Számítsd ki, hogy a jelölt megadott AI készségei (1-5) mennyire felelnek meg a JD-ben elvártaknak. Generálj 0-100 közötti pontszámokat.
    4. STÍLUS ÉS HANGNEM: Szigorúan tartsd magad a kiválasztott STYLE (${data.style}) és TONE (${data.tone}) hangvételéhez.

    KIMENETI ELVÁRÁSOK:
    - subject: Kattintás-optimalizált tárgy.
    - emailTemplate: RÉSZLETES (min. 1000 karakter), meggyőző üzenet.
    - coverLetter: Professzionális dokumentum, modern struktúra.
    - salaryNote: Elegánsan beépített bérigény.
    - cvAnalysisReport: Jelentés a CV adatok pontosságáról.
    - skillAlignment: 5 darab objektumot tartalmazó tömb (label: készség neve, score: 0-100 illeszkedés).

    Válaszolj JSON formátumban.
  `;

  const contents: any[] = [{ text: promptText }];

  if (data.cvFile) {
    contents.push({
      inlineData: {
        data: data.cvFile.base64,
        mimeType: data.cvFile.mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts: contents },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          emailTemplate: { type: Type.STRING },
          coverLetter: { type: Type.STRING },
          salaryNote: { type: Type.STRING },
          cvAnalysisReport: { type: Type.STRING },
          skillAlignment: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                score: { type: Type.NUMBER }
              },
              required: ["label", "score"]
            }
          }
        },
        required: ["subject", "emailTemplate", "coverLetter", "cvAnalysisReport", "skillAlignment"]
      },
      temperature: 0.7,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Üres válasz érkezett az AI-tól.");
  
  return JSON.parse(text) as GenerationResult;
};
