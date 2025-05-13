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

    const genreKeywords = {
        "Pop": ["pop", "dance pop", "electropop", "k-pop", "teen pop", "post-teen pop", "viral"],
        "Rock": ["rock", "alternative rock", "indie rock", "classic rock", "psychedelic rock", "grunge", "britpop", "post-grunge"],
        "Hip-Hop": ["hip hop", "rap", "trap", "drill", "grime"],
        "EDM": ["edm", "electronic", "techno", "house", "dubstep", "trance"],
        "R&B": ["r&b", "soul", "neo soul"],
        "Indie Folk": ["folk", "indie folk", "americana", "singer-songwriter"],
        "Jazz": ["jazz", "bebop", "swing", "fusion"],
        "Classical": ["classical", "orchestra", "piano", "symphony"],
        "Metal": ["metal", "heavy metal", "death metal", "black metal", "nu metal"],
        "Punk": ["punk", "hardcore punk", "pop punk"],
        "Country": ["country", "contemporary country", "outlaw country"],
        "Blues": ["blues", "chicago blues", "delta blues"],
        "Reggae": ["reggae", "dancehall", "ska"],
        "Soul": ["soul", "motown", "funk"],
        "Synthwave": ["synthwave", "retrowave", "outrun"],
        "World": ["bollywood", "indian", "hindi", "ghazal", "sufi", "desi", "bhajan", "qawwali", "marathi", "filmi", "world"]
    }

    const counts: Record<string, number> = {}

    for (const genre of genres) {
        const lowerGenre = genre.toLowerCase()

        for (const [category, keywords] of Object.entries(genreKeywords)) {
            if (keywords.some(keyword => lowerGenre.includes(keyword))) {
                counts[category] = (counts[category] || 0) + 1
            }
        }
    }

    if (Object.keys(counts).length === 0) {
        const lowerGenres = genres.map(g => g.toLowerCase())

        if (lowerGenres.some(g => g.includes("bhajan") || g.includes("sufi") || g.includes("filmi") || g.includes("bollywood") || g.includes("desi"))) {
            return "World"
        }

        if (lowerGenres.some(g => g.includes("rock") || g.includes("grunge"))) {
            return "Rock"
        }

        if (lowerGenres.some(g => g.includes("pop") || g.includes("viral"))) {
            return "Pop"
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
        sun: ["Rock", "Pop", "Alternative", "Metal"],
        moon: ["R&B", "Soul", "Classical", "Indie Folk"], 
        rising: ["Pop", "EDM", "Synthwave", "Alternative"],
        venus: ["R&B", "Pop", "Soul", "Classical", "Indie Folk"],
        mars: ["Rock", "Metal", "Punk", "Hip-Hop"] 
    }

    const chartData: MusicChartData = {
        sun: { sign: "", artists: [] },
        moon: { sign: "", artists: [] },
        rising: { sign: "", artists: [] },
        venus: { sign: "", artists: [] },
        mars: { sign: "", artists: [] }
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