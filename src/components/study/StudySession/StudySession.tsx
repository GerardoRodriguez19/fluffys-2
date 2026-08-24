import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout, Stack } from "@/components/layout";
import { QuestionCard, QuestionHeader, AnswerOption } from "@/components/study";
import { useStudySessionStore } from "@/store/studySession";
import { books } from "@/data";
import { progressRepository } from "@/features/study/createStudyEngine";
import Button from "@/components/ui/Button/Button";

export default function StudySession() {
  const navigate = useNavigate();

  const session = useStudySessionStore((state) => state.session);

  const answerQuestion = useStudySessionStore((state) => state.answerQuestion);
  const nextQuestion = useStudySessionStore((state) => state.nextQuestion);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  if (!session) {
    return null;
  }

  const book = books.find((item) => item.id === session.configuration.bookId);

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.bookQuestion.correctAnswer;

  const isLastQuestion = session.currentQuestionIndex === session.questions.length - 1;

  function handleAnswer() {
    if (!session) {
      return;
    }

    answerQuestion(isCorrect);

    void progressRepository.recordAnswer(currentQuestion.bookQuestion.id, isCorrect);

    setIsAnswered(true);
  }

  function handleNextQuestion() {
    if (!session) {
      return;
    }

    if (isLastQuestion) {
      navigate(`/books/${session.configuration.bookId}/study/results`);
      return;
    }

    nextQuestion();

    setSelectedAnswer(null);
    setIsAnswered(false);
  }

  return (
    <PageLayout>
      <Stack gap="lg">
        <QuestionHeader
          book={book?.title || ""}
          current={session.currentQuestionIndex + 1}
          total={session.questions.length}
        />

        <QuestionCard question={currentQuestion.bookQuestion.prompt} />

        <Stack gap="md">
          {currentQuestion.options.map((option) => (
            <AnswerOption
              key={option}
              label={option}
              selected={selectedAnswer === option}
              disabled={isAnswered}
              correct={isAnswered && option === currentQuestion.bookQuestion.correctAnswer}
              incorrect={isAnswered && selectedAnswer === option && !isCorrect}
              onClick={() => setSelectedAnswer(option)}
            />
          ))}
        </Stack>

        <Stack justify="center">
          <Button
            size="lg"
            disabled={!selectedAnswer}
            onClick={isAnswered ? handleNextQuestion : handleAnswer}
          >
            {isAnswered ? (isLastQuestion ? "Finalizar" : "Siguiente") : "Responder"}
          </Button>
        </Stack>
      </Stack>
    </PageLayout>
  );
}
