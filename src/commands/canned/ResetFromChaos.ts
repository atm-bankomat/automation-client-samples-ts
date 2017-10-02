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
import { SlackMessage } from "@atomist/slack-messages/SlackMessages";
import * as appRoot from "app-root-path";
import { exec } from "child-process-promise";
import * as _ from "lodash";

@CommandHandler("Reset for fun from Chaos", "Clean hell up")
export class ResetFromChaos implements HandleCommand {

    public handle(ctx: HandlerContext): Promise<HandlerResult> {

        return runCommand(
            // tslint:disable-next-line:max-line-length
            "kubectl create -f ../../chaostoolkit/chaostoolkit-samples/service-down-not-visible-to-users/03-after/provider-deployment.json", {})
            .then(result => this.sendNotification(result, ctx));
    }

    private sendNotification(
        result: any,
        ctx: HandlerContext): Promise<any> {
        if (result.childProcess.exitCode === 0 || !result.stdout) {
            const msg: SlackMessage = {
                text: `Chaos reverted`,
                attachments: [{
                    color: "#1ea027",
                    fallback: "Chaos Reverted",
                    title: "Chaos Reverted",
                    text: "",
                    mrkdwn_in: ["text"],
                    footer_icon: "http://images.atomist.com/rug/commit.png",
                    ts: Math.floor(new Date().getTime() / 1000),
                    author_name: "Happy Sweeper",
                    // tslint:disable-next-line:max-line-length
                    author_icon: "https://previews.123rf.com/images/andreypopov/andreypopov1302/andreypopov130200047/17626340-Happy-Sweeper-Cleaning-Floor-On-White-Background-Stock-Photo-cleaning-broom-sweeping.jpg",
                }],
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
