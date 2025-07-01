import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import "dotenv/config";
import { generateTestFromAI } from "./lib/openrouter";

export function activate(context: vscode.ExtensionContext) {
  const output = vscode.window.createOutputChannel("Node Tests Generator");

  const disposable = vscode.commands.registerCommand(
    "node-tests-generator.generateTestFile",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found.");
        return;
      }

      const document = editor.document;
      const filePath = document.uri.fsPath;
      const fileName = path.basename(filePath, path.extname(filePath));
      const ext = path.extname(filePath);
      const testFileName = `${fileName}.test${ext}`;
      const testFilePath = path.join(path.dirname(filePath), testFileName);
      const fileContent = document.getText();

      output.clear();
      output.show();
      output.appendLine(`📁 Generating test for: ${filePath}`);

      try {
        vscode.window.showInformationMessage("Generating tests using AI...");

        const generatedTest = await generateTestFromAI(fileContent, output, ext);

        fs.writeFileSync(testFilePath, generatedTest.trim());

        output.appendLine(`✅ Test file created at: ${testFilePath}`);
        vscode.window.showInformationMessage(`✅ Test file created: ${testFileName}`);
      } catch (error: any) {
        output.appendLine(`❌ Generation failed: ${error.message}`);
        vscode.window.showErrorMessage(`❌ Failed to generate test: ${error.message}`);
      }
    }
  );

  context.subscriptions.push(disposable);
  console.log("✅ node-tests-generator activated");
}

export function deactivate() {
  console.log("🛑 node-tests-generator deactivated");
}
