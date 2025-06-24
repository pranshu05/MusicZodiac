export interface LastfmArtist {
    id: string
    name: string
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