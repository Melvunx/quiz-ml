import { Color } from "@colors/colors";
import { z } from "zod";

const colors: TerminalColor = require("@colors/colors");

const ThemaSchema = z.object({
  success: z.string(),
  info: z.string(),
  data: z.array(z.string()),
  warn: z.string(),
  error: z.array(z.string()),
});

type Theme = z.infer<typeof ThemaSchema>;

interface TerminalColor extends Color {
  setTheme: (theme: Theme) => void;
  success: any;
  info: any;
  data: any;
  warn: any;
  error: any;
}

colors.setTheme({
  success: "brightGreen",
  info: "cyan",
  data: ["gray", "italic"],
  warn: "brightYellow",
  error: ["red", "bgWhite"],
});

export default colors;
