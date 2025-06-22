export interface LastfmArtist {
    id: string
    name: string
    image?: string
}

export interface MusicSign {
    sign: string
    artists: LastfmArtist[]
}

export interface MusicChartData {
    sun: MusicSign
    moon: MusicSign
    rising: MusicSign
    venus: MusicSign
    mars: MusicSign
    [key: string]: MusicSign
}

export interface LastfmTrack {
    id: string
    name: string
    artists: LastfmArtist[]
    album: {
        images: { url: string; height: number; width: number }[]
    }
}

export interface AudioFeatures {
    id: string
    danceability: number
    energy: number
    key: number
    loudness: number
    mode: number
    speechiness: number
    acousticness: number
    instrumentalness: number
    liveness: number
    valence: number
    tempo: number
    duration_ms: number
    time_signature: number
}