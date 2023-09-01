import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let isStreamerModeEnabled = vscode.workspace
    .getConfiguration("vscode-streamer-mode")
    .get<boolean>("enabled");

  vscode.workspace.onDidOpenTextDocument((document) => {
    if (isStreamerModeEnabled && isEnvFile(document)) {
      vscode.commands
        .executeCommand("workbench.action.closeActiveEditor")
        .then(() => {
          vscode.window
            .showWarningMessage(
              "Opening .env files is not allowed while streamer mode is enabled.",
              "Open Anyway"
            )
            .then((choice) => {
              if (choice === "Open Anyway") {
                vscode.workspace.openTextDocument(document.uri).then((doc) => {
                  vscode.window.showTextDocument(doc);
                });
              }
            });
        });
    }
  });

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

  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-streamer-mode.disable", () => {
      isStreamerModeEnabled = false;
      vscode.workspace
        .getConfiguration()
        .update(
          "vscode-streamer-mode.enabled",
          isStreamerModeEnabled,
          vscode.ConfigurationTarget.Global
        );
      vscode.window.showInformationMessage("Streamer mode is now disabled.");
    })
  );
}

function isEnvFile(document: vscode.TextDocument): boolean {
  return document.fileName.endsWith(".env");
}
