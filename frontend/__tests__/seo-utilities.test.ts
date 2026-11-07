import {
  analyzeMetaTitle,
  analyzeMetaDescription,
  calculateKeywordDensity,
  generateRobotsTxt,
  generateSitemapXml,
  buildOpenGraphPreview,
} from "../lib/seo-utilities";

describe("shared SEO utility functions", () => {
  test("meta title and description count Unicode code points and avoid ranking guarantees", () => {
    expect(analyzeMetaTitle("  A useful page title 😀  ")).toMatchObject({
      characters: 21,
      preview: "A useful page title 😀",
    });
    expect(analyzeMetaTitle("A".repeat(40)).guidance).toContain("common 30–60");
    expect(analyzeMetaDescription("x".repeat(140)).guidance).toContain("practical 120–160");
    expect(analyzeMetaDescription("short").guidance).toContain("no fixed Google character limit");
  });

  test("keyword density matches normalized whole-word phrases, not substrings or regex", () => {
    const phraseDensity = calculateKeywordDensity("New York, new yorker; NEW YORK!", "new york");
    expect(phraseDensity).toMatchObject({ wordCount: 6, occurrences: 2 });
    expect(phraseDensity.density).toBeCloseTo(100 / 3, 10);
    expect(calculateKeywordDensity("café CAFÉ cafe", "café")).toMatchObject({
      wordCount: 3,
      occurrences: 2,
    });
    expect(calculateKeywordDensity("", "target")).toEqual({
      wordCount: 0,
      occurrences: 0,
      density: 0,
    });
    expect(() => calculateKeywordDensity("some text", "   ")).toThrow("target keyword");
  });

  test("robots.txt generator validates paths and prevents line injection", () => {
    expect(generateRobotsTxt("/private/", "https://example.com/sitemap.xml")).toBe(
      "User-agent: *\nAllow: /\nDisallow: /private/\nSitemap: https://example.com/sitemap.xml",
    );
    expect(() => generateRobotsTxt("/ok\nAllow: /secret", "")).toThrow("line breaks");
    expect(() => generateRobotsTxt("//evil.example", "")).toThrow("single slash");
    expect(() => generateRobotsTxt("", "javascript:alert(1)")).toThrow("HTTP or HTTPS");
    expect(() => generateRobotsTxt("", "https://user:pass@example.com/sitemap.xml")).toThrow("without credentials");
  });

  test("sitemap validates absolute HTTP URLs, deduplicates and escapes XML", () => {
    const xml = generateSitemapXml(
      "https://example.com/\nhttps://example.com/search?q=a&x=b\nhttps://example.com/",
    );
    expect(xml.match(/<url>/g)).toHaveLength(2);
    expect(xml).toContain("q=a&amp;x=b");
    expect(xml).toContain("<loc>https://example.com/</loc>");
    expect(() => generateSitemapXml("")).toThrow("at least one URL");
    expect(() => generateSitemapXml("ftp://example.com/file")).toThrow("HTTP or HTTPS");
    expect(() => generateSitemapXml("https://example.com/#section")).toThrow("fragments");
    expect(() => generateSitemapXml("https://example.com/\nnot-a-url")).toThrow("HTTP or HTTPS");
  });

  test("Open Graph preview validates URLs and escapes HTML attributes", () => {
    const output = buildOpenGraphPreview({
      title: 'A "quoted" <title>',
      description: "Useful & clear",
      imageUrl: "https://example.com/image.png",
      pageUrl: "https://example.com/page",
    });
    expect(output).toContain('content="A &quot;quoted&quot; &lt;title&gt;"');
    expect(output).toContain('content="Useful &amp; clear"');
    expect(output).toContain('property="og:image"');
    expect(() => buildOpenGraphPreview({
      title: "Title",
      description: "Description",
      imageUrl: "javascript:alert(1)",
      pageUrl: "https://example.com",
    })).toThrow("HTTP or HTTPS");
  });
});
