import type { MusicChartData } from "@/types/lastfm"

async function getTopArtists(username: string, period = "1month") {
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

function determineGenreCategory(tags: string[]): string {
    if (!tags || tags.length === 0) {
        return "Alternative"
    }

    const genreKeywords: Record<string, string[]> = {
        "Pop": ["pop", "dance pop", "electropop", "k-pop", "teen pop", "post-teen pop", "viral pop", "art pop", "indie pop", "synth-pop", "idol", "j-pop", "mandopop", "cantopop", "pop urbaine", "bedroom pop"],
        "Electronic": ["electronic", "edm", "techno", "house", "dubstep", "trance", "drum and bass", "ambient", "electronica", "downtempo", "synthwave", "retrowave", "outrun", "idm", "big room", "future bass", "electro house", "hardstyle", "deep house", "progressive house", "eurodance", "gabber", "breakcore"],
        "Hip Hop": ["hip hop", "rap", "trap", "drill", "grime", "conscious hip hop", "gangsta rap", "boom bap", "mumble rap", "underground hip hop", "french hip hop", "uk hip hop", "desi hip hop", "chicano rap", "dirty south rap"],
        "R&B": ["r&b", "contemporary r&b", "neo soul", "quiet storm", "new jack swing", "urban contemporary", "alt r&b", "indie r&b"],
        "Latin": ["latin", "reggaeton", "latin pop", "bachata", "salsa", "merengue", "cumbia", "latin urban", "latin alternative", "latin rock", "trap latino", "regional mexican", "corridos", "norteño", "banda", "mariachi"],
        "Rock": ["rock", "alternative rock", "indie rock", "classic rock", "psychedelic rock", "grunge", "britpop", "post-grunge", "hard rock", "soft rock", "post-rock", "prog rock", "garage rock", "southern rock", "punk rock", "glam rock", "math rock", "folk rock", "krautrock", "lo-fi rock"],
        "Metal": ["metal", "heavy metal", "death metal", "black metal", "nu metal", "thrash metal", "metalcore", "power metal", "progressive metal", "doom metal", "sludge metal", "symphonic metal", "folk metal", "viking metal", "gothic metal"],
        "Country": ["country", "contemporary country", "outlaw country", "country pop", "country rock", "bluegrass", "americana", "country rap", "nashville sound", "texas country", "red dirt", "modern country rock"],
        "Folk/Acoustic": ["folk", "indie folk", "acoustic", "singer-songwriter", "contemporary folk", "traditional folk", "folk rock", "chamber folk", "freak folk", "new acoustic", "canadian folk", "celtic folk"],
        "Classical": ["classical", "orchestra", "piano", "symphony", "baroque", "opera", "chamber music", "contemporary classical", "neoclassical", "minimalism", "romanticism", "early music", "modern classical"],
        "Jazz": ["jazz", "bebop", "swing", "fusion", "smooth jazz", "vocal jazz", "free jazz", "cool jazz", "modal jazz", "hard bop", "jazz funk", "gypsy jazz", "jazz fusion", "jazz blues", "bossa nova"],
        "Blues": ["blues", "chicago blues", "delta blues", "electric blues", "rhythm and blues", "contemporary blues", "country blues", "jump blues", "texas blues", "blues rock", "modern blues"],
        "Reggae": ["reggae", "dancehall", "ska", "dub", "roots reggae", "lover's rock", "reggae fusion", "riddim", "ragga"],
        "Soul": ["soul", "motown", "funk", "neo-soul", "deep soul", "southern soul", "psychedelic soul", "blue-eyed soul", "northern soul"],
        "World/Traditional": ["world", "bollywood", "indian", "hindi", "ghazal", "sufi", "desi", "bhajan", "qawwali", "marathi", "filmi", "afrobeat", "afropop", "celtic", "klezmer", "balkan", "african", "asian", "middle eastern", "gypsy", "flamenco", "fado", "turkish pop", "arab pop", "thai pop", "japanese traditional", "tuvan throat singing", "mongolian pop"],
        "Easy Listening": ["easy listening", "lounge", "bossa nova", "exotica", "muzak", "adult contemporary", "elevator music", "chill out", "beautiful music", "instrumental pop"],
        "New Age": ["new age", "meditation", "relaxation", "healing", "spiritual", "environmental", "space music", "nature sounds", "ambient worship", "ethereal wave"]
    }

    const counts: Record<string, number> = {}

    for (const tag of tags) {
        const lowerTag = tag.toLowerCase()

        for (const [category, keywords] of Object.entries(genreKeywords)) {
            if (keywords.some((keyword) => keyword === lowerTag)) {
                counts[category] = (counts[category] || 0) + 2
            } else if (keywords.some((keyword) => lowerTag.includes(keyword))) {
                counts[category] = (counts[category] || 0) + 1
            }
        }
    }

    if (Object.keys(counts).length === 0) {
        return "Alternative"
    }

    let maxCategory = "Alternative"
    let maxCount = 0

    for (const [category, count] of Object.entries(counts)) {
        if (count > maxCount) {
            maxCount = count
            maxCategory = category
        }
    }

    return maxCategory
}

function mergeUniqueArtists(artists1: any[], artists2: any[]): any[] {
    const uniqueArtists = new Map<string, any>()

    artists1.forEach((artist) => {
        if (artist && artist.name) {
            uniqueArtists.set(artist.name, artist)
        }
    })

    artists2.forEach((artist) => {
        if (artist && artist.name && !uniqueArtists.has(artist.name)) {
            uniqueArtists.set(artist.name, artist)
        }
    })

    return Array.from(uniqueArtists.values())
}

async function getArtistGenreCategory(artist: any): Promise<string> {
    if (!artist || !artist.name) {
        return "Alternative"
    }

    try {
        const artistInfo = await getArtistInfo(artist.name)
        if (artistInfo && artistInfo.tags && artistInfo.tags.tag) {
            const tags = Array.isArray(artistInfo.tags.tag)
                ? artistInfo.tags.tag.map((t: any) => t.name)
                : [artistInfo.tags.tag.name]
            return determineGenreCategory(tags)
        }
    } catch {
        return "Alternative"
    }

    return "Alternative"
}

async function groupArtistsByGenre(artists: any[]): Promise<Record<string, any[]>> {
    const genreGroups: Record<string, any[]> = {}

    for (const artist of artists) {
        const category = await getArtistGenreCategory(artist)

        if (!genreGroups[category]) {
            genreGroups[category] = []
        }

        const transformedArtist = {
            id: artist.mbid || artist.name,
            name: artist.name,
            image:
                artist.image?.find((img: any) => img.size === "large")?.["#text"] ||
                artist.image?.find((img: any) => img.size === "medium")?.["#text"] ||
                null,
        }

        genreGroups[category].push(transformedArtist)
    }

    return genreGroups
}

function assignPositionsAstrologically(genreGroups: Record<string, any[]>): MusicChartData {
    const positions = {
        sun: ["Rock", "Pop", "Hip Hop", "Electronic", "Alternative"],
        moon: ["R&B", "Soul", "Classical", "Folk/Acoustic", "Easy Listening", "New Age"],
        rising: ["Pop", "Electronic", "Alternative", "Latin", "R&B"],
        venus: ["R&B", "Pop", "Soul", "Classical", "Folk/Acoustic", "Easy Listening"],
        mars: ["Rock", "Metal", "Hip Hop", "Electronic"],
        mercury: ["Hip Hop", "Pop", "Alternative", "Jazz", "R&B"],
        jupiter: ["World/Traditional", "Jazz", "Classical", "Soul", "Reggae"],
        saturn: ["Classical", "Folk/Acoustic", "Blues", "Jazz", "Rock"],
        neptune: ["Electronic", "New Age", "Classical", "Folk/Acoustic", "Pop"],
        pluto: ["Metal", "Rock", "Hip Hop", "Alternative", "Electronic"],
        uranus: ["Electronic", "Alternative", "Hip Hop", "Metal", "Experimental"],
    }

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

    const genreCategories = Object.keys(genreGroups)
    const usedGenres = new Set<string>()

    const getAvailableArtists = (genre: string, count: number) => {
        const artists = genreGroups[genre] || []
        return artists.slice(0, count)
    }

    Object.entries(positions).forEach(([position, affinities]) => {
        const key = position as keyof MusicChartData

        for (const genre of affinities) {
            if (genreGroups[genre] && genreGroups[genre].length > 0 && !usedGenres.has(genre)) {
                chartData[key].sign = genre
                chartData[key].artists = getAvailableArtists(genre, 3)
                usedGenres.add(genre)
                break
            }
        }
    })

    Object.entries(chartData).forEach(([position, data]) => {
        const key = position as keyof MusicChartData

        if (!data.sign || data.artists.length === 0) {
            for (const genre of genreCategories) {
                if (!usedGenres.has(genre) && genreGroups[genre] && genreGroups[genre].length > 0) {
                    chartData[key].sign = genre
                    chartData[key].artists = getAvailableArtists(genre, 3)
                    usedGenres.add(genre)
                    break
                }
            }
        }
    })

    Object.entries(chartData).forEach(([position, data]) => {
        const key = position as keyof MusicChartData

        if (data.artists.length === 0) {
            for (const genre of genreCategories) {
                if (genreGroups[genre] && genreGroups[genre].length > 0) {
                    chartData[key].sign = genre
                    chartData[key].artists = genreGroups[genre].slice(0, 3)
                    break
                }
            }
        }

        if (!data.sign) {
            chartData[key].sign = "Alternative"
        }
    })

    return chartData
}

export async function getLastFmData(username: string): Promise<MusicChartData | null> {
    try {
        const topArtists = await getTopArtists(username, "1month")
        const topTracks = await getTopTracks(username, "1month")

        const trackArtists = topTracks.map((track: any) => ({
            name: track.artist?.name || track.artist,
            mbid: track.artist?.mbid,
            image: track.image,
        }))

        const allArtists = mergeUniqueArtists(topArtists, trackArtists)

        if (allArtists.length === 0) {
            return null
        }

        const genreGroups = await groupArtistsByGenre(allArtists)
        const chartData = assignPositionsAstrologically(genreGroups)

        return chartData
    } catch {
        return null
    }
}