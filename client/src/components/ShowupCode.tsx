import { ScrollArea } from "./ui/scroll-area";

export default function ShowupCode() {
  const jsonData = {
    quiz: {
      title: "Test quiz",
      description: "Ceci est un test",
      count_number_questions: {
        value: 2,
      },
      questions: [
        {
          id: "_vzSeSoQWbjyf",
          type: "SINGLE",
          content: "Test question 1",
          count_number_answers: {
            value: 3,
          },
          answers: [
            {
              id: "_M22UhmfrimhX",
              content: "Choix 1",
              isCorrect: false,
            },
            {
              id: "_ObEUMSAKDtlB",
              content: "Choix 2",
              isCorrect: true,
            },
            {
              id: "_75FrxzTKQK3N",
              content: "Choix 3",
              isCorrect: false,
            },
          ],
        },
        {
          id: "_be1NBxAApoi4",
          type: "MULTIPLE",
          content: "Question 2",
          count_number_answers: {
            value: 4,
          },
          answers: [
            {
              id: "_qUwvOn9KmAFC",
              content: "Choix 2",
              isCorrect: false,
            },
            {
              id: "_TOoPHcMQgPxt",
              content: "Choix 3",
              isCorrect: true,
            },
            {
              id: "_9daobm8o7K1X",
              content: "Choix 4",
              isCorrect: false,
            },
            {
              id: "_jnNXnbaaLYMN",
              content: "Choix 1",
              isCorrect: true,
            },
          ],
        },
      ],
    },
  };

  // Format the JSON with proper indentation
  const formattedJson = JSON.stringify(jsonData, null, 2);

  return (
    <div className="overflow-hidden rounded-lg bg-gray-800 shadow-lg">
      <div className="flex items-center justify-between bg-gray-900 p-2">
        <div className="flex space-x-1">
          <div className="size-3 rounded-full bg-red-500"></div>
          <div className="size-3 rounded-full bg-yellow-500"></div>
          <div className="size-3 rounded-full bg-green-500"></div>
        </div>
        <div className="font-regular-funnel-display text-sm text-gray-400">
          JSON
        </div>
      </div>
      <ScrollArea className="h-96">
        <pre className="p-4 text-green-400">
          <code className="font-regular-noto">{formattedJson}</code>
        </pre>
      </ScrollArea>
    </div>
  );
}
