import { Container } from "inversify";
import { OctokitInjector } from "./client/octokit-injector";
import { App } from "./core/app";
import { ConfigService } from "./core/config-service";
import { APP, CONFIG_SERVICE, OCTOKIT_INJECTOR } from "./core/constants";
import { User } from "./types/follower.interface";
interface ResultProps {
    notFollowingBack: User[];
    notFollwing: User[];
}

App.Listeners.on("ready", () => {
    const container = new Container({ skipBaseClassChecks: true });
    container.bind<ConfigService>(CONFIG_SERVICE).to(ConfigService);
    container.bind<OctokitInjector>(OCTOKIT_INJECTOR).to(OctokitInjector);
    container.bind<App>(APP).to(App);

    const app = container.get<App>(APP);
    app.start();
});

App.Listeners.emit("ready");

App.Listeners.on("result", (result: ResultProps) => {
    console.log(result);
});
