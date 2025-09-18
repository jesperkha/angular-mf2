import { type BaseArguments, type BaseTranslation, newGroup, generate } from "../src/index.ts";

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

// Group the translations together. Define a default translations (en).
const group = newGroup("en", { en, no });

// Get the requested locale formatted with the given arguments.
const res = generate("no", group, { name: "John" } as Args);
if (res.ok) {
    console.log(res.value.greeting);
} else {
    console.error(res.error);
}
