import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";

/**
 * One OG template, per-page text. Terminal ground with an amber prompt line,
 * so a shared link is recognisably from this site before anyone clicks it.
 */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? site.name).slice(0, 110);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#12211F",
          padding: "72px 80px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  background: "#243936",
                }}
              />
            ))}
          </div>
          <div style={{ color: "#7E9A95", fontSize: 22, letterSpacing: 2 }}>
            ~/{site.url.replace("https://", "")}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#B4650E", fontSize: 26, marginBottom: 18 }}>
            jawad@shahid ~ %{" "}
            <span style={{ color: "#E8A33D" }}>cat {"'"}
              {title.length > 40 ? `${title.slice(0, 40)}…` : title}
            {"'"}</span>
          </div>
          <div
            style={{
              color: "#F2F4F2",
              fontSize: title.length > 60 ? 58 : 72,
              lineHeight: 1.08,
              letterSpacing: -2.5,
              fontWeight: 600,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#7E9A95",
            fontSize: 24,
            borderTop: "1px solid #243936",
            paddingTop: 26,
          }}
        >
          <span style={{ color: "#F2F4F2" }}>
            {site.name}
            <span style={{ color: "#E8A33D" }}>_</span>
          </span>
          <span>{site.role} · Aviation &amp; Healthcare</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
