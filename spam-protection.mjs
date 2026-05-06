export const SPAM_PHRASES = [
  'seo',
  'backlinks',
  'rank higher',
  'google ranking',
  'website design',
  'web design',
  'digital marketing',
  'lead generation',
  'more traffic',
  'grow your business',
  'marketing agency',
  'social media marketing',
  'ai automation',
  'virtual assistant',
  'offshore',
  'outsourcing',
  'guest post',
  'sponsored post',
  'domain authority',
];

const FIELD_NAMES_TO_SCREEN = [
  'First name',
  'Last name',
  'Patient name',
  'Email',
  'Phone',
  '_subject',
  'Service of interest',
  'Message',
];

export function getSpamPhraseMatch(fields) {
  const haystack = FIELD_NAMES_TO_SCREEN
    .map(name => fields[name] || '')
    .join(' ')
    .toLowerCase();

  return SPAM_PHRASES.find(phrase => haystack.includes(phrase)) || null;
}
