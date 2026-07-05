'use client'

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  getPublicConfig, 
  getPublicPlots, 
  getPublicDownloads, 
  getPublicAmenities, 
  getPublicHighlights, 
  ApiConfig, 
  ApiPlot, 
  ApiDownloads, 
  ApiAmenity, 
  ApiHighlight 
} from "@/lib/api";

interface ApiDataContextType {
  config: ApiConfig;
  plots: ApiPlot[];
  downloads: ApiDownloads;
  amenities: ApiAmenity[];
  highlights: ApiHighlight[];
  loading: boolean;
}

const ApiDataContext = createContext<ApiDataContextType>({
  config: {
    phone_number: "9035624148",
    whatsapp_number: "919035624148",
    project_content: "",
  },
  plots: [],
  downloads: {},
  amenities: [],
  highlights: [],
  loading: true,
});

export function ApiDataProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ApiConfig>({
    phone_number: "9035624148",
    whatsapp_number: "919035624148",
    project_content: "",
  });
  const [plots, setPlots] = useState<ApiPlot[]>([]);
  const [downloads, setDownloads] = useState<ApiDownloads>({});
  const [amenities, setAmenities] = useState<ApiAmenity[]>([]);
  const [highlights, setHighlights] = useState<ApiHighlight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cData, pData, dData, aData, hData] = await Promise.all([
          getPublicConfig(),
          getPublicPlots(),
          getPublicDownloads(),
          getPublicAmenities(),
          getPublicHighlights(),
        ]);
        setConfig(cData);
        if (pData && pData.length > 0) {
          setPlots(pData);
        }
        setDownloads(dData);
        if (aData && aData.length > 0) {
          setAmenities(aData);
        }
        if (hData && hData.length > 0) {
          setHighlights(hData);
        }
      } catch (err) {
        console.error("Error loading API data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Poll for real-time updates every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ApiDataContext.Provider value={{ config, plots, downloads, amenities, highlights, loading }}>
      {children}
    </ApiDataContext.Provider>
  );
}

export function useApiData() {
  return useContext(ApiDataContext);
}
