import type { MusicChartData } from "@/types/spotify"
import { MUSIC_SIGNS } from "@/utils/constants"

async function getTopArtists(token: string, timeRange = "short_term") {
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=50`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch top artists: ${response.statusText}`)
        }

        const data = await response.json()
        return data.items
    } catch (error) {
        console.error("Error fetching top artists:", error)
        return []
    }
}

async function getTopTracks(token: string, timeRange = "short_term") {
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=50`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch top tracks: ${response.statusText}`)
        }

        const data = await response.json()
        return data.items
    } catch (error) {
        console.error("Error fetching top tracks:", error)
        return []
    }
}

async function getArtistsForTracks(token: string, tracks: any[]) {
    const artistIds = new Set<string>()

    tracks.forEach(track => {
        if (track.artists && Array.isArray(track.artists)) {
            track.artists.forEach((artist: any) => {
                if (artist.id) {
                    artistIds.add(artist.id)
                }
            })
        }
    })

    const uniqueArtistIds = Array.from(artistIds)

    const artistsData = []
    for (let i = 0; i < uniqueArtistIds.length; i += 50) {
        const batch = uniqueArtistIds.slice(i, i + 50)
        if (batch.length === 0) continue

        try {
            const response = await fetch(`https://api.spotify.com/v1/artists?ids=${batch.join(",")}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error(`Failed to fetch artists: ${response.statusText}`)
            }

            const data = await response.json()
            if (data.artists && Array.isArray(data.artists)) {
                artistsData.push(...data.artists)
            }
        } catch (error) {
            console.error("Error fetching artists for tracks:", error)
        }
    }

    return artistsData
}

function normalizeGenre(genre: string): string | null {
    const genreMap: Record<string, string[]> = {
        "Pop": [
            "pop", "dance pop", "electropop", "indie pop", "k-pop", "pop rock", "synth-pop",
            "teen pop", "post-teen pop", "art pop", "chamber pop", "europop", "sophisti-pop",
            "tropical house", "boy band", "girl group", "new wave pop", "viral pop"
        ],
        "Rock": [
            "rock", "alternative rock", "classic rock", "hard rock", "indie rock", "garage rock",
            "psychedelic rock", "progressive rock", "punk rock", "folk rock", "blues rock",
            "soft rock", "arena rock", "grunge", "britpop", "post-rock", "shoegaze",
            "rockabilly", "post-punk", "math rock", "industrial rock", "heartland rock", "space rock"
        ],
        "Hip-Hop": [
            "hip hop", "rap", "trap", "gangsta rap", "drill", "grime", "conscious hip hop",
            "alternative hip hop", "boom bap", "dirty south rap", "east coast hip hop",
            "west coast rap", "underground hip hop", "hardcore hip hop", "southern hip hop",
            "melodic rap", "old school hip hop", "uk hip hop"
        ],
        "EDM": [
            "edm", "electronic", "techno", "trance", "house", "dubstep", "drum and bass",
            "electro", "electronica", "big room", "deep house", "future bass", "hardstyle",
            "tech house", "progressive house", "bass house", "tropical house", "dance",
            "breakbeat", "downtempo", "ambient", "trap music", "uk garage", "jersey club"
        ],
        "R&B": [
            "r&b", "soul", "neo soul", "contemporary r&b", "quiet storm", "urban contemporary",
            "new jack swing", "funk", "motown", "slow jam", "rhythm and blues", "alternative r&b"
        ],
        "Indie Folk": [
            "folk", "indie folk", "folk-pop", "contemporary folk", "chamber folk", "freak folk",
            "folk rock", "americana", "singer-songwriter", "stomp and holler", "roots",
            "acoustic", "traditional folk", "folk punk", "old-time"
        ],
        "Jazz": [
            "jazz", "bebop", "swing", "cool jazz", "fusion", "smooth jazz", "hard bop",
            "contemporary jazz", "modal jazz", "nu jazz", "big band", "free jazz", "gypsy jazz",
            "vocal jazz", "avant-garde jazz", "jazz funk", "bossa nova", "acid jazz"
        ],
        "Classical": [
            "classical", "orchestra", "piano", "contemporary classical", "baroque", "opera",
            "chamber music", "symphony", "minimalism", "neoclassical", "modern classical",
            "violin", "choral", "instrumental", "romantic era", "renaissance", "composer",
            "post-minimalism", "ambient classical", "film score", "soundtrack"
        ],
        "Metal": [
            "metal", "heavy metal", "death metal", "black metal", "thrash metal", "doom metal",
            "power metal", "progressive metal", "metalcore", "nu metal", "symphonic metal",
            "folk metal", "industrial metal", "groove metal", "speed metal", "hardcore",
            "deathcore", "djent", "grindcore", "melodic metal", "sludge metal"
        ],
        "Punk": [
            "punk", "hardcore punk", "post-punk", "pop punk", "skate punk", "emo", "oi",
            "straight edge", "crust punk", "anarcho-punk", "folk punk", "post-hardcore",
            "screamo", "melodic hardcore", "riot grrrl", "ska punk"
        ],
        "Country": [
            "country", "contemporary country", "outlaw country", "country rock", "country pop",
            "bluegrass", "alt-country", "americana", "honky tonk", "nashville sound",
            "texas country", "country road", "country dawn", "neotraditional country",
            "western", "modern country", "bro-country"
        ],
        "Blues": [
            "blues", "chicago blues", "delta blues", "electric blues", "country blues",
            "rhythm and blues", "soul blues", "blues rock", "modern blues", "jump blues",
            "texas blues", "memphis blues", "swamp blues", "british blues"
        ],
        "Reggae": [
            "reggae", "dancehall", "dub", "roots reggae", "ska", "rocksteady", "lover's rock",
            "reggae fusion", "reggaeton", "soca", "calypso", "ragga", "jamaican", "reggae rock"
        ],
        "Soul": [
            "soul", "southern soul", "neo soul", "northern soul", "deep soul", "memphis soul",
            "philly soul", "blue-eyed soul", "psychedelic soul", "soul blues", "chicago soul"
        ],
        "Synthwave": [
            "synthwave", "retrowave", "outrun", "darksynth", "synthpop", "chillwave", "vaporwave",
            "future funk", "electro swing", "cyberpunk", "retro electro", "new retro wave",
            "synth-pop", "dreamwave"
        ],
        "World": [
            "world", "afrobeat", "latin", "flamenco", "celtic", "brazilian", "indian", "arabic",
            "asian", "african", "balkan", "fado", "klezmer", "mariachi", "middle eastern",
            "samba", "tango", "salsa", "bossa nova", "k-pop", "j-pop", "bollywood", "turkish"
        ],
        "Alternative": [
            "alternative", "indie", "lo-fi", "experimental", "art rock", "noise", "dream pop",
            "slowcore", "post-grunge", "britpop", "sadcore", "college rock", "c86",
            "avant-garde", "neo-psychedelia", "new wave", "no wave"
        ]
    }

    const normalizedGenre = genre.toLowerCase()

    for (const [category, patterns] of Object.entries(genreMap)) {
        if (patterns.some(pattern => normalizedGenre.includes(pattern))) {
            return category
        }
    }

    if (normalizedGenre.includes("ambient") || normalizedGenre.includes("chill")) {
        return "Classical"
    } else if (normalizedGenre.includes("funk") || normalizedGenre.includes("disco")) {
        return "Soul"
    } else if (normalizedGenre.includes("emo") || normalizedGenre.includes("screamo")) {
        return "Punk"
    } else if (normalizedGenre.includes("worship") || normalizedGenre.includes("gospel")) {
        return "Soul"
    } else if (normalizedGenre.includes("holiday") || normalizedGenre.includes("christmas")) {
        return "Pop"
    }

    return null
}

function analyzeGenres(artists: any[]): {
    genreCounts: Record<string, number>,
    originalGenres: string[]
} {
    const genreCounts: Record<string, number> = {}
    const originalGenres: string[] = []

    artists.forEach((artist) => {
        if (artist.genres && Array.isArray(artist.genres)) {
            originalGenres.push(...artist.genres)

            artist.genres.forEach((genre: string) => {
                const mappedGenre = normalizeGenre(genre)
                if (mappedGenre) {
                    genreCounts[mappedGenre] = (genreCounts[mappedGenre] || 0) + 1
                }
            })
        }
    })

    return { genreCounts, originalGenres }
}

function calculatePopularityScore(artist: any): number {
    let score = artist.popularity || 0

    if (artist.followers && typeof artist.followers.total === 'number') {
        const followerFactor = Math.log10(1 + artist.followers.total / 1000) * 10
        score += followerFactor
    }

    return score
}

function calculateMusicalProfile(artists: any[]): {
    diversity: number,
    popularity: number,
    genreCounts: Record<string, number>,
    dominantGenres: string[],
    originalGenres: string[]
} {
    if (!artists.length) {
        return {
            diversity: 0.5,
            popularity: 0.5,
            genreCounts: {},
            dominantGenres: [],
            originalGenres: []
        }
    }

    const { genreCounts, originalGenres } = analyzeGenres(artists)

    const totalPopularity = artists.reduce((sum, artist) => sum + calculatePopularityScore(artist), 0)
    const avgPopularity = artists.length ? totalPopularity / artists.length : 50

    const normalizedPopularity = avgPopularity / 100

    const genreTypes = Object.keys(genreCounts)
    const genreEntropy = genreTypes.length === 0 ? 0 :
        1 - (Math.max(...Object.values(genreCounts)) / originalGenres.length)

    const dominantGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0])

    return {
        diversity: genreEntropy,
        popularity: normalizedPopularity,
        genreCounts,
        dominantGenres,
        originalGenres
    }
}

function determineMusicSign(musicalProfile: ReturnType<typeof calculateMusicalProfile>): string {
    const { diversity, popularity, dominantGenres, genreCounts } = musicalProfile

    if (dominantGenres.length > 0) {
        const primaryGenre = dominantGenres[0]
        const primaryCount = genreCounts[primaryGenre] || 0
        const totalGenres = Object.values(genreCounts).reduce((sum, count) => sum + count, 0)

        if (totalGenres > 0 && (primaryCount / totalGenres) > 0.4) {
            return primaryGenre
        }

        if (dominantGenres.length >= 2) {
            const secondaryGenre = dominantGenres[1]

            const genrePair = `${primaryGenre}+${secondaryGenre}`

            switch (genrePair) {
                case "Rock+Metal":
                case "Metal+Rock":
                    return "Metal"
                case "Pop+EDM":
                case "EDM+Pop":
                    return "Pop"
                case "Hip-Hop+R&B":
                case "R&B+Hip-Hop":
                    return "Hip-Hop"
                case "Rock+Indie Folk":
                case "Indie Folk+Rock":
                    return "Rock"
                case "Jazz+Classical":
                case "Classical+Jazz":
                    return "Jazz"
                case "Rock+Punk":
                case "Punk+Rock":
                    return "Punk"
                case "Soul+R&B":
                case "R&B+Soul":
                    return "Soul"
                case "EDM+Synthwave":
                case "Synthwave+EDM":
                    return "Synthwave"
            }
        }

        return primaryGenre
    }

    if (diversity > 0.8) {
        if (popularity > 0.7) {
            return "Pop"
        } else if (popularity < 0.3) {
            return "Alternative"
        } else {
            return "Rock"
        }
    } else if (diversity < 0.3) {
        if (popularity > 0.7) {
            return "Pop"
        } else if (popularity < 0.3) {
            return "Indie Folk"
        } else {
            return "Rock"
        }
    }

    if (popularity > 0.8) {
        return "Pop"
    } else if (popularity < 0.2) {
        return "Alternative"
    }

    return "Rock"
}

function calculateBlendedSign(
    primaryArtists: any[],
    secondaryArtists: any[],
    primaryWeight = 0.7
): string {
    if (primaryArtists.length === 0 && secondaryArtists.length === 0) {
        const availableSigns = Object.keys(MUSIC_SIGNS)
        return availableSigns[Math.floor(Math.random() * availableSigns.length)]
    }

    if (primaryArtists.length === 0) {
        return determineMusicSign(calculateMusicalProfile(secondaryArtists))
    }

    if (secondaryArtists.length === 0) {
        return determineMusicSign(calculateMusicalProfile(primaryArtists))
    }

    const primaryProfile = calculateMusicalProfile(primaryArtists)
    const secondaryProfile = calculateMusicalProfile(secondaryArtists)

    const primaryGenres = primaryProfile.dominantGenres
    const secondaryGenres = secondaryProfile.dominantGenres

    if (primaryGenres.length > 0 && secondaryGenres.length > 0 &&
        primaryGenres[0] === secondaryGenres[0]) {
        return primaryGenres[0]
    }

    const primarySign = determineMusicSign(primaryProfile)
    const secondarySign = determineMusicSign(secondaryProfile)

    if (primarySign === secondarySign) {
        return primarySign
    }

    return Math.random() < primaryWeight ? primarySign : secondarySign
}

export async function getSpotifyData(token: string): Promise<MusicChartData | null> {
    try {

        const shortTermArtists = await getTopArtists(token, "short_term")
        const mediumTermArtists = await getTopArtists(token, "medium_term")
        const longTermArtists = await getTopArtists(token, "long_term")

        const shortTermTracks = await getTopTracks(token, "short_term")
        const mediumTermTracks = await getTopTracks(token, "medium_term")
        const longTermTracks = await getTopTracks(token, "long_term")

        const shortTermTrackArtists = await getArtistsForTracks(token, shortTermTracks)
        const mediumTermTrackArtists = await getArtistsForTracks(token, mediumTermTracks)
        const longTermTrackArtists = await getArtistsForTracks(token, longTermTracks)

        const uniqueShortTermArtists = mergeUniqueArtists(shortTermArtists, shortTermTrackArtists)
        const uniqueMediumTermArtists = mergeUniqueArtists(mediumTermArtists, mediumTermTrackArtists)
        const uniqueLongTermArtists = mergeUniqueArtists(longTermArtists, longTermTrackArtists)

        const sunSign = determineMusicSign(calculateMusicalProfile(uniqueLongTermArtists))
        const moonSign = determineMusicSign(calculateMusicalProfile(uniqueMediumTermArtists))
        const risingSign = determineMusicSign(calculateMusicalProfile(uniqueShortTermArtists))

        const venusSign = calculateBlendedSign(
            uniqueMediumTermArtists,
            uniqueLongTermArtists,
            0.6
        )

        const marsSign = calculateBlendedSign(
            uniqueShortTermArtists,
            uniqueMediumTermArtists,
            0.7
        )

        const chartData: MusicChartData = {
            sun: {
                sign: sunSign,
                artists: longTermArtists.slice(0, 3),
            },
            moon: {
                sign: moonSign,
                artists: mediumTermArtists.slice(0, 3),
            },
            rising: {
                sign: risingSign,
                artists: shortTermArtists.slice(0, 3),
            },
            venus: {
                sign: venusSign,
                artists: [...mediumTermArtists, ...longTermArtists]
                    .filter((artist, index, self) =>
                        index === self.findIndex(a => a.id === artist.id))
                    .slice(0, 20)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3),
            },
            mars: {
                sign: marsSign,
                artists: [...shortTermArtists, ...mediumTermArtists]
                    .filter((artist, index, self) =>
                        index === self.findIndex(a => a.id === artist.id))
                    .slice(0, 20)
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 3),
            },
        }

        return chartData
    } catch (error) {
        console.error("Error generating music chart:", error)
        return null
    }
}

function mergeUniqueArtists(artists1: any[], artists2: any[]): any[] {
    const uniqueArtists = new Map<string, any>()

    artists1.forEach(artist => {
        if (artist && artist.id) {
            uniqueArtists.set(artist.id, artist)
        }
    })

    artists2.forEach(artist => {
        if (artist && artist.id && !uniqueArtists.has(artist.id)) {
            uniqueArtists.set(artist.id, artist)
        }
    })

    return Array.from(uniqueArtists.values())
}