import { CHARACTER, cn } from "@/lib/utils";
import { Quiz } from "@/schema/quiz";
import { Download } from "lucide-react";
import { FC, useState } from "react";
import { Button } from "./ui/button";

type DownlaodJsonFileProps = {
  quiz: Quiz;
  filename?: string;
  buttonText?: string;
  className?: string;
};

const DownloadJsonFile: FC<DownlaodJsonFileProps> = ({
  quiz,
  filename = "quiz_data.json",
  buttonText = "Télécharger JSON",
  className,
}) => {
  const [isDownload, setIsDownload] = useState(false);

  const { questions } = quiz;

  if (!questions) {
    throw new Error("Missing questions !");
  }

  function generateId() {
    const characterSelector = [
      ...CHARACTER.LOWERS,
      ...CHARACTER.NUMBERS,
      ...CHARACTER.LOWERS.toUpperCase(),
    ];

    let id = "_";

    for (let i = 0; i < 12; i++) {
      id +=
        characterSelector[Math.floor(Math.random() * characterSelector.length)];
    }

    return id;
  }

  const quizQuestions = questions.map((q) => {
    const { answers, type, content, _count } = q.question;

    if (!answers) {
      throw new Error("Missing answers !");
    }

    return {
      id: generateId(),
      type,
      content,
      count_number_answers: {
        value: _count?.answers || answers.length,
      },
      answers: answers.map((a) => {
        return {
          id: generateId(),
          content: a.content,
          isCorrect: a.isCorrect,
        };
      }),
    };
  });

  const data = {
    quiz: {
      title: quiz.title,
      description: quiz.description,
      count_number_questions: {
        value: questions.length,
      },
      questions: quizQuestions,
    },
  };

  const handleDownload = () => {
    const jsonString = JSON.stringify(data, null, 2);

    // Création d'un Blob avec les données JSON
    const blob = new Blob([jsonString], { type: "application/json" });

    // Création d'une URL pour le Blob
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    // Ajout du lien au document et simulation d'un clic
    document.body.appendChild(link);
    link.click();

    // Nettoyage - suppression du lien et révocation de l'URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      className={cn("flex justify-center gap-3", className)}
      variant="destructive"
      disabled={isDownload}
      onClick={() => {
        setIsDownload(true);
        setTimeout(() => handleDownload(), 500);
        setIsDownload(false);
      }}
    >
      {buttonText}
      <Download />
    </Button>
  );
};

export default DownloadJsonFile;
