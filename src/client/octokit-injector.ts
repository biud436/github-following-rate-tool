import { inject, injectable } from "inversify";
import { ConfigService } from "../core/config-service";
import { CONFIG_SERVICE } from "../core/constants";
import { Octokit } from "@octokit/core";
import { Follower, Following } from "../types/follower.interface";
import { App } from "../core/app";

@injectable()
export class OctokitInjector {
    private octokit!: Octokit;

    private followers?: Follower[];
    private following?: Following[];

    constructor(
        @inject(CONFIG_SERVICE) private readonly configService: ConfigService
    ) {
        console.log("OctokitInjector created");
    }

    async create() {
        try {
            this.octokit = new Octokit({
                auth: this.configService.get("GITHUB_TOKEN"),
            });

            this.followers = await this.getFollowers();
            this.following = await this.getFollowing();
            const compareResult = await this.compareFollowingAndFollowers();

            App.Listeners.emit("result", compareResult);
        } catch (e: any) {}
    }

    async getFollowers() {
        try {
            let currentPage = 1;

            // 최대 1페이지까지만 조회
            const maxPage = this.configService.get<number>("MAX_PAGE");
            let data: Array<Follower> = [];

            while (currentPage <= maxPage) {
                try {
                    const res = await this.octokit.request(
                        "GET /user/followers",
                        {
                            headers: {
                                "X-GitHub-Api-Version": "2022-11-28",
                            },
                            per_page: 100,
                            page: currentPage,
                        }
                    );

                    if (res.status === 200) {
                        data = [
                            ...res.data.map<Follower>((follower: any) => {
                                return {
                                    id: follower.id,
                                    login: follower.login,
                                };
                            }),
                            ...data,
                        ];

                        currentPage++;
                    }
                } catch (e: any) {
                    break;
                }
            }

            return data;
        } catch (e: any) {}
    }

    async getFollowing() {
        try {
            let currentPage = 1;

            const maxPage = this.configService.get<number>("MAX_PAGE");
            let data: Array<Following> = [];

            while (currentPage <= maxPage) {
                try {
                    const res = await this.octokit.request(
                        "GET /user/following",
                        {
                            headers: {
                                "X-GitHub-Api-Version": "2022-11-28",
                            },
                            per_page: 100,
                            page: currentPage,
                        }
                    );

                    if (res.status === 200) {
                        data = [
                            ...res.data.map<Following>((following: any) => {
                                return {
                                    id: following.id,
                                    login: following.login,
                                };
                            }),
                            ...data,
                        ];

                        currentPage++;
                    }
                } catch (e: any) {
                    break;
                }
            }

            return data;
        } catch (e: any) {}
    }

    async compareFollowingAndFollowers() {
        try {
            if (!this.followers || !this.following) {
                throw new Error("팔로워와 팔로잉이 존재하지 않습니다.");
            }

            const following = this.following.map((following) => following.id);
            const followers = this.followers.map((follower) => follower.id);

            // 내가 팔로우 하고 있는 사람들 중에서 나를 팔로우 하지 않는 사람들
            const notFollowingBack = this.following.filter(
                (following) => !followers.includes(following.id)
            );

            // 나를 팔로우 하고 있는 사람들 중에서 내가 팔로우 하지 않는 사람들
            const notFollowing = this.followers.filter(
                (follower) => !following.includes(follower.id)
            );

            return {
                notFollowingBack,
                notFollowing,
            };
        } catch (e: any) {}
    }
}
