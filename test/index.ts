import { type BaseArguments, type BaseTranslation, newGroup, generate } from "../src/mf2.ts";

// Define base translation schema
type Translation = BaseTranslation & {
  greeting: string;
};

// Define types of arguments
type Args = BaseArguments & {
  name: string;
};

const en: Translation = {
  greeting: "Hello {$name}! How are you doing?",
};

const no: Translation = {
  greeting: "Hei {$name}! Hvordan går det?",
};

// TODO: integrate with angular and use global state

// Group the translations together. Define a default translations (en).
const group = newGroup("en", { en, no });

// Get the requested locale formatted with the given arguments.
const res = generate("no", group, { name: "Bob" } as Args);
if (res.ok) {
  console.log(res.value.greeting);
} else {
  console.error(res.error);
}
