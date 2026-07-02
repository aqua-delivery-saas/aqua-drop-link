import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type CityRow = Tables<"cities">;

const STATE_NAME_TO_UF: Record<string, string> = {
  acre: "AC", alagoas: "AL", amapá: "AP", amapa: "AP", amazonas: "AM",
  bahia: "BA", ceará: "CE", ceara: "CE", "distrito federal": "DF",
  "espírito santo": "ES", "espirito santo": "ES", goiás: "GO", goias: "GO",
  maranhão: "MA", maranhao: "MA", "mato grosso": "MT", "mato grosso do sul": "MS",
  "minas gerais": "MG", pará: "PA", para: "PA", paraíba: "PB", paraiba: "PB",
  paraná: "PR", parana: "PR", pernambuco: "PE", piauí: "PI", piaui: "PI",
  "rio de janeiro": "RJ", "rio grande do norte": "RN", "rio grande do sul": "RS",
  rondônia: "RO", rondonia: "RO", roraima: "RR", "santa catarina": "SC",
  "são paulo": "SP", "sao paulo": "SP", sergipe: "SE", tocantins: "TO",
};

function toUf(state: string | undefined): string | null {
  if (!state) return null;
  const s = state.trim();
  if (/^[A-Z]{2}$/i.test(s)) return s.toUpperCase();
  return STATE_NAME_TO_UF[s.toLowerCase()] ?? null;
}

export async function detectCityFromBrowser(): Promise<CityRow> {
  if (!("geolocation" in navigator)) {
    throw new Error("Geolocalização não suportada neste navegador");
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 60000,
    });
  });

  const { latitude, longitude } = position.coords;
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=pt-BR&zoom=10`,
    { headers: { Accept: "application/json" } }
  );
  if (!res.ok) throw new Error("Falha ao identificar sua localização");
  const data = await res.json();
  const addr = data?.address ?? {};
  const cityName: string | undefined =
    addr.city || addr.town || addr.village || addr.municipality || addr.county;
  const uf = toUf(addr.state);

  if (!cityName) throw new Error("Não conseguimos identificar sua cidade");

  let query = supabase
    .from("cities")
    .select("*")
    .ilike("name", cityName)
    .eq("is_active", true);
  if (uf) query = query.eq("state", uf);

  const { data: match, error } = await query.maybeSingle();
  if (error) throw error;
  if (!match) throw new Error(`Cidade "${cityName}" ainda não está cadastrada`);
  return match;
}
