import { useEffect, useState } from "react";

import { loadStudyConfiguration, saveStudyConfiguration } from "@/lib/storage/studyConfiguration";

import { defaultStudyConfiguration } from "./defaultStudyConfiguration";

import type { StudyConfiguration } from "@/types";

export function useStudyConfiguration() {
  const [configuration, setConfiguration] = useState<StudyConfiguration>(() => {
    return loadStudyConfiguration() ?? defaultStudyConfiguration;
  });

  useEffect(() => {
    saveStudyConfiguration(configuration);
  }, [configuration]);

  return {
    configuration,
    setConfiguration,
  };
}
