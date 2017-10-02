import {
    CommandHandler,
    EventHandler,
    Secret,
} from "@atomist/automation-client/decorators";
import * as GraphQL from "@atomist/automation-client/graph/graphQL";
import { HandleCommand } from "@atomist/automation-client/HandleCommand";
import {
    EventFired,
    HandleEvent,
    HandlerContext,
    HandlerResult,
    Secrets,
    Success,
} from "@atomist/automation-client/Handlers";
import { CommandResult, runCommand } from "@atomist/automation-client/internal/util/commandLine";
import { buttonForCommand } from "@atomist/automation-client/spi/message/MessageClient";
import { Attachment, SlackMessage } from "@atomist/slack-messages/SlackMessages";
import * as appRoot from "app-root-path";
import { exec } from "child-process-promise";
import * as _ from "lodash";
import { ResetFromChaos } from "./ResetFromChaos";

@CommandHandler("Runs Chaos Experiment", "Unleash hell")
export class RunChaos implements HandleCommand {

    public handle(ctx: HandlerContext): Promise<HandlerResult> {

        return runCommand(
            "chaos run ../../chaostoolkit/chaostoolkit-samples/service-down-not-visible-to-users/experiment.json", {})
            .then(result => this.sendNotification(result, ctx));
    }

    private sendNotification(
        result: any,
        ctx: HandlerContext): Promise<any> {
        if (result.childProcess.exitCode === 0 || !result.stdout) {
            const attachment: Attachment = {
                color: "#1ea027",
                fallback: "Chaos Experiment Output",
                title: "Chaos Experiment Output",
                text: `\`\`\`${result.stderr.split().join("")}\`\`\``,
                mrkdwn_in: ["text"],
                footer_icon: "http://images.atomist.com/rug/commit.png",
                ts: Math.floor(new Date().getTime() / 1000),
                author_name: "Gladiator",
                // tslint:disable-next-line:max-line-length
                author_icon: "https://i.pinimg.com/736x/b9/c5/65/b9c565b89b41592f254e92f5c5710d65--russell-crowe-gladiator-gladiators.jpg",
            };
            attachment.actions = [
                
            ];
            const msg: SlackMessage = {
                text: `Chaos successfully executed on the system`,
                attachments: [attachment],
            };
            return ctx.messageClient.respond(msg).then( v => ({ code: 0}));
        } else {
            const msg: SlackMessage = {
                text: `Chaos executed on system`,
                attachments: [{
                    color: "#1ea027",
                    fallback: "Chaos Experiment Run",
                    title: "Chaos Experiment Run",
                    text: "Hello there", // `\`\`\`${result.stdout.split().join("")}\`\`\``,
                    mrkdwn_in: ["text"],
                    footer_icon: "http://images.atomist.com/rug/commit.png",
                    ts: Math.floor(new Date().getTime() / 1000),
                }],
            };
            return ctx.messageClient.respond(msg).then( v => ({ code: 0}));
        }
    }
}
