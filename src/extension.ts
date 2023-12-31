import * as vscode from "vscode";

class StreamerMode {
  private isEnabled = false;
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100
    );
    this.statusBarItem.command = "vscode-streamer-mode.toggle";
    this.updateStatusBarItem();
    this.statusBarItem.show();
    this.updateGlobalConfig();
  }

  public toggle() {
    this.isEnabled = !this.isEnabled;
    this.updateGlobalConfig();
    this.updateStatusBarItem();
    vscode.window.showInformationMessage(
      `Streamer mode is now ${this.isEnabled ? "enabled" : "disabled"}.`
    );
  }

  public getEnabled() {
    return this.isEnabled;
  }

  private updateStatusBarItem() {
    this.statusBarItem.text = `Streamer Mode: ${
      this.isEnabled ? "Enabled" : "Disabled"
    }`;
  }

  private updateGlobalConfig() {
    vscode.workspace
      .getConfiguration()
      .update(
        "vscode-streamer-mode.enabled",
        this.isEnabled,
        vscode.ConfigurationTarget.Global
      );
  }
}

class SensitiveFile {
  private readonly fileExtensions: Set<string>;
  private readonly regex: RegExp;

  constructor(fileExtensions: string[]) {
    this.fileExtensions = new Set(fileExtensions);
    this.regex = new RegExp(`\\.(${fileExtensions.join("|")})$`, "i");
  }

  public isSensitiveFile(document: vscode.TextDocument): boolean {
    return this.fileExtensions.has(this.getFileExtension(document.fileName));
  }

  private getFileExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf(".");
    return lastDotIndex === -1 ? "" : fileName.slice(lastDotIndex + 1);
  }
}

let shouldKeepEditorOpen = false;

export function activate(context: vscode.ExtensionContext) {
  const streamerMode = new StreamerMode();
  const sensitiveFile = new SensitiveFile([
    "env",
    "local",
    "development",
    "staging",
    "production",
    "test",
    "pem",
    "key",
    "cer",
    "crt",
    "p12",
    "pfx",
  ]);

  context.subscriptions.push(
    vscode.commands.registerCommand("vscode-streamer-mode.toggle", () => {
      streamerMode.toggle();
    })
  );

  vscode.workspace.onDidOpenTextDocument((document) => {
    if (sensitiveFile.isSensitiveFile(document) && streamerMode.getEnabled()) {
      if (!shouldKeepEditorOpen) {
        vscode.window
          .showWarningMessage(
            "Opening sensitive files is not allowed in streamer mode.",
            "Open Anyway",
            "Close" // Added "Close" option
          )
          .then((selectedOption) => {
            if (selectedOption === "Open Anyway") {
              shouldKeepEditorOpen = true;
              vscode.commands.executeCommand(
                "vscode.open",
                vscode.Uri.file(document.fileName)
              );
            } else if (selectedOption === "Close") {
              // Handle "Close" option
              vscode.commands.executeCommand("workbench.action.closeMessage");
            }
          });
        vscode.commands.executeCommand("workbench.action.closeActiveEditor");
      }
    }
  });

  vscode.window.onDidChangeActiveTextEditor(() => {
    shouldKeepEditorOpen = false;
  });
}
