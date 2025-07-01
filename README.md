# 🧪 Node Tests Generator

A Visual Studio Code extension that **automatically generates unit tests** for JavaScript, TypeScript, JSX, and TSX files using **OpenRouter AI models** like DeepSeek.

---

## ✨ Features

- 📄 Generates Jest test files from any file with exported functions.
- 🤖 Uses OpenRouter AI (e.g. DeepSeek) to write meaningful, context-aware unit tests.
- 💡 Supports JavaScript, TypeScript, JSX, and TSX.
- 🔧 Users can configure their API key and preferred model.
- 📢 Shows logs and feedback in the VS Code Output panel.

---

## 📦 Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/node-tests-generator
   cd node-tests-generator
   npm install
   npm run package
   ```
2. In VS Code:
   Open the Command Palette (Cmd/Ctrl + Shift + P)
   Run Extensions: Install from VSIX...
   Select the generated .vsix file from the project root

---

## 🚀 Usage

1. Open a .js, .ts, .jsx, or .tsx file that contains exported functions.
2. Press Cmd/Ctrl + Shift + P and run: "Generate Tests for File".
3. The extension will generate a test file next to the original file (e.g., utils.test.js) with AI-generated Jest test cases.

---

## ⚙️ Configuration

🔑 API Key and Model
You can provide your OpenRouter API key and preferred model in two ways:

# Option 1: VS Code Settings

Go to Settings → Extensions → Node Tests Generator
Set:
API Key: your OpenRouter API key
Model: (e.g., deepseek/deepseek-v3-base:free)

# Option 2: .env file

Create a .env file at the project root:

```bash
OPENROUTER_API_KEY=your-api-key-here
```

If no API key is set in settings, the extension will fallback to the .env.

## 🧠 Prompt Strategy

The prompt sent to the model:

You are an expert in writing unit tests using Jest.
Given the following code, generate a complete test file with relevant and meaningful test cases.
Use best practices, edge cases, and Jest conventions.

---

## Development

```bash
npm install
npm run watch
# Press F5 to run the extension in VS Code dev host
```

---

## 🤝 Contributing

Pull requests and suggestions are welcome!
Feel free to open an issue if you find a bug or want to propose a feature.

---

## 🧾 License

MIT © 2025 Samuel Calderón