/**
 * Renders a JSON-LD block into the document. Kept as its own component so
 * lib/seo.ts stays plain TypeScript and can be imported from anywhere,
 * including `generateMetadata`.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output; the `<` in any string value is escaped below.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
