import { Request, Response } from 'express';

// Scientific reference database
const SCIENTIFIC_SOURCES = [
  {
    id: 'bmr',
    title: 'Basal metabolic rate',
    description: 'The Mifflin-St Jeor equation for calculating basal metabolic rate',
    url: 'https://en.wikipedia.org/wiki/Basal_metabolic_rate',
    citation:
      'Mifflin, M. D., St Jeor, S. T., Hill, L. A., Scott, B. J., Daugherty, S. A., & Koh, Y. O. (1990). A new predictive equation for resting energy expenditure in healthy individuals. The American Journal of Clinical Nutrition, 51(2), 241-247.',
  },
  {
    id: 'calorie-counting',
    title: 'Calorie counting - Harvard',
    description: 'Harvard Medical School guidelines on calorie counting for weight management',
    url: 'https://www.health.harvard.edu/diet-and-weight-loss/calories-burned',
    citation:
      'Harvard Health Publishing. (2021). Calories burned in 30 minutes for people of three different weights. Harvard Health.',
  },
  {
    id: 'issn',
    title: 'International Society of Sports Nutrition',
    description: 'ISSN position stand on protein and exercise',
    url: 'https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8',
    citation:
      'Jäger, R., Kerksick, C. M., Campbell, B. I., Cribb, P. J., Wells, S. D., Skwiat, T. M., ... & Antonio, J. (2017). International society of sports nutrition position stand: protein and exercise. Journal of the International Society of Sports Nutrition, 14(1), 1-25.',
  },
  {
    id: 'nih',
    title: 'National Institutes of Health',
    description: 'NIH recommendations on dietary reference intakes for macronutrients',
    url: 'https://ods.od.nih.gov/HealthInformation/Dietary_Reference_Intakes.aspx',
    citation:
      'Institute of Medicine. (2005). Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids. The National Academies Press.',
  },
  {
    id: 'efsa',
    title: 'European Food Safety Authority',
    description: 'EFSA guidelines on dietary reference values for nutrients',
    url: 'https://www.efsa.europa.eu/en/topics/topic/dietary-reference-values',
    citation:
      'EFSA Panel on Dietetic Products, Nutrition and Allergies. (2010). Scientific Opinion on Dietary Reference Values. EFSA Journal.',
  },
  {
    id: 'who',
    title: 'World Health Organization',
    description: 'WHO guidelines on healthy diet',
    url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet',
    citation: 'World Health Organization. (2020). Healthy diet. WHO Fact Sheet.',
  },
];

// Get all scientific sources or filter by ID
export const getScientificSources = (req: Request, res: Response) => {
  const { id } = req.query;

  if (id) {
    // Find specific source by ID
    const source = SCIENTIFIC_SOURCES.find(source => source.id === id);

    if (!source) {
      return res.status(404).json({ error: 'Scientific source not found' });
    }

    return res.status(200).json(source);
  }

  // Return all sources
  return res.status(200).json(SCIENTIFIC_SOURCES);
};

// Legal disclaimer for the app
export const getLegalDisclaimer = (req: Request, res: Response) => {
  const disclaimer = {
    disclaimer:
      'The information provided by Nutri AI is for general informational and educational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or your nutritional needs. Never disregard professional medical advice or delay in seeking it because of something you have read on this application. Nutri AI does not recommend or endorse any specific tests, physicians, products, procedures, opinions, or other information that may be mentioned in the application. Reliance on any information provided by Nutri AI is solely at your own risk.',
    lastUpdated: '2023-11-01',
  };

  return res.status(200).json(disclaimer);
};

export default {
  getScientificSources,
  getLegalDisclaimer,
};
