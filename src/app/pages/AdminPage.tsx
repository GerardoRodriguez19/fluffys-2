import { useEffect, useState } from "react";
import { Settings } from "lucide-react";

import { PageLayout, PageHeader, Stack } from "@/components/layout";
import { Button, InfoCard, Section } from "@/components/ui";
import { books, categories } from "@/data";
import { questionRepository } from "@/features/study/createStudyEngine";
import { parseQuestionsXlsx } from "@/features/admin/parseQuestionsXlsx";
import type { ParseError } from "@/features/admin/parseQuestionsRows";
import type { NewBookQuestion } from "@/features/study/repository/BookQuestionRepository";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/app";

import type { BookId, BookQuestion } from "@/types";
import type { Category } from "@/data";

import styles from "./AdminPage.module.css";

const emptyForm = {
  bookId: "hp5" as BookId,
  chapter: 1,
  category: "Personaje" as Category,
  prompt: "",
  correctAnswer: "",
};

function getSectionLabel(bookId: BookId, chapter: number): string {
  const book = books.find((item) => item.id === bookId);
  const section = book?.sections.find((item) => item.chapters.includes(chapter));

  return section ? `Sección ${section.id}` : "Sin sección";
}

export default function AdminPage() {
  const [questions, setQuestions] = useState<BookQuestion[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<NewBookQuestion[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [filterBookId, setFilterBookId] = useState<BookId | "all">("all");
  const [filterSectionId, setFilterSectionId] = useState<number | "all">("all");
  const [filterChapter, setFilterChapter] = useState<number | "all">("all");
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");
  const [filterSearch, setFilterSearch] = useState("");

  const selectedFilterBook = books.find((book) => book.id === filterBookId);
  const sectionOptions = selectedFilterBook?.sections ?? [];
  const chapterOptions =
    filterSectionId === "all"
      ? (selectedFilterBook?.sections.flatMap((section) => section.chapters) ?? [])
      : (selectedFilterBook?.sections.find((section) => section.id === filterSectionId)?.chapters ??
        []);

  const normalizedSearch = filterSearch.trim().toLowerCase();

  const filteredQuestions = questions.filter((question) => {
    if (filterBookId !== "all" && question.bookId !== filterBookId) {
      return false;
    }

    if (filterSectionId !== "all") {
      const sectionId = getSectionId(question.bookId, question.chapter);
      if (sectionId !== filterSectionId) {
        return false;
      }
    }

    if (filterChapter !== "all" && question.chapter !== filterChapter) {
      return false;
    }

    if (filterCategory !== "all" && question.category !== filterCategory) {
      return false;
    }

    if (normalizedSearch) {
      const haystack = `${question.prompt} ${question.correctAnswer}`.toLowerCase();
      if (!haystack.includes(normalizedSearch)) {
        return false;
      }
    }

    return true;
  });

  async function loadQuestions() {
    setLoading(true);
    setError(null);

    try {
      const data = await questionRepository.getQuestions();
      setQuestions(data);
    } catch (err) {
      setError("No se pudieron cargar las preguntas.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await questionRepository.getQuestions();
        if (!cancelled) {
          setQuestions(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError("No se pudieron cargar las preguntas.");
        }
        console.error(err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave() {
    if (!form.prompt.trim() || !form.correctAnswer.trim()) {
      setError("Pregunta y respuesta correcta son obligatorias.");
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      bookId: form.bookId,
      chapter: Number(form.chapter),
      category: form.category,
      prompt: form.prompt.trim(),
      correctAnswer: form.correctAnswer.trim(),
    };

    try {
      if (editingId) {
        await questionRepository.updateQuestion({
          id: editingId,
          ...payload,
        });
      } else {
        await questionRepository.createQuestion(payload);
      }

      setEditingId(null);
      setForm(emptyForm);
      await loadQuestions();
    } catch (err) {
      setError(editingId ? "No se pudo actualizar la pregunta." : "No se pudo crear la pregunta.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const ok = window.confirm("¿Eliminar esta pregunta?");
    if (!ok) return;

    try {
      await questionRepository.deleteQuestion(id);
      await loadQuestions();
    } catch (err) {
      setError("No se pudo eliminar la pregunta.");
      console.error(err);
    }
  }

  function handleEdit(question: BookQuestion) {
    setEditingId(question.id);
    setForm({
      bookId: question.bookId,
      chapter: question.chapter,
      category: question.category,
      prompt: question.prompt,
      correctAnswer: question.correctAnswer,
    });
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  }

  async function handleXlsxFile(file: File | null) {
    if (!file) return;

    try {
      const result = await parseQuestionsXlsx(file);

      setImportErrors(
        [
          ...result.errors.slice(0, 30).map((error: ParseError) => `Fila ${error.row}: ${error.message}`),
          ...(result.errors.length > 30
            ? [`…y ${result.errors.length - 30} errores más`]
            : []),
        ]
      );
      setImportPreview(result.questions);
    } catch (err) {
      setImportErrors(["No se pudo leer el archivo Excel."]);
      setImportPreview([]);
      console.error(err);
    }
  }

  async function handleConfirmImport() {
    if (importPreview.length === 0) return;

    setImporting(true);
    setError(null);

    try {
      for (const question of importPreview) {
        await questionRepository.createQuestion(question);
      }

      setImportPreview([]);
      setImportErrors([]);
      await loadQuestions();
    } catch (err) {
      setError("No se pudo importar el Excel.");
      console.error(err);
    } finally {
      setImporting(false);
    }
  }

  function handleClearImport() {
    setImportPreview([]);
    setImportErrors([]);
  }

  async function handleLogout() {
    await signOut(auth);
  }

  function getSectionId(bookId: BookId, chapter: number): number | null {
    const book = books.find((item) => item.id === bookId);
    const section = book?.sections.find((item) => item.chapters.includes(chapter));

    return section?.id ?? null;
  }

  function handleFilterBookChange(bookId: BookId | "all") {
    setFilterBookId(bookId);
    setFilterSectionId("all");
    setFilterChapter("all");
  }

  function handleFilterSectionChange(sectionId: number | "all") {
    setFilterSectionId(sectionId);
    setFilterChapter("all");
  }

  return (
    <PageLayout>
      <PageHeader
        icon={<Settings size={34} />}
        title="Administración"
        subtitle="Gestiona el banco de preguntas."
        action={
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        }
      />

      <Stack gap="lg">
        <Section
          title={editingId ? "Editar pregunta" : "Nueva pregunta"}
          description={editingId ? `Editando: ${editingId}` : "Se guarda en Firestore."}
        >
          <Stack gap="md">
            <label className={styles.field}>
              Libro
              <select
                value={form.bookId}
                onChange={(e) => setForm({ ...form, bookId: e.target.value as BookId })}
              >
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              Capítulo
              <input
                type="number"
                min={1}
                value={form.chapter}
                onChange={(e) => setForm({ ...form, chapter: Number(e.target.value) })}
              />
              <p className={styles.hint}>{getSectionLabel(form.bookId, form.chapter)}</p>
            </label>

            <label className={styles.field}>
              Categoría
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as Category,
                  })
                }
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              Pregunta
              <textarea
                rows={3}
                value={form.prompt}
                onChange={(e) => setForm({ ...form, prompt: e.target.value })}
              />
            </label>

            <label className={styles.field}>
              Respuesta correcta
              <input
                value={form.correctAnswer}
                onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <Stack gap="sm">
              <Button size="lg" disabled={saving} onClick={handleSave}>
                {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear pregunta"}
              </Button>

              {editingId && (
                <Button variant="secondary" size="lg" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
              )}
            </Stack>
          </Stack>
        </Section>

        <Section
          title="Importar Excel"
          description="Acepta la plantilla de Fluffys 2 o el Excel exportado desde Fluffys 1.0."
        >
          <Stack gap="md">
            <a
              className={styles.templateLink}
              href="/templates/preguntas-plantilla.xlsx"
              download="preguntas-plantilla.xlsx"
            >
              Descargar plantilla (.xlsx)
            </a>

            <label className={styles.field}>
              Archivo Excel
              <input
                type="file"
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={(e) => handleXlsxFile(e.target.files?.[0] ?? null)}
              />
            </label>

            {importErrors.length > 0 && (
              <div className={styles.csvErrors}>
                {importErrors.map((message) => (
                  <p key={message}>{message}</p>
                ))}
              </div>
            )}

            {importPreview.length > 0 && (
              <>
                <p className={styles.csvPreviewMeta}>
                  {importPreview.length} preguntas listas para importar
                </p>

                <Stack gap="sm">
                  {importPreview.slice(0, 5).map((question, index) => (
                    <InfoCard key={`${question.prompt}-${index}`}>
                      <p className={styles.meta}>
                        {question.bookId} · {getSectionLabel(question.bookId, question.chapter)} ·
                        Cap. {question.chapter} · {question.category}
                      </p>
                      <p className={styles.prompt}>{question.prompt}</p>
                      <p className={styles.answer}>Correcta: {question.correctAnswer}</p>
                    </InfoCard>
                  ))}
                </Stack>

                {importPreview.length > 5 && (
                  <p className={styles.csvPreviewMeta}>…y {importPreview.length - 5} más</p>
                )}

                <Stack gap="sm">
                  <Button size="lg" disabled={importing} onClick={handleConfirmImport}>
                    {importing ? "Importando..." : "Confirmar importación"}
                  </Button>

                  <Button variant="secondary" size="lg" onClick={handleClearImport}>
                    Cancelar preview
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </Section>

        <Section title="Filtros" description="Encuentra preguntas en el banco.">
          <Stack gap="md">
            <label className={styles.field}>
              Buscar
              <input
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="Pregunta o respuesta..."
              />
            </label>

            <label className={styles.field}>
              Libro
              <select
                value={filterBookId}
                onChange={(e) => handleFilterBookChange(e.target.value as BookId | "all")}
              >
                <option value="all">Todos</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              Sección
              <select
                value={filterSectionId}
                onChange={(e) =>
                  handleFilterSectionChange(
                    e.target.value === "all" ? "all" : Number(e.target.value)
                  )
                }
                disabled={filterBookId === "all"}
              >
                <option value="all">Todas</option>
                {sectionOptions.map((section) => (
                  <option key={section.id} value={section.id}>
                    Sección {section.id}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              Capítulo
              <select
                value={filterChapter}
                onChange={(e) =>
                  setFilterChapter(e.target.value === "all" ? "all" : Number(e.target.value))
                }
                disabled={filterBookId === "all"}
              >
                <option value="all">Todos</option>
                {chapterOptions.map((chapter) => (
                  <option key={chapter} value={chapter}>
                    Capítulo {chapter}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              Categoría
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as Category | "all")}
              >
                <option value="all">Todas</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <Button
              variant="secondary"
              onClick={() => {
                setFilterBookId("all");
                setFilterSectionId("all");
                setFilterChapter("all");
                setFilterCategory("all");
                setFilterSearch("");
              }}
            >
              Limpiar filtros
            </Button>
          </Stack>
        </Section>

        <Section
          title="Preguntas"
          description={
            loading ? "Cargando..." : `${filteredQuestions.length} de ${questions.length} preguntas`
          }
        >
          <Stack gap="md">
            {filteredQuestions.map((question) => (
              <InfoCard key={question.id}>
                <div className={styles.questionRow}>
                  <div>
                    <p className={styles.meta}>
                      {question.bookId} · {getSectionLabel(question.bookId, question.chapter)} ·
                      Cap. {question.chapter} · {question.category}
                    </p>
                    <p className={styles.prompt}>{question.prompt}</p>
                    <p className={styles.answer}>Correcta: {question.correctAnswer}</p>
                  </div>

                  <div className={styles.actions}>
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(question)}>
                      Editar
                    </Button>

                    <Button variant="danger" size="sm" onClick={() => handleDelete(question.id)}>
                      Eliminar
                    </Button>
                  </div>
                </div>
              </InfoCard>
            ))}
          </Stack>
        </Section>
      </Stack>
    </PageLayout>
  );
}
