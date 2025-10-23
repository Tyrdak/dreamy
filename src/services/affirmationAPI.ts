const AFFIRMATION_API_URL = "https://www.affirmations.dev";

export interface AffirmationResponse {
  affirmation: string;
};

/** Récupère une affirmation aléatoire depuis l'API */
export const getAffirmation = async (): Promise<string> => {
  const response = await fetch(AFFIRMATION_API_URL);
  const data = await response.json() as AffirmationResponse;
  return data.affirmation;
};
