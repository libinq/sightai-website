import Link from "next/link";

// Fallback for requests that never reach a locale (middleware normally redirects first).
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body style={{ background: "#07090C", color: "#E8EDF2", fontFamily: "system-ui", padding: 48 }}>
        <h1>404</h1>
        <Link href="/" style={{ color: "#22D3EE" }}>
          SightAI
        </Link>
      </body>
    </html>
  );
}
