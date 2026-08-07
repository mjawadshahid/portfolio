import type { Metadata } from "next";

import { DomainPage } from "@/components/DomainPage";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta, breadcrumbSchema } from "@/lib/seo";
import { domains } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Healthcare — clinical software and decision support AI",
  description: domains.healthcare.description,
  path: "/healthcare",
});

export default function Page() {
  return (
    <>
      <DomainPage domain="healthcare" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Healthcare", path: "/healthcare" },
        ])}
      />
    </>
  );
}
