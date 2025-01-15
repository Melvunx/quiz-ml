"use client";

import { Navbar } from "@/src/components/Navbar";
import { SubmitButton } from "@/src/components/SubmitButton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import Form from "next/form";
import { useActionState } from "react";

export default function Page() {
  const [state, action, pending] = useActionState((oldState, data) => {
    return createNewQuestion(data);
  }, {});

  return (
    <>
      <Navbar />
      <Card className="flex flex-col w-4/5 mx-auto">
        <CardHeader>
          <CardTitle>Create question</CardTitle>
        </CardHeader>
        <CardContent className="w-3/5 mx-auto">
          <Form
            className=" flex flex-col items-end gap-6"
            action={() => console.log("action")}
          >
            <Input
              name="question"
              className="font-ubuntu italic font-medium placeholder:font-playwrite placeholder:font-normal placeholder:tracking-wide"
              placeholder="Question"
            />
            <SubmitButton>Submit</SubmitButton>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
