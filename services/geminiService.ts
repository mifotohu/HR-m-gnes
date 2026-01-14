
import { GoogleGenAI, Type } from "@google/genai";
import { ApplicationData, GenerationResult } from "../types";

export const generateHRMaterials = async (data: ApplicationData): Promise<GenerationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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

    STRATÉGIA:
    1. ATS ÉS AI-BOT OPTIMALIZÁLÁS: Használd a JD_DATA kulcsszavait természetes módon. A szemantikai struktúra legyen olyan, hogy az előválasztó rendszerek magas pontszámot adjanak.
    2. AI-TUDÁS INTEGRÁCIÓ: Építsd be az AI_SKILLS értékeket. 4-5 szint esetén emeld ki mint stratégiai versenyelőnyt, 1-3 szint esetén magabiztos digitális kompetenciaként.
    3. 2026-OS TRENDEK: Kerüld a sablonos fordulatokat. Légy lényegre törő és jövőorientált.
    4. STÍLUS ÉS HANGNEM: Szigorúan tartsd magad a kiválasztott STYLE (${data.style}) és TONE (${data.tone}) hangvételéhez. Ha a TONE 'Tegező', használd a közvetlenebb stílust, ha 'Magázó' vagy 'Üzleties', maradj a formálisabb kereteknél.

    KIMENETI ELVÁRÁSOK:
    - subject: Kattintás-optimalizált tárgy.
    - emailTemplate: RÉSZLETES, meggyőző és szakmai üzenet. 
      !!! KRITIKUS: A hossza legyen MINIMUM 1000 karakter !!! 
      Tartalmazzon részletes bemutatkozást, az AI-kompetenciák kifejtését, értékajánlatot és konkrét kapcsolódási pontokat a cég céljaihoz.
    - coverLetter: Professzionális dokumentum. Hossza: MAXIMUM EGY A4-ES OLDAL (kb. 2500-3000 karakter). 
      Tagolt, modern struktúra, amely figyelembe veszi az AI-alapú előszűrést is.
    - salaryNote: Ha van bérigény, építsd be elegánsan a szövegbe vagy a végére.

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
        },
        required: ["subject", "emailTemplate", "coverLetter"]
      },
      temperature: 0.8,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Üres válasz érkezett az AI-tól.");
  
  return JSON.parse(text) as GenerationResult;
};
