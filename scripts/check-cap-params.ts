/**
 * Checks that every capability parameter (content/capability-params.ts) has a label — and every
 * option and unit a translation — in both messages/zh.json and messages/en.json.
 * Run: npx tsx scripts/check-cap-params.ts
 */
import zh from "../messages/zh.json";
import en from "../messages/en.json";
import { CAP_SCHEMAS } from "../content/capability-params";

type Tree = { [k: string]: string | Tree };
const get = (t: Tree, path: string[]) => path.reduce<string | Tree | undefined>((n, k) => (n && typeof n === "object" ? n[k] : undefined), t);

let missing = 0;
for (const [locale, msgs] of [["zh", zh], ["en", en]] as const) {
  const cp = (msgs as unknown as { console: { capParams: Tree } }).console.capParams;
  const has = (cap: string, ...p: string[]) => typeof get(cp, [cap, ...p]) === "string" || typeof get(cp, ["_common", ...p]) === "string";
  for (const [cap, schema] of Object.entries(CAP_SCHEMAS)) {
    for (const f of schema.fields) {
      if (!has(cap, f.key, "label")) {
        console.log(`[${locale}] ${cap}.${f.key}.label`);
        missing++;
      }
      // numeric-looking / format options (e.g. 1080p50) may fall back to the raw value
      for (const o of f.options ?? []) {
        if (!has(cap, f.key, "options", o) && !/^\d|^[A-Z0-9:]+$/.test(o)) {
          console.log(`[${locale}] ${cap}.${f.key}.options.${o}`);
          missing++;
        }
      }
      if (f.unit && typeof get(cp, ["_units", f.unit]) !== "string") {
        console.log(`[${locale}] _units.${f.unit}`);
        missing++;
      }
      if (typeof get(cp, ["_groups", f.group]) !== "string") {
        console.log(`[${locale}] _groups.${f.group}`);
        missing++;
      }
    }
  }
}
console.log(missing ? `${missing} missing` : "all parameter labels present");
process.exit(missing ? 1 : 0);
