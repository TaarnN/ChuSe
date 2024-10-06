export const translateText = async (text: string, targetLanguage: string) => {
  const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(
    text
  )}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Translation failed");
    }
    const data = await response.json();
    return data[0][0][0]; // Extracting the translated text
  } catch (error) {
    console.error("Translation error:", error);
    return null;
  }
};
