import type { MusicChartData } from "@/types/spotify"

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

function determineGenreCategory(genres: string[]): string {
    if (!genres || genres.length === 0) {
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

    for (const genre of genres) {
        const lowerGenre = genre.toLowerCase()

        for (const [category, keywords] of Object.entries(genreKeywords)) {
            if (keywords.some(keyword => keyword === lowerGenre)) {
                counts[category] = (counts[category] || 0) + 2
            }
            else if (keywords.some(keyword => lowerGenre.includes(keyword))) {
                counts[category] = (counts[category] || 0) + 1
            }
        }
    }

    if (Object.keys(counts).length === 0) {
        const lowerGenres = genres.map(g => g.toLowerCase())

        if (lowerGenres.some(g => g.includes("bhajan") || g.includes("sufi") || g.includes("filmi") || g.includes("bollywood") || g.includes("desi"))) {
            return "World/Traditional"
        }

        if (lowerGenres.some(g => g.includes("rock") || g.includes("grunge"))) {
            return "Rock"
        }

        if (lowerGenres.some(g => g.includes("pop") || g.includes("viral"))) {
            return "Pop"
        }

        if (lowerGenres.some(g => g.includes("electronic") || g.includes("techno") || g.includes("edm"))) {
            return "Electronic"
        }

        if (lowerGenres.some(g => g.includes("hip hop") || g.includes("rap") || g.includes("trap"))) {
            return "Hip Hop"
        }

        if (lowerGenres.some(g => g.includes("r&b"))) {
            return "R&B"
        }

        if (lowerGenres.some(g => g.includes("country"))) {
            return "Country"
        }

        if (lowerGenres.some(g => g.includes("folk") || g.includes("acoustic"))) {
            return "Folk/Acoustic"
        }

        if (lowerGenres.some(g => g.includes("classical"))) {
            return "Classical"
        }

        if (lowerGenres.some(g => g.includes("jazz"))) {
            return "Jazz"
        }

        if (lowerGenres.some(g => g.includes("blues"))) {
            return "Blues"
        }

        if (lowerGenres.some(g => g.includes("reggae"))) {
            return "Reggae"
        }

        if (lowerGenres.some(g => g.includes("soul"))) {
            return "Soul"
        }

        if (lowerGenres.some(g => g.includes("easy listening") || g.includes("lounge"))) {
            return "Easy Listening"
        }

        if (lowerGenres.some(g => g.includes("new age"))) {
            return "New Age"
        }

        if (lowerGenres.some(g => g.includes("world") || g.includes("traditional"))) {
            return "World/Traditional"
        }

        if (lowerGenres.some(g => g.includes("alternative") || g.includes("indie"))) {
            return "Alternative"
        }

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

function getArtistGenreCategory(artist: any): string {
    if (!artist || !artist.genres || !Array.isArray(artist.genres) || artist.genres.length === 0) {
        return "Alternative" // Default
    }

    return determineGenreCategory(artist.genres)
}

function groupArtistsByGenre(artists: any[]): Record<string, any[]> {
    const genreGroups: Record<string, any[]> = {}

    artists.forEach(artist => {
        const category = getArtistGenreCategory(artist)

        if (!genreGroups[category]) {
            genreGroups[category] = []
        }

        genreGroups[category].push(artist)
    })

    return genreGroups
}

function assignPositionsAstrologically(
    genreGroups: Record<string, any[]>
): MusicChartData {
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
        uranus: ["Electronic", "Alternative", "Hip Hop", "Metal", "Experimental"]
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
        uranus: { sign: "", artists: [] }
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

        if (!data.sign || data.artists.length === 0) {
            for (const genre of genreCategories) {
                const usedArtistIds = new Set(
                    Object.values(chartData)
                        .flatMap(v => v.artists)
                        .map(a => a.id)
                )

                const remainingArtists = genreGroups[genre]?.filter(a => !usedArtistIds.has(a.id)) || []

                if (remainingArtists.length > 0) {
                    chartData[key].sign = genre
                    chartData[key].artists = remainingArtists.slice(0, 3)
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

export async function getSpotifyData(token: string): Promise<MusicChartData | null> {
    try {
        const shortTermArtists = await getTopArtists(token, "short_term")
        const shortTermTracks = await getTopTracks(token, "short_term")
        const shortTermTrackArtists = await getArtistsForTracks(token, shortTermTracks)

        const allShortTermArtists = mergeUniqueArtists(shortTermArtists, shortTermTrackArtists)

        if (allShortTermArtists.length === 0) {
            console.error("No artist data available")
            return null
        }

        const genreGroups = groupArtistsByGenre(allShortTermArtists)

        const chartData = assignPositionsAstrologically(genreGroups)

        return chartData
    } catch (error) {
        console.error("Error generating music chart:", error)
        return null
    }
}