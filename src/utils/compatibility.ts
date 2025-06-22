import { MUSIC_SIGNS } from "@/utils/constants";
import type { MusicChartData } from "@/types/lastfm";

export const calculateCompatibility = (userChart: MusicChartData, otherChart: MusicChartData) => {
    const signMatches = Object.entries(userChart).filter(([position, data]) => otherChart[position as keyof MusicChartData]?.sign === data.sign).map(([position]) => position);
    const signScore = (signMatches.length / Object.keys(userChart).length) * 40;

    const allArtists = Object.values(userChart).flatMap(data => data.artists.map(a => a.id));
    const otherArtists = Object.values(otherChart).flatMap(data => data.artists.map(a => a.id));
    const uniqueArtistMatches = new Set([...allArtists].filter(id => otherArtists.includes(id)));
    const artistScore = (uniqueArtistMatches.size / Math.max(allArtists.length, 1)) * 30;

    const allSigns = Object.values(userChart).map(data => data.sign);
    const otherSigns = Object.values(otherChart).map(data => data.sign);
    const planetMatches = allSigns.map((sign, i) => {
        const currentSignData = MUSIC_SIGNS[sign as keyof typeof MUSIC_SIGNS];
        const otherSignData = MUSIC_SIGNS[otherSigns[i] as keyof typeof MUSIC_SIGNS];
        return currentSignData?.planet === otherSignData?.planet ? 1 : 0;
    }).reduce<number>((a, b) => a + b, 0);
    const planetScore = (planetMatches / Object.keys(userChart).length) * 20;

    const elementMatches = allSigns.map((sign, i) => {
        const currentSignData = MUSIC_SIGNS[sign as keyof typeof MUSIC_SIGNS];
        const otherSignData = MUSIC_SIGNS[otherSigns[i] as keyof typeof MUSIC_SIGNS];
        return currentSignData?.element === otherSignData?.element ? 1 : 0;
    }).reduce<number>((a, b) => a + b, 0);
    const elementScore = (elementMatches / Object.keys(userChart).length) * 10;

    const totalScore = Math.min(Math.round(signScore + artistScore + planetScore + elementScore), 100);

    return {
        score: totalScore,
        matchingSigns: signMatches,
        matchingArtists: uniqueArtistMatches.size,
        matchingPlanets: planetMatches,
        matchingElements: elementMatches,
    };
};