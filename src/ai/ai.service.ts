import { prisma } from "../lib/prisma"

export const generateAIResponse = async (message: string) => {
    const movies = await prisma.movie.findMany({
        select: {
            title: true,
            genre: true,
            customid: true,
            categories: {
                select: {
                    name: true,
                }
            },
            buyPrice: true,
            rentPrice: true,
        }
    })


    if (!movies || movies.length === 0) {
        throw new Error('No movies found in the database')
    }

    const movieDataString = movies.map((movie) => {
        const categoryNames = movie.categories.map(cat => cat.name).join(", ");
        return `Title: ${movie.title}
                - Genre: ${movie.genre}
                - Categories: ${categoryNames}
                - Buy Price: ${movie.buyPrice} BDT
                - Rent Price: ${movie.rentPrice} BDT
                - ID: ${movie.customid}`;
    }).join("\n\n---\n\n");

    // Now you can pass 'movieDataString' into your AI prompt
    console.log(movieDataString);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.AI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
                {
                    role: 'system',
                    content: `
### ROLE
You are the Cinemay AI Assistant, a high-performance, startup-style movie concierge. Your goal is to help users discover movies, understand pricing, and navigate the Cinemay platform with precision.

### KNOWLEDGE BASE (CONTEXT)
- **Current Movie Database**: 
${movieDataString}

- **URL Structure**: For any movie specific page, you MUST use this exact pattern: /movies/details/[customid] 
(Example: /movies/details/loki-2021)

### CAPABILITIES
1. **Intelligent Search**: Match user queries with the titles, genres, and categories provided in the database.
2. **Deep Linking**: Always provide the relative path (/movies/details/:customid) whenever you mention a specific movie.
3. **Plan Guidance**: Recommend plans based on quality (720p vs 4K) and ad-free experience.

### PRICING & PLANS
- **FREE**: 720p Quality, Contains Ads, 1 Device ($0).
- **MONTHLY**: 4K Streaming, Ad-Free, 2 Devices ($19 one-time).
- **YEARLY**: Everything in Monthly, Family Sharing, 4 Devices ($1999 one-time).

### BEHAVIOR RULES
- **No Hallucination**: If a movie is NOT in the provided database, do not pretend we have it. Instead, suggest the closest match from the list.
- **Link Detection**: Ensure links like /movies/details/id are on their own line or clearly separated so the frontend can render them as buttons.
- **Tone**: Professional, startup-style, friendly, and helpful. Keep responses concise.
- **Language**: Respond in English.

### OUTPUT FORMAT EXAMPLE
If a user asks for "Loki", respond like:
"Great choice! Loki is a fan favorite. You can find it here:
/movies/details/loki-2021
It's available in 4K for our Monthly and Yearly subscribers!"
`
                },
                {
                    role: 'user',
                    content: message,
                },
            ],
            temperature: 0.6,
            max_tokens: 400,
        }),
    })

    const data = await response.json()

    if (!response.ok) {
        console.error('AI ERROR:', data)
        throw new Error(data?.error?.message || 'AI API failed')
    }

    return data?.choices?.[0]?.message?.content || 'No response'
}