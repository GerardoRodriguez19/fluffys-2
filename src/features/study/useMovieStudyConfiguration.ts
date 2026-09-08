import { useEffect, useState } from "react";

import {
  loadMovieStudyConfiguration,
  saveMovieStudyConfiguration,
} from "@/lib/storage/movieStudyConfiguration";

import { defaultMovieStudyConfiguration } from "./defaultMovieStudyConfiguration";

import type { MovieStudyConfiguration } from "@/types";

export function useMovieStudyConfiguration() {
  const [configuration, setConfiguration] = useState<MovieStudyConfiguration>(() => {
    return loadMovieStudyConfiguration() ?? defaultMovieStudyConfiguration;
  });

  useEffect(() => {
    saveMovieStudyConfiguration(configuration);
  }, [configuration]);

  return {
    configuration,
    setConfiguration,
  };
}
