import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "Neura Recruitment";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), "public/images/neura-logo.png")
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Blue accent bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            backgroundColor: "#2563EB",
          }}
        />

        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          width={380}
          height={107}
          style={{ objectFit: "contain" }}
          alt="Neura Recruitment"
        />

        {/* Tagline */}
        <p
          style={{
            marginTop: 36,
            fontSize: 30,
            color: "#6b7280",
            letterSpacing: "0.015em",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          Building the teams that build the future.
        </p>

        {/* URL */}
        <p
          style={{
            marginTop: 20,
            fontSize: 20,
            color: "#2563EB",
            letterSpacing: "0.03em",
          }}
        >
          neurarecruitment.com
        </p>

        {/* Subtle bottom border */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: "#f3f4f6",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
