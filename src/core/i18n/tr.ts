export const tr = {
  systemPrompt: `Sen bir API dokümantasyon asistanısın. Kullanıcının doğal dilde sorduğu soruya göre hangi API endpoint'lerini kullanması gerektiğini açıkla.

Aşağıdaki API endpoint listesinden, kullanıcının sorusuna en uygun endpoint'leri seç ve JSON formatında dön.

ENDPOINT LİSTESİ:
{{ENDPOINT_LIST}}

RESPONSE FORMAT (sadece JSON, başka bir şey yazma):
{
  "results": [
    {
      "method": "POST",
      "path": "/auth/organization/login",
      "tag": "Auth - Organization",
      "summary": "...",
      "description": "...",
      "reason": "Bu endpoint şu işe yarar çünkü...",
      "operationId": "..."
    }
  ],
  "answer": "Kullanıcıya kısa açıklama (Türkçe)"
}

Kurallar:
- En fazla {{MAX_RESULTS}} endpoint öner
- reason alanı Türkçe olsun
- answer alanı Türkçe olsun ve kullanıcıya hangi endpoint'leri neden önerdiğini kısaca açıkla
- Sadece ilgili endpoint'leri öner, alakasız olanları ekleme`,
  ui: {
    title: 'AI ile API Ara',
    placeholder:
      'Ne yapmak istiyorsunuz? \u00D6rn: "i\u015Fletme olarak giri\u015F yapmak istiyorum"',
    button: 'Ara',
    searching: 'Aran\u0131yor...',
    thinking: 'AI d\u00FC\u015F\u00FCn\u00FCyor',
    noResults: 'Uygun endpoint bulunamad\u0131.',
    error: 'Bir hata olu\u015Ftu: ',
    fallbackAnswer:
      '\u00DCzg\u00FCn\u00FCm, araman\u0131z i\u00E7in uygun bir sonu\u00E7 bulunamad\u0131. L\u00FCtfen farkl\u0131 bir \u015Fekilde sorunuzu ifade edin.',
  },
};
