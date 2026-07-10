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
    async function loadStaticData() {
      try {
        const [cData, dData, aData, hData] = await Promise.all([
          getPublicConfig(),
          getPublicDownloads(),
          getPublicAmenities(),
          getPublicHighlights(),
        ]);
        setConfig(cData);
        setDownloads(dData);
        if (aData && aData.length > 0) {
          setAmenities(aData);
        }
        if (hData && hData.length > 0) {
          setHighlights(hData);
        }
      } catch (err) {
        console.error("Error loading static API data:", err);
      }
    }

    async function loadPlotsData() {
      try {
        const pData = await getPublicPlots();
        if (pData && pData.length > 0) {
          setPlots(pData);
        }
      } catch (err) {
        console.error("Error loading plots API data:", err);
      }
    }

    async function init() {
      setLoading(true);
      await Promise.all([loadStaticData(), loadPlotsData()]);
      setLoading(false);
    }

    init();

    // Poll for real-time plot updates only, every 30 seconds
    const interval = setInterval(loadPlotsData, 30000);
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
