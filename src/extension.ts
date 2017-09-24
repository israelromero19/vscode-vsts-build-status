import * as vscode from "vscode";
import {AppInsightsClientProvider} from "./Telemetry";
import {createDefaultSettings, Settings} from "./Settings";
import {StatusMonitor} from "./StatusMonitor";
import {VstsRestClientImpl} from "./VstsRestClient";
import OpenBuildInBrowserCommand from "./commands/OpenBuildInBrowserCommand";
import OpenBuildLogCommand from "./commands/OpenBuildLogCommand";
import QueueBuildCommand from "./commands/QueueBuildCommand";
import SelectBuildDefinitionCommand from "./commands/SelectBuildDefinitionCommand";

export function activate(context: vscode.ExtensionContext) {
    let settings = createDefaultSettings(context.workspaceState);
    let restClient = new VstsRestClientImpl(settings);
    let openBuildInBrowserCommand = new OpenBuildInBrowserCommand(settings, restClient);
    let openBuildLogCommand = new OpenBuildLogCommand(settings, restClient);
    let queueBuildCommand = new QueueBuildCommand(settings, restClient);
    let selectBuildDefinitionCommand = new SelectBuildDefinitionCommand(settings, restClient);
    let statusMonitor = new StatusMonitor(settings, restClient);
    
    configureTelemetry(context, settings);;

    statusMonitor.begin();
    
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.openVstsBuildDefinitionSelection', () => selectBuildDefinitionCommand.execute()));
    
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.openVstsBuildWebSelection', () => openBuildInBrowserCommand.execute()));

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.openVstsBuildLogSelection', () => openBuildLogCommand.execute()));
        
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.openVstsQueueBuildSelection', () => queueBuildCommand.execute()));
}

function configureTelemetry(context: vscode.ExtensionContext, settings: Settings) {
    AppInsightsClientProvider.start(settings);
    let client = AppInsightsClientProvider.getAppInsightsClient();
    client.trackEvent("started");
}