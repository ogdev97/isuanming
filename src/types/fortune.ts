export interface Pillar {
    score: number;
    text: string;
    text_zh: string;
}

export interface FortuneReport {
    zodiac: string;
    zodiac_zh: string;
    element: string;
    element_zh: string;
    kua: number;
    overview: string;
    overview_zh: string;
    pillars: {
        career: Pillar;
        wealth: Pillar;
        love: Pillar;
        health: Pillar;
    };
    lucky: {
        colors: string[];
        colors_zh: string[];
        numbers: string[];
        numbers_zh: string[];
        directions: string[];
        directions_zh: string[];
    };
}
