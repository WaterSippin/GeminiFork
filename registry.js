export const PROVIDERS = {
  openai:     { baseUrl: 'https://api.openai.com/v1',        auth: k => ({Authorization:`Bearer ${k}`}) },
  openrouter: { baseUrl: 'https://openrouter.ai/api/v1',     auth: k => ({Authorization:`Bearer ${k}`,'HTTP-Referer':'app','X-Title':'app'}) },
  perplexity: { baseUrl: 'https://api.perplexity.ai',        auth: k => ({Authorization:`Bearer ${k}`}) },
};
