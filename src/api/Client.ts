export class Client {
  public static readonly BASE_URL = "https://www.speedrun.com/api/v1";

  static async getData(url: string, query?: URLSearchParams): Promise<Response> {
    return (await fetch(`${Client.BASE_URL}${url}?${query}`));
  }
}