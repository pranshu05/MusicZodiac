export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-12 animate-pulse">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl border border-purple-500/20 overflow-hidden h-48 relative">
                    <div className="h-32 bg-gradient-to-r from-purple-700 to-pink-600 relative">
                        <div className="absolute -bottom-16 left-8">
                            <div className="w-32 h-32 rounded-full border-4 border-purple-900 bg-gray-700"></div>
                        </div>
                    </div>
                    <div className="pt-20 pb-6 px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <div className="h-6 bg-gray-600 rounded w-48 mb-2"></div>
                                <div className="h-4 bg-gray-600 rounded w-32"></div>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <div className="h-4 bg-gray-600 rounded w-24"></div>
                                <div className="h-4 bg-gray-600 rounded w-32"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-8">
                    <div className="lg:sticky lg:top-24">
                        <div className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 h-[400px] flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full bg-gray-700 animate-spin-slow"></div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="h-8 bg-gray-600 rounded w-64 mx-auto mb-2"></div>
                            <div className="h-4 bg-gray-600 rounded w-96 mx-auto"></div>
                        </div>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/40 backdrop-blur-md rounded-2xl border border-purple-500/20 p-4 sm:p-5">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-700 flex-shrink-0"></div>
                                        <div className="flex-grow min-w-0">
                                            <div className="h-6 bg-gray-600 rounded w-48 mb-1"></div>
                                            <div className="h-4 bg-gray-600 rounded w-full"></div>
                                        </div>
                                        <div className="w-5 h-5 bg-gray-600 rounded-full flex-shrink-0"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}