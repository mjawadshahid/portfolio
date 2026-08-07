import type { Metadata } from "next";

import { DomainPage } from "@/components/DomainPage";
import { JsonLd } from "@/components/JsonLd";
import { pageMeta, breadcrumbSchema } from "@/lib/seo";
import { domains } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Aviation — ground operations and task assignment AI",
  description: domains.aviation.description,
  path: "/aviation",
});

export default function Page() {
  return (
    <>
      <DomainPage domain="aviation" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Aviation", path: "/aviation" },
        ])}
      />
    </>
  );
}
