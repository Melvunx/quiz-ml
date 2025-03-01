import PaginationControls from "@/components/layout/PaginationControls";
import SearchItems from "@/components/layout/SearchItems";
import Question from "@/components/Question";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LoadingString from "@/components/ui/loading-string";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useKeyboardShortcut from "@/hooks/use-keyboardShortcut";
import useQuiz from "@/hooks/use-quiz";
import { useToast } from "@/hooks/use-toast";
import { toastParams } from "@/lib/utils";
import { Question as QuestionItems, QuestionType } from "@/schema/quiz";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ErrorPage from "./ErrorPage";

export default function QuestionsPage({
  itemsPerPage,
}: {
  itemsPerPage: number;
}) {
  const { questionsWithAnswers, searchedQuestions } = useQuiz();
  const { toast } = useToast();
  const { shortcutToSearch } = useKeyboardShortcut();
  const [searchParams] = useSearchParams();
  const [filteredQuestions, setFilteredQuestions] = useState<QuestionItems[]>(
    []
  );
  const [searchResults, setSearchResults] = useState<QuestionItems[]>([]);
  const currentPage = Number(searchParams.get("page")) || 1;

  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => await questionsWithAnswers(),
  });

  const { mutate: searchedQuestionsMutation, isPending: isSearching } =
    useMutation({
      mutationKey: ["searched-questions"],
      mutationFn: async (query: string) => await searchedQuestions(query),
      onSuccess: (questions, searchedText) => {
        setSearchResults(questions);
        setFilteredQuestions([]);

        const foundedQuestions = questions.length;

        const foundTitle =
          foundedQuestions > 1 ? "Questions trouvés 😁" : "Question trouvé 😁";

        const foundDescription =
          foundedQuestions > 1
            ? `${foundedQuestions} questions on été trouvés avec "${searchedText}"`
            : `${foundedQuestions} question on été trouvé avec "${searchedText}"`;

        setTimeout(
          () =>
            toast(
              toastParams(
                `${
                  foundedQuestions
                    ? foundTitle
                    : "Aucune question n'a été trouvé 😔"
                }`,
                `${
                  foundedQuestions
                    ? foundDescription
                    : `Aucune question n'a été trouvé avec "${searchedText}" .`
                }`
              )
            ),
          300
        );
      },
      onError: (error) => {
        console.error(error);
        throw error;
      },
    });

  useEffect(() => {
    const handleSearchInput = (e: KeyboardEvent) => {
      shortcutToSearch(e, "questionSearchId");
    };

    window.addEventListener("keydown", handleSearchInput);

    return () => {
      window.removeEventListener("keydown", handleSearchInput);
    };
  }, [shortcutToSearch]);

  if (!questions) return null;

  if (isLoading) return <LoadingString />;

  if (isError) return <ErrorPage />;

  const handleQuestionsFilter = (type: QuestionType) => {
    setSearchResults([]);

    const baseQuestions = searchResults.length ? searchResults : questions;
    const filtered = baseQuestions.filter((question) => type === question.type);
    setFilteredQuestions(filtered);
  };

  const onSearchedQuestionsAction = async (data: FormData) => {
    const searchText = String(data.get("search"));

    if (!searchText.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      await searchedQuestionsMutation(searchText);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayQuestions = searchResults.length
    ? searchResults
    : filteredQuestions.length
    ? filteredQuestions
    : questions;

  const currentQuestions = displayQuestions.slice(startIndex, endIndex);

  const totalItems = displayQuestions.length;

  const currentQuestionsNumber = currentQuestions.length;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div
        className={`my-3 flex gap-2 rounded-lg px-3 py-2 font-logo ${
          currentQuestionsNumber <= 2
            ? "absolute left-0 top-0 w-full items-center justify-evenly"
            : "relative"
        }`}
      >
        <Label>
          <p className="light:bg-white absolute top-0 z-10 ml-5 px-1 font-regular-funnel-display dark:bg-black md:hidden lg:hidden">
            Filtrer
          </p>
        </Label>
        <div className="rounded-lg border-2 border-zinc-400 p-2">
          <ToggleGroup
            className="flex gap-6 p-1"
            onValueChange={(value: QuestionType) =>
              handleQuestionsFilter(value)
            }
            type="single"
          >
            <ToggleGroupItem
              className={buttonVariants({ variant: "default", size: "sm" })}
              value="SINGLE"
            >
              Question unique
            </ToggleGroupItem>
            <ToggleGroupItem
              className={buttonVariants({ variant: "default", size: "sm" })}
              value="MULTIPLE"
            >
              Question Multiple
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <SearchItems
          onSearchAction={onSearchedQuestionsAction}
          className="w-1/2 justify-center"
          inputId="questionSearchId"
          disabled={isSearching}
        />
      </div>
      {currentQuestionsNumber ? (
        <>
          <div className="flex flex-col gap-4 py-2">
            {currentQuestions.map((question) => (
              <Question key={question.id} question={question} />
            ))}
          </div>
          {totalItems > itemsPerPage && (
            <PaginationControls
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              className={
                currentQuestionsNumber <= 2
                  ? "absolute bottom-0 left-0 mb-0 pb-0"
                  : ""
              }
            />
          )}
        </>
      ) : (
        "Aucune question n'a été trouvée"
      )}
    </div>
  );
}
