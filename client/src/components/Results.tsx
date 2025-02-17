import { dateFormater } from "@/lib/utils";
import { Result } from "@/schema/quiz";

type ResultsProps = {
  result: Result;
};

const Results: React.FC<ResultsProps> = ({ result }) => {
  return (
    <div>
      <h1>Reésultat : {result.score}</h1>
      <p>Quiz fait le {dateFormater(new Date(result.completedAt))}</p>
    </div>
  );
};

export default Results;
