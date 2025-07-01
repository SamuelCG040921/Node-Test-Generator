import { fetch } from "undici";
import * as vscode from "vscode";

type OpenRouterResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
  };
};

export async function generateTestFromAI(
  code: string,
  output: vscode.OutputChannel,
  ext: string
): Promise<string> {
  const config = vscode.workspace.getConfiguration("nodeTestGenerator");
  const userApiKey = config.get<string>("apiKey");
  const model =
    config.get<string>("model") || "openchat/openchat-3.5-0106:free";
  const apiKey = userApiKey || process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      "No OpenRouter API key found. Set it in settings or .env file."
    );
  }

  const languageMap: Record<string, string> = {
    ".js": "javascript",
    ".ts": "typescript",
    ".jsx": "javascript",
    ".tsx": "typescript",
  };

  const codeLang = languageMap[ext] || "javascript";

  const prompt = `
Only return a single valid Jest test file in \`\`\` format.
Do not include any commentary, instructions, emojis, or language other than JavaScript or TypeScript.

The test should:
- Import the functions from the source code.
- Use 'describe' and 'it' blocks.
- Include multiple test cases.

Here is the code to test:

\`\`\`${codeLang}
${code}
\`\`\`

Your output:
\`\`\`${codeLang}
// tests here
\`\`\`
`;

  output.appendLine(`🔹 Model: ${model}`);
  output.appendLine(`🔹 Sending request to OpenRouter...`);

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
      }),
    }
  );

  const data = (await response.json()) as OpenRouterResponse;

  if (!response.ok) {
    output.appendLine(`❌ Error: ${JSON.stringify(data, null, 2)}`);
    throw new Error(data.error?.message || "Unknown error from OpenRouter API");
  }

  output.appendLine(`✅ Response received`);
  // En openrouter.ts antes de retornar
  const content = data.choices[0].message.content.trim();

  // Extrae solo el bloque de código entre triple backticks
  const match = content.match(/```(?:\w*\n)?([\s\S]*?)```/);
  const cleanCode = match ? match[1].trim() : content;

  // Fallback: si no hay bloque de código, loguea el contenido completo
  if (!match) {
    output.appendLine(
      "⚠️ Warning: No code block found in response. Using raw content."
    );
    output.appendLine("🔸 Raw content:\n" + content);
  }

  return cleanCode;
}
