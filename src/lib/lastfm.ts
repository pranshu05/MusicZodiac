import type { MusicChartData } from "@/types/lastfm"

const MIN_ARTISTS_REQUIRED = 5
const MIN_TRACKS_REQUIRED = 10
const MIN_GENRES_REQUIRED = 3

const GENRE_HIERARCHY: Record<string, { primary: string; secondary: string[]; weight: number }> = {
    "Hip Hop": {
        primary: "Hip Hop",
        secondary: ["rap", "trap", "drill", "grime", "conscious hip hop", "gangsta rap", "boom bap", "underground hip hop"],
        weight: 10,
    },
    "R&B": {
        primary: "R&B",
        secondary: ["contemporary r&b", "neo soul", "quiet storm", "new jack swing", "urban contemporary", "alt r&b"],
        weight: 9,
    },
    Electronic: {
        primary: "Electronic",
        secondary: ["edm", "techno", "house", "dubstep", "trance", "drum and bass", "ambient", "electronica", "synthwave"],
        weight: 8,
    },
    Rock: {
        primary: "Rock",
        secondary: ["alternative rock", "indie rock", "classic rock", "hard rock", "punk rock", "grunge", "britpop"],
        weight: 8,
    },
    Metal: {
        primary: "Metal",
        secondary: ["heavy metal", "death metal", "black metal", "thrash metal", "metalcore", "progressive metal"],
        weight: 9,
    },
    Pop: {
        primary: "Pop",
        secondary: ["dance pop", "electropop", "indie pop", "synth-pop", "k-pop", "j-pop", "teen pop"],
        weight: 7,
    },
    Jazz: {
        primary: "Jazz",
        secondary: ["bebop", "swing", "fusion", "smooth jazz", "free jazz", "cool jazz", "bossa nova"],
        weight: 9,
    },
    Classical: {
        primary: "Classical",
        secondary: ["orchestra", "symphony", "baroque", "opera", "chamber music", "contemporary classical"],
        weight: 10,
    },
    Country: {
        primary: "Country",
        secondary: ["contemporary country", "outlaw country", "country pop", "bluegrass", "americana"],
        weight: 8,
    },
    "Folk/Acoustic": {
        primary: "Folk/Acoustic",
        secondary: ["folk", "indie folk", "acoustic", "singer-songwriter", "contemporary folk", "celtic folk"],
        weight: 7,
    },
    Soul: {
        primary: "Soul",
        secondary: ["motown", "funk", "neo-soul", "deep soul", "southern soul", "northern soul"],
        weight: 8,
    },
    Blues: {
        primary: "Blues",
        secondary: ["chicago blues", "delta blues", "electric blues", "country blues", "blues rock"],
        weight: 8,
    },
    Reggae: {
        primary: "Reggae",
        secondary: ["dancehall", "ska", "dub", "roots reggae", "reggae fusion"],
        weight: 7,
    },
    Latin: {
        primary: "Latin",
        secondary: ["reggaeton", "latin pop", "bachata", "salsa", "cumbia", "latin urban", "regional mexican"],
        weight: 7,
    },
    "World/Traditional": {
        primary: "World/Traditional",
        secondary: ["world", "bollywood", "afrobeat", "celtic", "flamenco", "indian", "african"],
        weight: 6,
    },
    Alternative: {
        primary: "Alternative",
        secondary: ["alternative", "indie", "experimental", "art rock", "post-rock"],
        weight: 6,
    },
}

const ASTROLOGICAL_POSITIONS = {
    sun: {
        description: "Core musical identity - the genres that define your essence",
        affinities: ["Rock", "Hip Hop", "Pop", "Electronic"], // Bold, central, identity-defining
        element_preference: ["Fire", "Air"],
        avoid: ["Easy Listening", "New Age"], // Sun is too bold for passive genres
    },
    moon: {
        description: "Emotional musical connection - what moves your soul",
        affinities: ["R&B", "Soul", "Classical", "Folk/Acoustic", "Blues"], // Emotional, introspective
        element_preference: ["Water", "Earth"],
        avoid: ["Metal", "Electronic"], // Moon prefers organic, emotional music
    },
    rising: {
        description: "Musical first impression - how others perceive your taste",
        affinities: ["Pop", "Electronic", "Alternative", "Hip Hop"], // Trendy, accessible
        element_preference: ["Air", "Fire"],
        avoid: ["Classical", "Blues"], // Rising is about current trends
    },
    venus: {
        description: "Musical pleasure and harmony - what brings you joy",
        affinities: ["R&B", "Pop", "Soul", "Jazz", "Latin"], // Beautiful, harmonious, romantic
        element_preference: ["Water", "Air"],
        avoid: ["Metal", "Punk"], // Venus avoids harsh or aggressive music
    },
    mars: {
        description: "Musical energy and drive - what pumps you up",
        affinities: ["Rock", "Metal", "Hip Hop", "Electronic", "Punk"], // Energetic, aggressive
        element_preference: ["Fire"],
        avoid: ["Easy Listening", "Classical", "Folk/Acoustic"], // Mars needs energy
    },
    mercury: {
        description: "Musical communication - complex, lyrical, intellectual",
        affinities: ["Hip Hop", "Jazz", "Alternative", "Folk/Acoustic"], // Lyrical, complex
        element_preference: ["Air", "Earth"],
        avoid: ["Electronic", "Metal"], // Mercury prefers words and complexity
    },
    jupiter: {
        description: "Musical expansion - world music, growth, philosophy",
        affinities: ["World/Traditional", "Jazz", "Classical", "Reggae", "Latin"], // Expansive, cultural
        element_preference: ["Fire", "Water"],
        avoid: ["Punk", "Metal"], // Jupiter is optimistic, not aggressive
    },
    saturn: {
        description: "Musical tradition and structure - timeless, disciplined",
        affinities: ["Classical", "Jazz", "Blues", "Country", "Folk/Acoustic"], // Traditional, structured
        element_preference: ["Earth"],
        avoid: ["Electronic", "Pop"], // Saturn prefers established forms
    },
    uranus: {
        description: "Musical innovation - experimental, revolutionary",
        affinities: ["Electronic", "Alternative", "Experimental", "Punk"], // Innovative, rebellious
        element_preference: ["Air"],
        avoid: ["Country", "Classical"], // Uranus breaks from tradition
    },
    neptune: {
        description: "Musical dreams and spirituality - ethereal, transcendent",
        affinities: ["Electronic", "New Age", "Ambient", "Shoegaze", "Dream Pop"], // Ethereal, dreamy
        element_preference: ["Water"],
        avoid: ["Hip Hop", "Metal"], // Neptune is subtle, not aggressive
    },
    pluto: {
        description: "Musical transformation - intense, powerful, underground",
        affinities: ["Metal", "Industrial", "Dark Electronic", "Hardcore"], // Intense, transformative
        element_preference: ["Water", "Fire"],
        avoid: ["Pop", "Easy Listening"], // Pluto is too intense for light music
    },
}

async function getTopArtists(username: string, period = "3month") {
    try {
        const params = {
            method: "user.getTopArtists",
            api_key: process.env.LASTFM_CLIENT_ID!,
            user: username,
            period: period,
            limit: "50",
        }

        const url = new URL("https://ws.audioscrobbler.com/2.0/")
        Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value))
        url.searchParams.append("format", "json")

        const response = await fetch(url.toString())

        if (!response.ok) {
            throw new Error(`Failed to fetch top artists: ${response.statusText}`)
        }

        const data = await response.json()
        return data.topartists?.artist || []
    } catch {
        return []
    }
}

async function getTopTracks(username: string, period = "1month") {
    try {
        const params = {
            method: "user.getTopTracks",
            api_key: process.env.LASTFM_CLIENT_ID!,
            user: username,
            period: period,
            limit: "50",
        }

        const url = new URL("https://ws.audioscrobbler.com/2.0/")
        Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value))
        url.searchParams.append("format", "json")

        const response = await fetch(url.toString())

        if (!response.ok) {
            throw new Error(`Failed to fetch top tracks: ${response.statusText}`)
        }

        const data = await response.json()
        return data.toptracks?.track || []
    } catch {
        return []
    }
}

async function getArtistInfo(artistName: string) {
    try {
        const params = {
            method: "artist.getInfo",
            api_key: process.env.LASTFM_CLIENT_ID!,
            artist: artistName,
        }

        const url = new URL("https://ws.audioscrobbler.com/2.0/")
        Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value))
        url.searchParams.append("format", "json")

        const response = await fetch(url.toString())

        if (!response.ok) {
            return null
        }

        const data = await response.json()
        return data.artist
    } catch {
        return null
    }
}

function determineGenreFromTags(tags: string[]): { primary: string; confidence: number } {
    if (!tags || tags.length === 0) {
        return { primary: "Alternative", confidence: 0 }
    }

    const genreScores: Record<string, number> = {}

    tags.forEach((tag, index) => {
        const lowerTag = tag.toLowerCase().trim()
        const positionWeight = Math.max(1, 5 - index)

        for (const [genreName, genreData] of Object.entries(GENRE_HIERARCHY)) {
            let matchScore = 0

            if (lowerTag === genreData.primary.toLowerCase()) {
                matchScore = genreData.weight * 3 * positionWeight
            } else if (genreData.secondary.some((keyword) => keyword === lowerTag)) {
                matchScore = genreData.weight * 2 * positionWeight
            } else if (genreData.secondary.some((keyword) => lowerTag.includes(keyword) || keyword.includes(lowerTag))) {
                matchScore = genreData.weight * 1 * positionWeight
            }

            if (matchScore > 0) {
                genreScores[genreName] = (genreScores[genreName] || 0) + matchScore
            }
        }
    })

    if (Object.keys(genreScores).length === 0) {
        return { primary: "Alternative", confidence: 0 }
    }

    let bestGenre = "Alternative"
    let bestScore = 0

    for (const [genre, score] of Object.entries(genreScores)) {
        if (score > bestScore) {
            bestScore = score
            bestGenre = genre
        }
    }

    const maxPossibleScore = GENRE_HIERARCHY[bestGenre]?.weight * 3 * 5 || 1
    const confidence = Math.min(bestScore / maxPossibleScore, 1)

    return { primary: bestGenre, confidence }
}

function mergeUniqueArtists(artists1: any[], artists2: any[]): any[] {
    const uniqueArtists = new Map<string, any>()

    artists1.forEach((artist, index) => {
        if (artist && artist.name) {
            uniqueArtists.set(artist.name, { ...artist, priority: index })
        }
    })

    artists2.forEach((artist, index) => {
        if (artist && artist.name && !uniqueArtists.has(artist.name)) {
            uniqueArtists.set(artist.name, { ...artist, priority: artists1.length + index })
        }
    })

    return Array.from(uniqueArtists.values()).sort((a, b) => (a.priority || 0) - (b.priority || 0))
}

async function getArtistGenreWithConfidence(artist: any): Promise<{ genre: string; confidence: number }> {
    if (!artist || !artist.name) {
        return { genre: "Alternative", confidence: 0 }
    }

    try {
        const artistInfo = await getArtistInfo(artist.name)
        if (artistInfo && artistInfo.tags && artistInfo.tags.tag) {
            const tags = Array.isArray(artistInfo.tags.tag)
                ? artistInfo.tags.tag.map((t: any) => t.name)
                : [artistInfo.tags.tag.name]

            const result = determineGenreFromTags(tags)
            return { genre: result.primary, confidence: result.confidence }
        }
    } catch {
        return { genre: "Alternative", confidence: 0 }
    }

    return { genre: "Alternative", confidence: 0 }
}

async function groupArtistsByGenreWithConfidence(artists: any[],): Promise<Record<string, { artists: any[]; avgConfidence: number }>> {
    const genreGroups: Record<string, { artists: any[]; confidences: number[] }> = {}

    for (const artist of artists) {
        const { genre, confidence } = await getArtistGenreWithConfidence(artist)

        if (!genreGroups[genre]) {
            genreGroups[genre] = { artists: [], confidences: [] }
        }

        const transformedArtist = {
            id: artist.mbid || artist.name,
            name: artist.name,
            confidence,
            priority: artist.priority || 0,
        }

        genreGroups[genre].artists.push(transformedArtist)
        genreGroups[genre].confidences.push(confidence)
    }

    const result: Record<string, { artists: any[]; avgConfidence: number }> = {}

    for (const [genre, data] of Object.entries(genreGroups)) {
        const avgConfidence = data.confidences.reduce((a, b) => a + b, 0) / data.confidences.length
        const sortedArtists = data.artists.sort((a, b) => {
            if (Math.abs(a.confidence - b.confidence) > 0.1) {
                return b.confidence - a.confidence
            }
            return a.priority - b.priority
        })

        result[genre] = {
            artists: sortedArtists,
            avgConfidence,
        }
    }

    return result
}

function assignPositionsAstrologically(genreGroups: Record<string, { artists: any[]; avgConfidence: number }>,): MusicChartData {
    const chartData: MusicChartData = {
        sun: { sign: "", artists: [] },
        moon: { sign: "", artists: [] },
        rising: { sign: "", artists: [] },
        venus: { sign: "", artists: [] },
        mars: { sign: "", artists: [] },
        mercury: { sign: "", artists: [] },
        jupiter: { sign: "", artists: [] },
        saturn: { sign: "", artists: [] },
        neptune: { sign: "", artists: [] },
        pluto: { sign: "", artists: [] },
        uranus: { sign: "", artists: [] },
    }

    const availableGenres = Object.keys(genreGroups).filter(
        (genre) => genreGroups[genre].artists.length > 0 && genreGroups[genre].avgConfidence > 0.2,
    )

    if (availableGenres.length === 0) {
        availableGenres.push(...Object.keys(genreGroups).filter((genre) => genreGroups[genre].artists.length > 0))
    }

    const usedArtists = new Set<string>()
    const genreUsageCount = new Map<string, number>()

    const positionPriority = [
        "sun",
        "moon",
        "rising",
        "venus",
        "mars",
        "mercury",
        "jupiter",
        "saturn",
        "uranus",
        "neptune",
        "pluto",
    ]

    for (const position of positionPriority) {
        const positionData = ASTROLOGICAL_POSITIONS[position as keyof typeof ASTROLOGICAL_POSITIONS]
        const key = position as keyof MusicChartData

        let bestGenre = ""
        let bestScore = 0

        for (const genre of availableGenres) {
            let score = 0

            if (positionData.affinities.includes(genre)) {
                score += 100
            }

            if (positionData.avoid.includes(genre)) {
                score -= 50
            }

            score += genreGroups[genre].avgConfidence * 20

            score += Math.min(genreGroups[genre].artists.length * 5, 25)

            const usageCount = genreUsageCount.get(genre) || 0
            score -= usageCount * 30

            const unusedArtists = genreGroups[genre].artists.filter((artist) => !usedArtists.has(artist.id))
            if (unusedArtists.length >= 3) {
                score += 20
            }

            if (score > bestScore && score > 0) {
                bestScore = score
                bestGenre = genre
            }
        }

        if (bestGenre && genreGroups[bestGenre]) {
            const unusedArtists = genreGroups[bestGenre].artists.filter((artist) => !usedArtists.has(artist.id))

            if (unusedArtists.length > 0) {
                chartData[key].sign = bestGenre

                const selectedArtists = unusedArtists.slice(0, 3)
                chartData[key].artists = selectedArtists.map((artist) => ({
                    id: artist.id,
                    name: artist.name,
                }))

                selectedArtists.forEach((artist) => usedArtists.add(artist.id))

                genreUsageCount.set(bestGenre, (genreUsageCount.get(bestGenre) || 0) + 1)
            }
        }
    }

    for (const position of positionPriority) {
        const key = position as keyof MusicChartData

        if (!chartData[key].sign || chartData[key].artists.length === 0) {
            for (const genre of availableGenres) {
                const unusedArtists = genreGroups[genre].artists.filter((artist) => !usedArtists.has(artist.id))

                if (unusedArtists.length > 0) {
                    chartData[key].sign = genre

                    const selectedArtists = unusedArtists.slice(0, 3)
                    chartData[key].artists = selectedArtists.map((artist) => ({
                        id: artist.id,
                        name: artist.name,
                    }))

                    selectedArtists.forEach((artist) => usedArtists.add(artist.id))
                    genreUsageCount.set(genre, (genreUsageCount.get(genre) || 0) + 1)
                    break
                }
            }
        }
    }

    const filledChartData: Partial<MusicChartData> = {}
    Object.entries(chartData).forEach(([position, data]) => {
        if (data.sign && data.artists.length > 0) {
            filledChartData[position as keyof MusicChartData] = data
        }
    })

    return filledChartData as MusicChartData
}

export class InsufficientDataError extends Error {
    constructor(
        message: string,
        public details: { artists: number; tracks: number; genres: number },
    ) {
        super(message)
        this.name = "InsufficientDataError"
    }
}

export async function getLastFmData(username: string): Promise<MusicChartData | null> {
    try {
        const topArtists = await getTopArtists(username, "1month")
        const topTracks = await getTopTracks(username, "1month")

        if (topArtists.length < MIN_ARTISTS_REQUIRED && topTracks.length < MIN_TRACKS_REQUIRED) {
            throw new InsufficientDataError(
                "Not enough listening data available to generate a meaningful music chart. Please listen to more music on Last.fm and try again.",
                {
                    artists: topArtists.length,
                    tracks: topTracks.length,
                    genres: 0,
                },
            )
        }

        const trackArtists = topTracks.map((track: any) => ({
            name: track.artist?.name || track.artist,
            mbid: track.artist?.mbid,
        }))

        const allArtists = mergeUniqueArtists(topArtists, trackArtists)

        if (allArtists.length < MIN_ARTISTS_REQUIRED) {
            throw new InsufficientDataError(
                "Not enough unique artists in your listening history to generate a comprehensive music chart. Please listen to more diverse music and try again.",
                {
                    artists: allArtists.length,
                    tracks: topTracks.length,
                    genres: 0,
                },
            )
        }

        const genreGroups = await groupArtistsByGenreWithConfidence(allArtists)
        const genreCount = Object.keys(genreGroups).length

        if (genreCount < MIN_GENRES_REQUIRED) {
            throw new InsufficientDataError(
                "Your music taste isn't diverse enough to generate a complete zodiac chart. Try listening to different genres and artists, then generate your chart again.",
                {
                    artists: allArtists.length,
                    tracks: topTracks.length,
                    genres: genreCount,
                },
            )
        }

        const chartData = assignPositionsAstrologically(genreGroups)

        const filledPositions = Object.values(chartData).filter((position) => position.artists.length > 0).length

        if (filledPositions < 5) {
            throw new InsufficientDataError(
                "Unable to generate a music chart with your current listening data. Please listen to more music across different genres and try again.",
                {
                    artists: allArtists.length,
                    tracks: topTracks.length,
                    genres: genreCount,
                },
            )
        }

        return chartData
    } catch (error) {
        if (error instanceof InsufficientDataError) {
            throw error
        }
        return null
    }
}