import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generatePlaylistTitle(videoTitles: string[]): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    // Fallback to simple title generation
    return `My Playlist (${videoTitles.length} videos)`
  }

  try {
    const prompt = `Generate a creative and catchy title for a YouTube playlist containing these videos:
${videoTitles.slice(0, 10).map((title, i) => `${i + 1}. ${title}`).join('\n')}
${videoTitles.length > 10 ? `... and ${videoTitles.length - 10} more videos` : ''}

The title should be:
- Concise (max 60 characters)
- Descriptive of the content theme
- Engaging and memorable
- Appropriate for all audiences

Respond with ONLY the playlist title, no quotes or extra text.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a creative YouTube playlist curator. Generate engaging playlist titles based on video content.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 50,
      temperature: 0.8,
    })

    const title = completion.choices[0]?.message?.content?.trim()
    
    if (!title) {
      throw new Error('No title generated')
    }

    // Ensure title isn't too long
    return title.length > 60 ? title.substring(0, 57) + '...' : title
  } catch (error) {
    console.error('Error generating playlist title:', error)
    // Fallback to simple title
    return `My Playlist (${videoTitles.length} videos)`
  }
}

export async function generatePlaylistDescription(videoTitles: string[], playlistTitle: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return `A curated playlist of ${videoTitles.length} videos.`
  }

  try {
    const prompt = `Generate a brief description for a YouTube playlist titled "${playlistTitle}" containing these videos:
${videoTitles.slice(0, 5).map((title, i) => `${i + 1}. ${title}`).join('\n')}
${videoTitles.length > 5 ? `... and ${videoTitles.length - 5} more videos` : ''}

The description should be:
- Brief (max 150 characters)
- Summarize the theme or content
- Engaging but not clickbait
- Appropriate for all audiences

Respond with ONLY the description, no quotes or extra text.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a creative YouTube playlist curator. Generate engaging playlist descriptions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 75,
      temperature: 0.7,
    })

    const description = completion.choices[0]?.message?.content?.trim()
    
    if (!description) {
      throw new Error('No description generated')
    }

    // Ensure description isn't too long
    return description.length > 150 ? description.substring(0, 147) + '...' : description
  } catch (error) {
    console.error('Error generating playlist description:', error)
    return `A curated playlist of ${videoTitles.length} videos.`
  }
}