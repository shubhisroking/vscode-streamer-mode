import * as vscode from "vscode";

let isStreamerModeEnabled = false;

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-streamer-mode.toggle", () => {
      isStreamerModeEnabled = !isStreamerModeEnabled;
      vscode.workspace
        .getConfiguration()
        .update(
          "vscode-streamer-mode.enabled",
          isStreamerModeEnabled,
          vscode.ConfigurationTarget.Global
        );
      vscode.window.showInformationMessage(
        `Streamer mode is now ${
          isStreamerModeEnabled ? "enabled" : "disabled"
        }.`
      );
    })
  );

  vscode.workspace.onDidOpenTextDocument((document) => {
    if (isEnvFile(document) && isStreamerModeEnabled) {
      vscode.window
        .showWarningMessage(
          "Opening .env files is not allowed in streamer mode.",
          "Open Anyway"
        )
        .then((selectedOption) => {
          if (selectedOption === "Open Anyway") {
            vscode.commands.executeCommand(
              "vscode.open",
              vscode.Uri.file(document.fileName)
            );
          }
        });
      vscode.commands.executeCommand("workbench.action.closeActiveEditor");
    }
  });
}

function isEnvFile(document: vscode.TextDocument): boolean {
  return (
    document.fileName.match(/\.env$/i) !== null ||
    document.fileName.match(/\.env\.local$/i) !== null ||
    document.fileName.match(/\.env\.(development|staging|production)$/i) !==
      null ||
    document.fileName.match(/\.env\.test$/i) !== null
  );
}
