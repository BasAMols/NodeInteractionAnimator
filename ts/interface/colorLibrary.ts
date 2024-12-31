
export type Colors =
    typeof Color.text |
    typeof Color.dark |
    typeof Color.blue1 |
    typeof Color.blue2;

export abstract class Color {
    public static get text() { return 'color_text' as const; }
    public static get dark() { return 'color_dark' as const; }
    public static get blue1() { return 'color_blue1' as const; }
    public static get blue2() { return 'color_blue2' as const; }
}