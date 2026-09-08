const HIDDEN_LOCAL_QUESTION_IDS_KEY = "fluffys.admin.hiddenLocalQuestionIds";

export function getHiddenLocalQuestionIds(): string[] {
  const data = localStorage.getItem(HIDDEN_LOCAL_QUESTION_IDS_KEY);

  if (!data) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function hideLocalQuestionId(id: string): void {
  const ids = new Set(getHiddenLocalQuestionIds());
  ids.add(id);
  localStorage.setItem(HIDDEN_LOCAL_QUESTION_IDS_KEY, JSON.stringify([...ids]));
}
