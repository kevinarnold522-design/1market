function extractJsonAfter(prompt, label) {
  const marker = `${label}:`;
  const start = prompt.indexOf(marker);
  if (start === -1) return {};
  const rest = prompt.slice(start + marker.length);
  const nextLabel = rest.search(/\n[A-Z][A-Za-z ]+:/);
  const raw = (nextLabel === -1 ? rest : rest.slice(0, nextLabel)).trim();
  try { return JSON.parse(raw); } catch { return {}; }
}

function matchLine(prompt, label) {
  const re = new RegExp(`${label}:\\s*([^\\n]+)`, 'i');
  return (prompt.match(re)?.[1] || '').replace(/^['\"]|['\"]$/g, '').trim();
}

function clean(value, fallback = '') {
  const text = String(value || '').trim();
  return text && text !== 'N/A' && text !== 'Untitled' ? text : fallback;
}

function categoryFromText(text = '') {
  const t = text.toLowerCase();
  if (/food|meal|cake|coffee|drink|restaurant|ulam|pizza|burger/.test(t)) return { main_category: 'food', type: 'food', subcategory: 'Homemade Meals' };
  if (/rent|lease|room|condo|house|apartment|lot|property/.test(t)) return { main_category: 'rent', type: 'rent_lease', subcategory: 'Apartment / Condo' };
  if (/job|hiring|work|staff|assistant|developer/.test(t)) return { main_category: 'jobs', type: 'jobs', subcategory: 'Other / Not Listed' };
  if (/service|repair|clean|design|install|tutor|delivery/.test(t)) return { main_category: 'services', type: 'services', subcategory: 'Other / Type Manually' };
  return { main_category: 'buysell', type: 'product', subcategory: 'General' };
}

function smartDraft(prompt) {
  const form = extractJsonAfter(prompt, 'Current form');
  const answers = extractJsonAfter(prompt, 'Seller answers');
  const item = clean(answers.item, clean(form.title, 'Marketplace Item'));
  const category = categoryFromText(`${item} ${form.type || ''} ${form.subcategory || ''}`);
  const title = clean(form.title, item).slice(0, 70);
  const condition = clean(answers.condition, clean(form.condition, 'Brand New'));
  return {
    ...category,
    title,
    condition,
    price_label: clean(form.price_label, form.price ? `₱${Number(form.price).toLocaleString()}` : 'Negotiable'),
    description: `${title} available in ${clean(answers.location, clean(form.location, 'the Philippines'))}. ${condition}. ${clean(answers.inclusions, 'Includes the key details buyers need to know.') } Best for ${clean(answers.audience, 'interested buyers')}. Message the seller for availability and pickup or delivery details.`,
    tags: [item, category.subcategory, condition, clean(answers.location, '')].filter(Boolean).join(', '),
    brand: clean(form.brand, ''),
    model: clean(form.model, ''),
    specs: clean(answers.inclusions, clean(form.specs, '')),
    recommendations: ['Use clear photos from multiple angles.', 'Add exact pickup or delivery details.', 'Keep price and condition honest.']
  };
}

function description(prompt) {
  const title = clean(matchLine(prompt, '- Title'), 'This listing');
  const category = clean(matchLine(prompt, '- Category'), 'item');
  const location = clean(matchLine(prompt, '- Location'), 'the Philippines');
  const price = clean(matchLine(prompt, '- Price'), 'a fair price');
  const condition = clean(matchLine(prompt, '- Condition'), 'good condition');
  return `${title} is available in ${location} for ${price}. This ${category} is listed in ${condition} and is ready for buyers looking for a reliable option. Please review the photos and details, then message the seller for availability, pickup, delivery, or other questions.`;
}

function price(prompt) {
  const title = `${matchLine(prompt, '- Title')} ${matchLine(prompt, '- Category')} ${matchLine(prompt, '- Subcategory')}`.toLowerCase();
  let recommended = 1500;
  if (/car|vehicle|motorcycle/.test(title)) recommended = 250000;
  else if (/phone|iphone|samsung|laptop|computer|gaming|tablet/.test(title)) recommended = 12000;
  else if (/house|condo|apartment|rent|lease|property/.test(title)) recommended = 18000;
  else if (/service|repair|cleaning|design/.test(title)) recommended = 2500;
  else if (/food|meal|cake|coffee/.test(title)) recommended = 250;
  return {
    price_min: Math.max(50, Math.round(recommended * 0.75)),
    price_max: Math.round(recommended * 1.25),
    recommended,
    reasoning: 'Estimated from the listing category and typical Philippine marketplace pricing. Adjust for condition, brand, urgency, and location.',
    confidence: 'Medium'
  };
}

function quality(prompt) {
  const title = matchLine(prompt, '- Title');
  const descriptionText = matchLine(prompt, '- Description');
  const priceText = matchLine(prompt, '- Price');
  const photosText = matchLine(prompt, '- Photos');
  const location = matchLine(prompt, '- Location');
  const contact = matchLine(prompt, '- Contact');
  const issues = [];
  const improvements = [];
  let score = 100;
  if (!clean(title)) { score -= 20; issues.push('Add a clear searchable title.'); }
  if (!clean(descriptionText) || descriptionText.length < 80) { score -= 20; improvements.push('Add more details about condition, inclusions, and reason for selling.'); }
  if (/not set/i.test(priceText)) { score -= 15; issues.push('Add a price or price label.'); }
  if (/0 uploaded|1 uploaded|2 uploaded/i.test(photosText)) { score -= 20; improvements.push('Upload at least 3 clear photos from different angles.'); }
  if (/not set/i.test(location)) { score -= 10; improvements.push('Add city or area so buyers know where the item is available.'); }
  if (/missing/i.test(contact)) { score -= 15; issues.push('Add at least one contact method.'); }
  score = Math.max(35, score);
  return {
    score,
    grade: score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 55 ? 'Needs Work' : 'Incomplete',
    summary: score >= 70 ? 'This listing is close to ready.' : 'This listing needs a few improvements before approval.',
    issues,
    improvements: improvements.length ? improvements : ['Your basics look good. Consider adding more buyer-friendly details.'],
    approval_chance: score >= 80 ? 'High' : score >= 60 ? 'Medium' : 'Low'
  };
}

function imageAnalysis() {
  return {
    detected_item: 'Marketplace item from uploaded photo',
    condition: 'Good as New',
    features: 'Use this as a starting point, then add exact brand, model, size, inclusions, and any flaws you can confirm.',
    suggested_title: 'Photo-Based Marketplace Listing',
    suggested_tags: 'photo listing, marketplace, Philippines'
  };
}

export async function localListingAI({ prompt = '', response_json_schema } = {}) {
  const p = String(prompt || '').toLowerCase();
  if (p.includes('smart 1marketph listing coach')) return smartDraft(prompt);
  if (p.includes('professional filipino marketplace copywriter')) return description(prompt);
  if (p.includes('pricing expert')) return price(prompt);
  if (p.includes('listing quality auditor')) return quality(prompt);
  if (p.includes('analyze this product/listing image')) return imageAnalysis(prompt);
  if (response_json_schema?.properties) return Object.fromEntries(Object.entries(response_json_schema.properties).map(([key, schema]) => [key, schema.type === 'array' ? [] : schema.type === 'number' ? 0 : '']));
  return 'helper is ready. Add listing details first for a stronger suggestion.';
}