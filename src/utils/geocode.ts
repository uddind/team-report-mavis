export interface GeocodeResult {
  lat: number;
  lng: number;
}

/**
 * Mencari koordinat berdasarkan teks alamat/nama tempat menggunakan
 * Nominatim (layanan geocoding gratis dari OpenStreetMap).
 */
export async function geocodeAddress(query: string): Promise<GeocodeResult | null> {
  if (!query.trim()) return null;

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'id',
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch (err) {
    console.error('geocodeAddress error:', err);
    return null;
  }
}